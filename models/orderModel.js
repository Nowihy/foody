const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Order = mongoose.model('Order',orderSchema)

module.exports = Order