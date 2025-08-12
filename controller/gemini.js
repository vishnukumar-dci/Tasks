const dotenv = require('dotenv')
dotenv.config()
const {GoogleGenerativeAI} = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.API_KEY)

const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"})
const chat = model.startChat({history:[]})

const geminiAI = async(req,res) => {
    const {prompt} = req.body
    try{
    const result = await chat.sendMessage(prompt)
    const response = await result.response
    const text = response.text()
    return res.status(200).json({reply:text})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:'Internal Error'})
    }
}

module.exports = {geminiAI};
