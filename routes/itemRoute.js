const express = require('express')
const router = express.Router({mergeParams:true})
const itemController = require('./../controllers/itemController')
const restaurantController = require('./../controllers/restaurantController')
const authController = require('./../controllers/authController')

router.use(authController.protect)

router
.route('/')
.get(itemController.getAllItems)
.post(
    authController.restrictTO('admin','res-admin'),
    itemController.setRestaurantIDs,
    itemController.createItem
);

router
.route('/:id')
.get(itemController.getOneItem)
.patch(authController.restrictTO('admin','res-admin'),itemController.uploadItemPhoto,itemController.resizeItemPhoto,itemController.updateItem)
.delete(authController.restrictTO('admin','res-admin'),itemController.deleteItem);


module.exports = router