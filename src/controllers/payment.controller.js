const prisma = require('../config/prisma')

async function createPayment(req,res){

 try{

 const { orderId, method } = req.body

 const order = await prisma.order.findUnique({
  where:{ id:orderId }
 })

 if(!order){
  return res.json({message:"Order not found"})
 }

 if(order.status === "paid"){
  return res.json({message:"Order already paid"})
 }

 const payment = await prisma.payment.create({
  data:{
   orderId,
   amount:order.totalPrice,
   method,
   status:"paid"
  }
 })

 await prisma.order.update({
  where:{ id:orderId },
  data:{ status:"paid" }
 })

 res.json(payment)

 }catch(err){

  res.status(500).json({error:err.message})

 }

}

module.exports = {
 createPayment
}