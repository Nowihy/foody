const Item = require('../models/itemModel')
const AppError = require('../utils/appError')
const catchAsync = require('./../utils/catchAsync')
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
    fileFilter:multerFilter
})

exports.uploadItemPhoto = upload.single('photo')

exports.resizeItemPhoto =catchAsync(async(req,res,next)=>{
    req.file.filename = `item-${req.params.id}-${Date.now()}.jpeg`
    if(!req.file) return next() ;
    await sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:99})
    .toFile(`public/img/items/${req.file.filename}`)
    next()
})

exports.setRestaurantIDs=(req,res,next)=>{
    //allow nested route 
    if(!req.body.restaurant) req.body.restaurant = req.params.restaurantId
    next()
}

exports.createItem = Factory.createOne(Item)
exports.deleteItem = Factory.deleteOne(Item)
exports.updateItem = Factory.updateOne(Item)
exports.getAllItems = Factory.getAll(Item)
exports.getOneItem = Factory.getOne(Item)


// exports.createItem=catchAsync( async (req,res,next)=>{ 
//     if(!req.body.user) req.body.user = req.user.id
//     if(!req.body.restaurant) req.body.restaurant = req.params.resataurantId
//     const item = await Item.create(req.body)
//     res.status(201).json({
//         statue:'success',
//         data:{
//             data:item
//         }
//     })
// })