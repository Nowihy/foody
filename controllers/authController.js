const crypto = require('crypto')
const {promisify} = require('util')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')

const signToken = id =>{
    return jwt.sign({id},process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN})
}

const createSendToken = (user,statusCode,res)=>{
    const token = signToken(user._id)
    const cookieOptions ={
        expires : new Date(Date.now()+process.env.JWT_EXPIRES_COOKIE_IN*24*60*60*1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV==='production') cookieOptions.secure =true
    res.cookie('jwt',token,cookieOptions)
    user.password=undefined,
    res.status(statusCode).json({
        status: 'success',
        token,
        data:{
            user
        }
    })
}

exports.signUp =catchAsync( async (req,res,next)=>{
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role:req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })
    createSendToken(newUser,201,res)
});

exports.logIn =catchAsync( async (req,res,next)=>{
    const {email,password} = req.body ;
    console.log(email, password);
        if(!email ||!password){
            return next(new AppError('please provide email and password',400))
        }
        const user =await User.findOne({email}).select('+password')
        if(!user||!await user.correctPassword(password,user.password)){
            return next(new AppError('incorrect email or password',401))
        }
        createSendToken(user,200,res)
    })

exports.protect = catchAsync(async(req,res,next)=>{
    //1) get user token
    let token ;
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new AppError('You are not logged in',401))
    }
    //2) verification token
    const decoded =await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    
    //3) check if user still exist
    const freshUser = await User.findById(decoded.id)
    if(!freshUser){
        return next(new AppError('The user belong to this token does no longer exist',401))
    }
    //4) check if userchanged password after the token was issued
    if(freshUser.changePasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! please log in again',401))
    }
    req.user = freshUser ;
    next()
})

exports.restrictTO = (...roles)=>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('this role don not have the permission to do that',403))
        }
        next()
}}
exports.forgetPassword =catchAsync( async(req,res,next)=>{
    //1) get user by his Email
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new AppError('there is no user with this Email Address',404))
    }
    //2) generate random reset token
    const resetToken = user.createPasswordResetToken() ;
    await user.save({ validateBeforeSave: false })
    //3) send it to user
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/${resetToken}`;
    
    try {
        // await new Email(user, resetURL).sendPasswordReset();
        res.status(200).json({
        status: 'success',
        message: 'Token has been sent to your email!',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email, try again later!',500));
    }
    })
exports.resetPassword = catchAsync(async (req,res,next)=>{
    //1) Get user based on Token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user =await User.findOne({passwordResetToken:hashedToken,passwordResetExpire:{$gt:Date.now()}})
    //2)if token has not expired,and there is user,set the new password
    if(!user){
        return next(new AppError('token is invalid or has expired',400))
    }
    user.password=req.body.password
    user.passwordConfirm=req.body.passwordConfirm
    user.passwordResetToken=undefined
    user.passwordResetExpire=undefined
    await user.save()
    //3) Update changedpasswordAt property for the user
    //4) Log the user in,Send tokens
    createSendToken(user,200,res)
})

exports.updatePassword =catchAsync( async (req,res,next)=>{
    //1) get user from collection
    const user = await User.findById(req.user.id).select('+password')
    //2) check if posted password is correct
    if(! await user.correctPassword(req.body.currentPassword,user.password)){
        return next(new AppError('your current password is wrong',401))
    }
    //3) update password
    user.password=req.body.password
    user.passwordConfirm=req.body.passwordConfirm
    await user.save()
    //4) log user in and send token
    createSendToken(user,200,res)
})