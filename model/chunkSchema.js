const mongoose = require('mongoose')

const chunks = new mongoose.Schema({
    uploadId:String,
    chunkIndex:String,
    data:String
})

module.exports = mongoose.model('chunkImage',chunks)