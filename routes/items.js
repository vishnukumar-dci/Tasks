const express = require('express')
const items = require('../controller/items')
const app = express.Router()

app.post('/createitem', items.createItem)

app.get('/list', items.getItems)

app.get('/itemdetail/:id', items.getSingleItem)

app.put('/update/:id', items.updateItem)

app.delete('/delete/:id', items.deleteItem)

module.exports = app;

