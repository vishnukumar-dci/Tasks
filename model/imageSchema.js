const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    profilePhoto:{
        data:Buffer,
        contentType:String
    }
    ,
    uploadTime:{
        type:Date
    }
})

const image = mongoose.model('Image',imageSchema)
module.exports = image;