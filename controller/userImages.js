const UserDB = require('../model/userSchema')
const chunkDB = require('../model/chunkSchema')

const imageUpload = async (req,res) => {
    const userId = req.params.id
    try{

        const user = await UserDB.findById(userId)
        
        if(!user){
            return res.status(404).json({message:'User Not Found'})
        }

        user.profilePhoto.data = req.file.buffer
        user.profilePhoto.contentType = req.file.mimetype
        
        await user.save()

        return res.status(201).json({message:'File uploaded Successfully'})
    }
    catch(err){

        console.log(err)
        return res.status(500).json({message:'Internal Error'})
    }
}

const imageRetrieval = async (req,res) => {
    const userId = req.params.id
    try {
        const user = await UserDB.findById(userId)

        if(!user || !user.profilePhoto || !user.profilePhoto.data)
            return res.status(404).json({message:'User Not Found'})

        res.set('Content-Type', user.profilePhoto.contentType);
        res.send(user.profilePhoto.data);

    } catch (error) {
        return res.status(500).json({message:'Internal server Error'})
    }
}
 
const imageChunk = async(req,res) => {
    const {uploadId,chunkIndex,data} = req.body

    if(!uploadId||chunkIndex == null||!data){
        return res.status(400).json({message:'Missing fields'})
    }
    try {
        
        await chunkDB.create({
            uploadId,
            chunkIndex,
            data
        });
        return res.send('chunks received')
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'Internal Error'})
    }
}

const imageMerge = async (req, res) => {
  const { uploadId, contentType, userId } = req.body;

  try {
    const chunks = await chunkDB.find({ uploadId }).sort('chunkIndex');

    if (!chunks.length) {
      return res.status(400).json({ message: 'No chunks found' });
    }

    const buffers = chunks.map(c => Buffer.from(c.data, 'base64'));

    const mergedBuffer = Buffer.concat(buffers);

    const user = await UserDB.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePhoto = {
      data: mergedBuffer,
      contentType,
    };

    await user.save();

    await chunkDB.deleteMany({uploadId})

    return res.status(200).json({ message: 'Image uploaded successfully' });

  } catch (error) {
    console.error('Merge Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {imageUpload,imageRetrieval,imageChunk,imageMerge}