const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Factory = require('./factoryHandler')
const multer = require('multer')
const sharp = require('sharp')


const multerStorage = multer.memoryStorage()

const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new AppError('It is not an image, please upload an image',400),false)
    }
}

const upload = multer({
    storage:multerStorage,
    fileFilter: multerFilter
})

exports.uploadUserPhoto = upload.single('photo')

exports.resizeUserPhoto =catchAsync(async(req,res,next)=>{
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
    if(!req.file) return next() ;
    await sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/users/${req.file.filename}`)
    next()
})


const filterObj = (obj, ...allowedFields)=>{
    const newObj ={}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el] = obj[el] 
    })
    return newObj
}

exports.updateMe = catchAsync(async(req,res,next)=>{
    if(req.user.password||req.user.passwordConfirm){
        return next(new AppError('This route is for updating password you can not update your password here',400))
    }
    const filteredBody = filterObj(req.body,'name','email')
    if(req.file) filteredBody.photo = req.file.filename
    //3)update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        status:'success',
        data:{
            user:updatedUser
        }
    })
})

exports.deleteMe= catchAsync(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false})
    res.status(204).json({
        status:'success',
        data:null
    })
})

exports.getMe=(req,res,next)=>{
    req.params.id=req.user.id
    next()
}

exports.getAllUsers = Factory.getAll(User)
exports.getOneUser = Factory.getOne(User)
exports.updateUser = Factory.updateOne(User)
exports.deleteUser = Factory.deleteOne(User)