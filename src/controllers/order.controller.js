const prisma = require('../config/prisma')

async function createOrder(req,res){

 const {userId} = req.body

 const cartItems = await prisma.cartItem.findMany({
  where:{ userId },
  include:{ product:true }
 })

 if(cartItems.length === 0){
  return res.json({message:"Cart empty"})
 }

 let totalPrice = 0

 cartItems.forEach(item=>{
  totalPrice += item.product.price * item.quantity
 })

 const order = await prisma.order.create({
  data:{
   userId,
   totalPrice,
   status:"pending"
  }
 })

 for(const item of cartItems){
  await prisma.orderItem.create({
   data:{
    orderId:order.id,
    productId:item.productId,
    quantity:item.quantity,
    price:item.product.price
   }
  })
 }

 await prisma.cartItem.deleteMany({
  where:{ userId }
 })

 res.json(order)

}

async function getOrders(req,res){

 const userId = parseInt(req.params.userId)

 const orders = await prisma.order.findMany({
  where:{ userId },
  include:{ items:true }
 })

 res.json(orders)

}
async function getAllOrders(req,res){

 const orders = await prisma.order.findMany({
  include:{
   user:true,
   items:{
    include:{
     product:true
    }
   }
  }
 })

 res.json(orders)
}

module.exports = {
 createOrder,
 getOrders,
 getAllOrders
}