const stripe = require('../controller/stripe')
const express = require('express')
const router = express.Router()

router.post('/createcheckout',stripe.createCheckout)

router.get('/success',stripe.paymentSuccess)

router.get('/cancel',stripe.paymentFail)

module.exports = router;