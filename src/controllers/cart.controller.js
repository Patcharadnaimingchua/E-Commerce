const prisma = require('../config/prisma')

async function addToCart(req, res) {

 try{

  const { userId, productId, quantity } = req.body

  // check ว่ามีสินค้านี้ใน cart หรือยัง
  const existingItem = await prisma.cartItem.findFirst({
   where:{
    userId:userId,
    productId:productId
   }
  })

  let cartItem

  // ถ้ามีแล้ว → เพิ่ม quantity
  if(existingItem){

   cartItem = await prisma.cartItem.update({
    where:{
     id:existingItem.id
    },
    data:{
     quantity:{
      increment:quantity
     }
    }
   })

  }else{

   // ถ้ายังไม่มี → create
   cartItem = await prisma.cartItem.create({
    data:{
     userId,
     productId,
     quantity
    }
   })

  }

  res.json(cartItem)

 }catch(err){

  res.status(500).json({error:err.message})

 }

}

async function getCart(req,res){

 try{

  const userId = parseInt(req.params.userId)

  const cart = await prisma.cartItem.findMany({
   where:{
    userId:userId
   },
   include:{
    product:true
   }
  })

  res.json(cart)

 }catch(err){

  res.status(500).json({error:err.message})

 }

}

async function removeCartItem(req,res){

 try{

  const id = parseInt(req.params.id)

  await prisma.cartItem.delete({
   where:{
    id:id
   }
  })

  res.json({
   message:"Item removed"
  })

 }catch(err){

  res.status(500).json({error:err.message})

 }

}

module.exports = {
 addToCart,
 getCart,
 removeCartItem
}