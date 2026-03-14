const express = require('express')
const router = express.Router()

const orderController = require('../controllers/order.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/', authMiddleware, orderController.createOrder)

router.get('/:userId', authMiddleware, orderController.getOrders)

module.exports = router