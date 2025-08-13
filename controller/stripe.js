require('dotenv').config()
const Stripe = require('stripe')
const products = require('../products.json')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const createCheckout = async (req, res) => {
    const cart = JSON.parse(req.body.cartData)
    const lineItems = []

    for (let id in cart) {
        if (cart[id].qty > 0) {
            const product = products.find(p => p.id === id)
            if (product) {
                lineItems.push({
                    price_data: {
                        currency: 'INR',
                        product_data: {
                            name: product.name
                        },
                        unit_amount: product.price * 100
                    },
                    quantity: cart[id].qty
                })
            }
        }
    }

    if (!lineItems.length) {
        return res.status(400).send("Cart is empty");
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            allow_promotion_codes:true,
            success_url: "http://localhost:8088/payment/success?session_Id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:8088/payment/cancel",
        })
        console.log(session.url)
        res.redirect(303, session.url)

    } catch (error) {
        return res.status(500).send("Error creating checkout session")
    }
}

const paymentSuccess = async (req, res) => {
    const { session_Id } = req.query

    if (!session_Id) {
        return res.status(400).json({ message: "Session ID missing" })
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_Id)
        console.log(session.amount_subtotal,session.amount_total)
        res.render("success", { session })
    }
    catch (error) {
        return res.status(500).json({ message: 'Error retrieving session' })
    }
}

const paymentFail = async (req, res) => {
    res.render("cancel")
}


module.exports = { createCheckout, paymentSuccess, paymentFail }