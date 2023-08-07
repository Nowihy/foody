const Order = require('./../models/orderModel')
const AppError = require('../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const Item = require('./../models/itemModel')
const Factory = require('./factoryHandler')
const User = require('./../models/userModel')



async function getRandomDeliveryPerson() {
  const deliveryUsers = await User.find({ role: 'delivery' });
  const order =await Order.find({statue : 'out-for-delivery',statue:'pending'})
  const userDeliveryIDS = deliveryUsers.map(deliveryUser=> deliveryUser._id)
  const deliveryPersonIds = order.map(order => order.deliveryPerson);

  const availableDeliveryIds = userDeliveryIDS.filter(id => !deliveryPersonIds.some(deliveryId => id.equals(deliveryId)));
  // console.log(availableDeliveryIds);
  if (availableDeliveryIds.length===0) {
    throw new Error('No available delivery persons found');
  } else {
    const availableDelivery = availableDeliveryIds.length
    // Generate a random index within the range of available delivery users
    const randomIndex = Math.floor(Math.random() * availableDelivery);
    // Get the selected delivery person from the random index
    const selectedUser = availableDeliveryIds[randomIndex];
    return selectedUser._id; 
  }
}





exports.placeOrder = catchAsync(async (req, res, next) => {
    if(!req.body.user) req.body.user = req.user.id
    const { items } = req.body;
    const deliveryPerson = await getRandomDeliveryPerson();
      // Calculate the total price
    let totalPrice = 0;
    let totalQuantity = 0
    for (const item of items) {
        const { itemId, quantity } = item;
        // console.log(itemId)
        const itemData = await Item.findById(itemId);
        totalPrice += quantity*itemData.price ;
        totalQuantity += quantity
        // console.log(totalQuantity)
        // console.log(totalPrice)
    }
      // Create the order document
    const order = await Order.create({
        user: req.user.id,
        items,
        totalPrice,
        totalQuantity,
        deliveryPerson
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

exports.protectDelivery = catchAsync(async(req,res,next)=>{
  const authenticatedUser = req.user;
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId).populate('deliveryPerson');
  if (
    !order.deliveryPerson ||
    !order.deliveryPerson._id.equals(authenticatedUser._id)
  ){
    return next(new AppError('You are not authorized to update the order status',403))
  }
  next()
})


exports.updateOrderStatue = catchAsync(async(req,res,next)=>{
  const { orderId } = req.params;
  const { newStatue } = req.body;
  const order = await Order.findByIdAndUpdate(
    orderId,
    { statue: newStatue, statusUpdatedAt: Date.now() },
    { new: true },
  )
  res.status(201).json({
    statue:'success',
    data:order
  })
})

exports.getAllOrders = Factory.getAll(Order)
exports.getOneOrder = Factory.getOne(Order)
exports.deleteOrder = Factory.deleteOne(Order)
// exports.updateOrder = Factory.updateOne(Order)
