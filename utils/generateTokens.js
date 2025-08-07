const jwt = require('jsonwebtoken')

function generateToken(email) {
    const accessToken = jwt.sign(email, process.env.ACCESS_SECRET_KEY, { expiresIn: '1m' })

    const refreshToken = jwt.sign(email, process.env.REFRESH_SECRET_KEY, { expiresIn: '5m' })

    return { accessToken, refreshToken }
}


module.exports = generateToken; 