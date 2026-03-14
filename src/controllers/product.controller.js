const prisma = require('../config/prisma.js')

async function getProducts(req, res) {

    const products = await prisma.product.findMany()
    res.json(products)

}

async function createProduct(req, res) {

    const { name, description, price, stock, imageUrl, categoryId } = req.body

    const product = await prisma.product.create({
        data: {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            imageUrl,
            categoryId: Number(categoryId)
        }
    })

    res.json(product)

}
async function getProductById(req, res) {
    const id = parseInt(req.params.id)
    const product = await prisma.product.findUnique({
        where: {
            id: id
        }
    })
    res.json(product)
}
async function updateProduct(req, res) {
    const id = parseInt(req.params.id)
    const { name, description, price, stock, imageUrl, categoryId } = req.body
    const product = await prisma.product.update({
        where: {
            id: id
        },
        data: {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            imageUrl,
            categoryId: Number(categoryId)
        }
    })
    res.json(product)
}
async function deleteProduct(req, res) {

    const id = parseInt(req.params.id)

    try {

        // ลบ relation ก่อน
        await prisma.cartItem.deleteMany({
            where: { productId: id }
        })

        await prisma.orderItem.deleteMany({
            where: { productId: id }
        })

        await prisma.review.deleteMany({
            where: { productId: id }
        })

        const product = await prisma.product.delete({
            where: { id }
        })

        res.json({
            message: "Product deleted",
            product
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({
            message: "Delete failed",
            error: err.message
        })

    }

}

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
}