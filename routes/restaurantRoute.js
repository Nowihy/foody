const express = require('express')
const router = express.Router()
const restaurantController = require('./../controllers/restaurantController')
const itemController = require('./../controllers/itemController')
const itemRouter = require('./itemRoute')

router
.route('/')
.get(restaurantController.getAllRestaurants)
.post(restaurantController.createRestaurant)

router.route('/:id')
.patch(restaurantController.updateRestaurant)
.delete(restaurantController.deleteRestaurant)
.get(restaurantController.getOneRestaurant)

// router.route('/:resataurantId/items')
// .post(
//     itemController.setRestaurantAndUserIDs,
//     itemController.createItem
// )

router.use('/:restaurantId/items',itemRouter)

module.exports=router