const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.post('/', orderController.placeOrder);
router.get('/',orderController.getAllOrders)

router.route('/:id')
.delete(orderController.deleteOrder)
.get(orderController.getOneOrder)
.patch(orderController.updateOneOrder)

router.put('/:orderId',authController.restrictTO('delivery'),orderController.updateOrderStatue)

module.exports = router;
