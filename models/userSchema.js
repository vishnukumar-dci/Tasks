const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String
    }
})

const user = mongoose.model('Users',userSchema)

module.exports = user;