const authService = require('../services/auth.service.js')

async function register(req, res) {

  try {

    const user = await authService.register(req.body)

    res.json({
      message: "User Created",
      user
    })

  } catch (error) {

    res.status(400).json({
      message: error.message
    })

  }

}

async function login(req, res) {

  try {

    const result = await authService.login(req.body)

    res.json({
      message: "Login Success",
      user: result.user,
      token: result.token
    })

  } catch (error) {

    res.status(401).json({
      message: error.message
    })

  }

}

module.exports = {
  register,
  login
}