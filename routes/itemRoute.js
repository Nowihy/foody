const express = require('express')
const router = express.Router({mergeParams:true})
const itemController = require('./../controllers/itemController')
const restaurantController = require('./../controllers/restaurantController')

router
.route('/')
.get(itemController.getAllItems)
.post(
    itemController.setRestaurantIDs,
    itemController.createItem
);

router
.route('/:id')
.get(itemController.getOneItem)
.patch(itemController.uploadItemPhoto,itemController.resizeItemPhoto,itemController.updateItem)
.delete(itemController.deleteItem);


module.exports = router