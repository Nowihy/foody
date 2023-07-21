const Order = require('./../models/orderModel')
const AppError = require('../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const Item = require('./../models/itemModel')
const Factory = require('./factoryHandler')

exports.placeOrder = catchAsync(async (req, res, next) => {
    if(!req.body.user) req.body.user = req.user.id
    const { items } = req.body;
      // Calculate the total price
    let totalPrice = 0;
    for (const item of items) {
        const { itemId, quantity } = item;
        // console.log(itemId)
        const itemData = await Item.findById(itemId);
        totalPrice += quantity*itemData.price ;
        // console.log(totalPrice)
    }
      // Create the order document
    const order = await Order.create({
        user: req.user.id,
        items,
        totalPrice
    });
    res.status(201).json({
        status: 'success',
        data: {
        order
        }
    });
});
exports.updateOneOrder = (req,res,next)=>{
  res.status(201).json({
    statue:'success',
    message:'there is a problem with this route it can not update total price'
  })
}

exports.getAllOrders = Factory.getAll(Order)
exports.getOneOrder = Factory.getOne(Order)
exports.deleteOrder = Factory.deleteOne(Order)
// exports.updateOrder = Factory.updateOne(Order)
