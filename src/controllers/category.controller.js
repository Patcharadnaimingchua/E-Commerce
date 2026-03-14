const prisma = require('../config/prisma')

async function getCategories(req,res){
  const categories = await prisma.category.findMany()
  res.json(categories)
}

async function createCategory(req,res){
  const { name } = req.body

  const category = await prisma.category.create({
    data:{ name }
  })

  res.json(category)
}

module.exports = {
  getCategories,
  createCategory
}