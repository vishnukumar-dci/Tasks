const express = require('express')
const multer = require('multer')
const router = express.Router()
const userController = require('../controller/userController')
const { body,param } = require('express-validator')
const authentication = require('../middleware/authUser')
const chunk = require('../controller/chunkImage')
const images = require('../controller/profilepicture')

const storage = multer.memoryStorage()
const upload = multer({storage})

//registration
router.post('/register',
    [
        body('email').isEmail().withMessage('Must be a valid email'),
        body('name')
            .trim()
            .notEmpty()
            .withMessage('User name is required')
            .isLength({ min: 3 }).trim().withMessage('Username must be at least 5 character'),
        body('password').isLength({ min: 8 }).trim().withMessage('Password must be at least 8 character')
    ],
    authentication.validateInputs, userController.createUser)

//login 
router.post('/login',
    [
        body('email').isEmail().withMessage('Must be a valid Email'),
        body('password').isLength({ min: 8 }).trim().withMessage('Password must be at least 8 character')
    ],
    authentication.validateInputs,userController.loginUser)

//getting a user detail
router.get('/userdetails/:id',
    [
        param('id').isMongoId().withMessage('Invalid user ID')
    ],
    authentication.validateInputs,authentication.validateToken, userController.getUser)

//updating a user detail
router.put('/update/:id',
    [
        body('email').isEmail().withMessage('Must be a valid Email'),
        body('password').isLength({ min: 8 }).trim().withMessage('Password must be at least 8 character'),
        param('id').isMongoId().withMessage('Invalid user ID')
    ],
    authentication.validateInputs, authentication.validateToken, userController.updateUser)

// deleting the user detail
router.delete('/delete/:id',
    [
        param('id')
            .isMongoId().withMessage('Invalid user ID'),
    ],
    authentication.validateInputs, authentication.validateToken, userController.deleteUser)

//access token generation using refresh token
router.post('/refreshtoken',
    [
        body('refreshToken').trim().notEmpty().withMessage('Must contain a value')
    ],
    authentication.validateInputs, authentication.validateRefreshToken, userController.generateAccessToken)

// Image Upload Mongodb single shot
router.post('/profile',upload.single('picture'),authentication.validateToken,images.imageUpload)

// Upload image as chunks
router.post('/chunk',authentication.validateToken,chunk.imageChunk)

router.post('/merge',authentication.validateToken,chunk.imageMerge)

router.get('/imageurl/',authentication.validateToken,images.imageRetrievalLink)
router.get('/retrieve/:email',images.imageRetrieval)

router.put('/profileupdate',upload.single('profile'),authentication.validateToken,images.imageUpdate)

router.delete('/profiledelete',authentication.validateToken,images.imageDelete)

module.exports = router;

