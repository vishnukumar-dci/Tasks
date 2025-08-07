const express = require('express')
const {geminiAI} = require('../controller/gemini')
const router = express.Router()

router.post('/chats',geminiAI)

module.exports = router;
