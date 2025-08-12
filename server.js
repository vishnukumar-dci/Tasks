const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const itemRoutes = require('./routes/items')
const userRouter = require('./routes/user')
const chatRouter = require('./routes/chat')
const paymentRouter = require('./routes/payment')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const PORT = 8088

app.use(express.json({limit:'5mb'}))
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(express.static("public"))
app.set("view engine","ejs")

const products = require('./products.json')

app.get('/product',(req,res) => {
    res.render("index",{products})
})

app.use('/items',itemRoutes)
app.use('/user',userRouter)
app.use('/gemini',chatRouter)
app.use('/payment',paymentRouter)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('DB is connected successfully')
    app.listen(PORT,()=>{
        console.log(`Server is running on ${PORT}`)
    })
})
.catch((err)=>{
    console.log(err)
}) 