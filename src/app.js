require("dotenv").config();
const express = require ('express');
const cors = require('cors')
const app = express();
const authRoutes = require('./routes/auth.routes')
const productRoutes = require('./routes/product.routes')
const categoryRoutes = require('./routes/category.routes')
const cartRoutes = require('./routes/cart.routes')
const orderRoutes = require('./routes/order.routes')
const paymentRoutes = require('./routes/payment')
const reviewRoutes = require('./routes/review.routes')

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)
app.use('/payments', paymentRoutes)
app.use('/reviews', reviewRoutes)
app.get ("/", (req, res) => {
    res.send("Ecommerce API running")
})

app.listen(3000,() =>{
    console.log("Server running on port 3000")
})

