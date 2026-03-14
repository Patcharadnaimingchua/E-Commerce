const express = require('express')
const router = express.Router()

const cartController = require('../controllers/cart.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/', authMiddleware, cartController.addToCart)
router.get('/:userId', authMiddleware, cartController.getCart)
router.delete('/:id', authMiddleware, cartController.removeCartItem)

module.exports = router