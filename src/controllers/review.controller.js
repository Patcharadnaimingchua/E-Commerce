const prisma = require('../config/prisma')

async function createReview(req,res){

 try{

 const { userId, productId, rating, comment } = req.body

 if(rating < 1 || rating > 5){
  return res.json({message:"Rating must be 1-5"})
 }

 const existingReview = await prisma.review.findFirst({
  where:{ userId, productId }
 })

 if(existingReview){
  return res.json({message:"You already reviewed this product"})
 }

 const review = await prisma.review.create({
  data:{
   userId,
   productId,
   rating,
   comment
  }
 })

 res.json(review)

 }catch(err){

  res.status(500).json({error:err.message})

 }

}

async function getProductReviews(req,res){

 try{

 const productId = parseInt(req.params.productId)

 const reviews = await prisma.review.findMany({
  where:{ productId },
  include:{ user:true }
 })

 res.json(reviews)

 }catch(err){

  res.status(500).json({error:err.message})

 }

}

module.exports = {
 createReview,
 getProductReviews
}