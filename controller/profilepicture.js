const ImageDB = require('../model/imageSchema')

const imageUpload = async (req, res) => {

    const user = req.user

    try {

        const existingImage = await ImageDB.findOne({ email: user.email })

        if (existingImage) {
            return res.status(400).json({ message: 'Profile is already exist' })
        }

        const newImage = new ImageDB({
            email: user.email,
            profilePhoto: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            },
            uploadTime: Date.now()
        })

        await newImage.save()

        return res.status(200).json({ message: 'Image Uploaded Successfully' })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internel Server Error' })
    }
}

async function getUserImage(email) {

    const image = await ImageDB.findOne({ email: email })

    if (!image.profilePhoto || !image.profilePhoto.data) {
        const error = new Error("Image not found");
        error.statusCode = 404
        error.message = 'Image not found'
        throw err
    }

    return image
}

const imageRetrievalLink = async (req, res) => {
    try {

        await getUserImage(req.user.email)
        const imageUrl = `http://localhost:8088/user/retrieve/${req.user.email}`
        return res.status(200).json({ url: imageUrl })

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
};

const imageRetrieval = async (req, res) => {
    try {
        const user = await getUserImage(req.params.email)
        res.set("Content-Type", user.profilePhoto.contentType)
        res.send(user.profilePhoto.data);

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal error"
        });
    }
};

const imageUpdate = async (req, res) => {
    try {

        const updateProfile = await ImageDB.findOneAndUpdate(
            { email: req.user.email },
            {
                profilePhoto: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                }
            },
            {
                new:true,runValidators:true
            }
        )

        if(!updateProfile){
            return res.status(404).json({message:'User Not found'})
        }

        return res.status(200).json({message:'Profile Picture updated sucessfully'})

    } catch (error) {
        return res.status(500).json({message:'Internal Error'})
    }
}

const imageDelete = async (req, res) => {
    try{
        const existingImage = await ImageDB.findOneAndDelete({email:req.user.email})

        if(!existingImage){
            return res.status(404).json({message:'Image not found'})
        }

        return res.status(200).json({message:'Image deleted successfully'})
    }   
    catch(error){
        return res.status(500).json({message:'Internal Error'})
    }
}

module.exports = { imageUpload, imageRetrieval, imageRetrievalLink, imageUpdate ,imageDelete}