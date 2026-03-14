const prisma = require('../config/prisma.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// REGISTER
async function register(data) {

  const { name, email, password } = data

  // เช็ค email ซ้ำ
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("Email already registered")
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return user
}


// LOGIN
async function login(data) {

  const { email, password } = data

  // หา user
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new Error("User not found")
  }

  // เช็ค password
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error("Invalid password")
  }
  // generate token
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    "secret_key",
    { expiresIn: "1d" }
  )
  return {
    user,
    token
  }
}
module.exports = {
  register,
  login
}