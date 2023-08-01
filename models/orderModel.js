const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    name:{
        required:[true,'Order must have name'],
        type:String,
        default: 'My Order'
    },
    user : {
        required:[true,'Order must belong to user'],
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    items: [
        {
        item: {
            type: mongoose.Schema.ObjectId,
            ref: 'item',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    totalQuantity:{
        type:Number,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    statue:{
        type:String,
        default: 'pending',
        enum:['delivered','pending','out-for-delivery','confirmed and preparing']
    },
    statusUpdatedAt: {
        type: Date,
        default: Date.now(),
    },
    
      // Add a field for storing the delivery person's information (optional)
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:[true,'order must belong to a delivery person']
    }
});

const Order = mongoose.model('Order',orderSchema)

module.exports = Order