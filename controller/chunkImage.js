const ImageDB = require('../model/imageSchema')
const chunkDB = require('../model/chunkSchema')

//image stored in mongodb limit 16mb

const imageChunk = async (req, res) => {

    const { uploadId, chunkIndex, data } = req.body

    if (!uploadId || chunkIndex == null || !data) {
        return res.status(400).json({ message: 'Missing fields' })
    }
    try {

        console.log(uploadId,chunkIndex)
        await chunkDB.create({
            uploadId,
            chunkIndex,
            data
        });
        return res.send('chunks received')
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Error' })
    }
}

const imageMerge = async (req, res) => {
    const { uploadId, contentType } = req.body;
    const user = req.user

    try {
        const chunks = await chunkDB.find({ uploadId }).sort('chunkIndex');

        if (!chunks.length) {
            return res.status(400).json({ message: 'No chunks found' });
        }

        const buffers = chunks.map(c => Buffer.from(c.data, 'base64'));

        const mergedBuffer = Buffer.concat(buffers);

        const existingImage = await ImageDB.findOne({ email: user.email })

        if (existingImage) {
            return res.status(400).json({ message: 'Profile is already exist' })
        }

        const newImage = new ImageDB({
            email: user.email,
            profilePhoto: {
                data: mergedBuffer,
                contentType: contentType
            },
            uploadTime: Date.now()
        })

        await newImage.save()

        await chunkDB.deleteMany({ uploadId })

        return res.status(200).json({ message: 'Image uploaded successfully' });

    } catch (error) {
        console.error('Merge Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {imageChunk, imageMerge}