const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

function generateToken(email) {
    const accessToken = jwt.sign(email, process.env.ACCESS_SECRET_KEY, { expiresIn: '1hr' })

    const refreshToken = jwt.sign(email, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' })

    return { accessToken, refreshToken }
}


module.exports = generateToken; 