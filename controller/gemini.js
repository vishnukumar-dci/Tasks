const dotenv = require('dotenv')
dotenv.config()
const {GoogleGenerativeAI} = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.API_KEY)

const geminiAI = async(req,res) => {
    const {prompt} = req.body
    console.log(prompt)
    try{
    const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"})
    // const prompt = "tell about the current scenario in IT sector"
    const result = await model.generateContent(prompt)
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
