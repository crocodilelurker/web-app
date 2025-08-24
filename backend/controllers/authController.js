const otpGenerator = require ('../utils/otpGenerator.js')
const User = require('../models/User.js');
const response = require('../utils/responseHandler.js')
const sendOtp = async function(req,res){
    const {phoneNumber,phoneSuffix,email}= req.body;
    const otp = otpGenerator();
    const expiry = new Date(Date.now()+5*60*1000);
    try{
        if(email){
           let user = await User.findOne({email});
           if(!user){
               user = new User({email})
           }
           user.emailOtp = otp;
           user.emailOtpExpire = expiry;
           await user.save();
           return response(res,200,'OTP sent to your email',user);
        }
        if(!phoneNumber || !phoneSuffix)
        {
            return response(res,400,'Phone Number or Phone Suffix is not received')
        }
        const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
        const user = await User.findOne({phoneNumber})
        if(!user)
        {
            user = new User({phoneNumber,phoneSuffix,})
        }
        await user.save();
        return response(res,200,'OTP sent to your phone',user);
    }
    catch(error){
        console.log(error.message);
        return response(res,400,'Internal Server Error')
    }
}