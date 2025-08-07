const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    quantity:{
        type:String
    }
})

const User = mongoose.model('Items',userSchema)

module.exports = User;