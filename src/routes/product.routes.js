const express = require('express')
const router = express.Router()

const productController = require('../controllers/product.controller')
const authMiddleware = require('../middleware/auth.middleware')
const adminMiddleware = require('../middleware/admin.middleware')
// public
router.get('/', productController.getProducts)
router.get('/:id', productController.getProductById)

// admin only
router.post('/', authMiddleware, adminMiddleware, productController.createProduct)
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct)
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct)

module.exports = router