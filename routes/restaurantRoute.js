const express = require('express')
const router = express.Router()
const restaurantController = require('./../controllers/restaurantController')
const itemController = require('./../controllers/itemController')
const itemRouter = require('./itemRoute')
const authController = require('./../controllers/authController')
const ratingRouter = require('./ratingRoute')

router.use(authController.protect)

router
.route('/')
.get(restaurantController.getAllRestaurants)
.post(restaurantController.createRestaurant)

router.route('/:id')
.patch(restaurantController.uploadRestaurantPhoto,restaurantController.resizeRestaurantPhoto,restaurantController.updateRestaurant)
.delete(restaurantController.deleteRestaurant)
.get(restaurantController.getOneRestaurant)

// router.route('/:resataurantId/items')
// .post(
//     itemController.setRestaurantAndUserIDs,
//     itemController.createItem
// )

router.use('/:restaurantId/items',itemRouter)
router.use('/:restaurantId/ratings',ratingRouter)


module.exports=router