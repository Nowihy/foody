const express = require('express')
const router = express.Router({mergeParams:true})
const ratingController = require('./../controllers/ratingController')
const authController = require('./../controllers/authController')

// router.use(authController.protect)

router.route('/')
.get(ratingController.getAllRatings)
.post(ratingController.setRestaurantandUserIDs,ratingController.createRating)
router.route('/:id')
.get(ratingController.getOneRating)
.patch(ratingController.updateRating)
.delete(ratingController.deleteRating)

module.exports = router