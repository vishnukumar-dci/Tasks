const UserDB = require('../models/itemSchema')

const createItem = async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ message: 'item name is require' })
    }
    try {
        const { name, description, quantity } = req.body;

        const existingItem = await UserDB.findOne({ name: name });

        if (existingItem) {
            return res.status(409).json({ message: 'Item is alreday exists' })
        }

        const newItem = new UserDB({
            name,
            description,
            quantity
        })

        const item = await newItem.save();
        console.log(item)

        return res.status(201).json({ message: 'Item registration successful' })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Error' })
    }
}

const getItems = async (req, res) => {

    try {

        const items = await UserDB.find({})

        return res.status(200).json(items)
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Error' })
    }
}

const getSingleItem =  async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({ message: 'Id is required' })
    }
    try {
        const existingItem = await UserDB.findById({ _id: id })
        if (!existingItem) {
            return res.status(404).json({ message: 'Items Not Found' })
        }
        return res.status(200).json({ existingItem })
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Error')
    }
}

const updateItem =  async (req, res) => {

    const id = req.params.id

    if (!id) {
        return res.status(400).json({ message: 'items id is require' })
    }

    const updateItem = {
        name:req.body.name,
        description:req.body.description,
        quantity:req.body.quantity
    }
    try {

        const updatedItem = await UserDB.findByIdAndUpdate(
            {_id:id},
            updateItem,
            {new:true,runValidators:true}
        )
        if(!updatedItem){
            return res.status(404).json({message:'Item not found'})
        }

        return res.send(updatedItem)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Error' })
    }
}

const deleteItem =  async (req, res) => {
    const id = req.params
    if (!id) {
        return res.status(400).json({ message: 'item Id is require' })
    }
    try {

        const existingItem = await UserDB.findByIdAndDelete({ _id: id })

        if (!existingItem) {
            return res.status(404).json({ message: 'No such a item' })
        }

        console.log(existingItem)

        return res.status(200).json({ message: 'Item is deleted sucessfully' })

    } catch (error) {
        return res.status(500).json({ message: 'Internal Error' })
    }
}

module.exports = {createItem,getItems,getSingleItem,updateItem,deleteItem}