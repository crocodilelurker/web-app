const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController.js');
const response = require('../utils/responseHandler');

router.get('/route_health',(req,res) => {
    try {
        return response(res,200,"Message route is Healthy")
    } catch (error) {
        console.error(error);
        return response(res,500, "Internal Server Error messageRoute.js");
    }
})
