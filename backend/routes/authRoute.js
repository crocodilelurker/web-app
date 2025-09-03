const express = require ('express')
const authController = require('../controllers/authController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');
const { multerMiddleware } = require('../config/cloudinaryConfig.js');
const router =  express.Router();

router.post('/send-otp',authController.sendOtp)
router.post('/verify-otp',authController.verifyOtp)
router.get('/logout',authController.logout)

router.put('/update-profile',authMiddleware,multerMiddleware,authController.updateProfile)

module.exports = 
    router