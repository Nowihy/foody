const express = require('express')
const router = express.Router()
const restaurantController = require('./../controllers/restaurantController')
const itemController = require('./../controllers/itemController')
const itemRouter = require('./itemRoute')
const authController = require('./../controllers/authController')
const ratingRouter = require('./ratingRoute')

router.use(authController.protect)


router
.route('/restaurants-within/:distance/center/:latlng/unit/:unit')
.get(restaurantController.getRestaurantWithin)

router
.route('/distances/:latlng/unit/:unit')
.get(restaurantController.getDistances)

router
.route('/')
.get(restaurantController.getAllRestaurants)
.post(authController.restrictTO('admin','res-admin'),restaurantController.createRestaurant)

router.route('/:id')
.patch(authController.restrictTO('admin','res-admin'),restaurantController.uploadRestaurantPhoto,restaurantController.resizeRestaurantPhoto,restaurantController.updateRestaurant)
.delete(authController.restrictTO('admin','res-admin'),restaurantController.deleteRestaurant)
.get(restaurantController.getOneRestaurant)

// router.route('/:resataurantId/items')
// .post(
//     itemController.setRestaurantAndUserIDs,
//     itemController.createItem
// )

router.use('/:restaurantId/items',itemRouter)
router.use('/:restaurantId/ratings',ratingRouter)


module.exports=router