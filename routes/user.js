const express = require('express')
const userController = require('../controller/userController')
const router = express.Router()
const { body,param } = require('express-validator')
const authentication = require('../middleware/authUser')

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

module.exports = router;

