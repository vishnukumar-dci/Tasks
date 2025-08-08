const UserDB = require('../model/userSchema')
const bcrypt = require('bcrypt')
const generateTokens = require('../utils/generateTokens')
const jwt = require('jsonwebtoken')

const createUser = async(req,res) => {
    const {name,email,password} = req.body    
    try{

        const existingUser = await UserDB.findOne({email:email})

        const hashedPassword = await bcrypt.hash(password,10)

        if(existingUser){
            return res.status(404).json({message:'User is already exist'})
        }

        const newUser = new UserDB({
            name,
            email,
            password:hashedPassword
        })

        await newUser.save();

        return res.status(201).json({message:'registration successful'})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:'Internal Error'})
    }
}

const loginUser = async(req,res) =>{

    const{email,password} = req.body
    try {
        
        const user = await UserDB.findOne({email:email})

        if(!user){
            return res.status(404).json({message:'User Not Found'})
        }

        const validPassword = await bcrypt.compare(password,user.password)

        if(!validPassword){
            return res.status(401).json({message:'Invalid Credentials'})
        }
        
        const {accessToken,refreshToken} = generateTokens({email:user.email})

        return res.status(200).json({message:'Login Successful',email:user.email,accessToken,refreshToken})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'Internal Error'})
    }
}

const getUser = async(req,res) =>{

    const userId = req.params.id
    try {
        
        const user = await UserDB.findOne({_id:userId})

        if(!user){
            return res.status(404).json({message:'User Not Found'})
        }

        return res.status(200).json({user})

    } catch (error) {
        return res.status(500).json({message:'Internal Error'})
    }
}

const updateUser = async(req,res) =>{

    const userId = req.params.id
    try {

        const updatedItem = await UserDB.findByIdAndUpdate(
            {_id:userId},
            {
                $set:{
                    name:req.body.name,
                    password:req.body.password,
                    email:req.body.email
                }
            },
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

const deleteUser =  async (req, res) => {
    
    const id = req.params.id;
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

const generateAccessToken = async(req,res) =>{
    const user = req.user
    try {
        
        const newAccessToken = jwt.sign({email:user.email},process.env.ACCESS_SECRET_KEY,{expiresIn:'1m'})

        return res.status(200).json({message:'Token updated',accessToken:newAccessToken})
    } catch (error) {
        
    }
}



module.exports = {createUser,deleteUser,updateUser,getUser,loginUser,generateAccessToken};