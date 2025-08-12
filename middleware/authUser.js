const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

function validateToken(req, res, next) {

    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401).json({ message: 'No token provided' })
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(404).json({ message: 'Invalid token' })
        }
        req.user = user
        next()
    })
}

function validateRefreshToken(req, res, next) {

    const refreshToken = req.body.refreshToken
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

function validateInputs(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

module.exports = { validateToken, validateInputs, validateRefreshToken };


