require("dotenv").config();

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://patcharadnaimingchua.github.io",
    "https://e-commerce-jet-two-95.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const reviewRoutes = require('./routes/review.routes');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/reviews', reviewRoutes);

app.get("/", (req, res) => {
    res.send("Ecommerce API running");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});