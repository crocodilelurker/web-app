const { response } = require('express');
const jwt = require ('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config();
//actually we can use this to protect our routes


const authMiddleware = (req,res,next) => {
    const authToken = req.cookies.auth_token;
    if(!authToken)
    {
        return response(res,401,"Token Not Found");
    }
    try {
        const decode =  jwt.decode(authToken,process.env.JWT_SECRET_KEY);
        req.user= decode;
        next();
    } catch (error) {
        console.error(error);
        return response(res,500,"internal Server Error authmiddleware.js");
    }
}


module.exports= {
    authMiddleware
}