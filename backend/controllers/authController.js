const otpGenerator = require ('../utils/otpGenerator.js')
const User = require('../models/User.js');
const response = require('../utils/responseHandler.js');
const { sendOtpToEmail } = require('../services/emailService.js');
const twillioService = require('../services/twilioService.js');
const { generateToken } = require('../utils/generateToken.js');


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
           
           await sendOtpToEmail(email,otp);
           await user.save();
           return response(res,200,'OTP sent to your email',user);
        }
        if(!phoneNumber || !phoneSuffix)
        {
            return response(res,400,'Phone Number or Phone Suffix is not received')
        }
        const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
        let user = await User.findOne({phoneNumber})
        if(!user)
        {
            user = new User({phoneNumber,phoneSuffix,})
        }
        await twillioService.sendOtpToPhoneNumber(fullPhoneNumber);
        await user.save();
        return response(res,200,'OTP sent to your phone',user);
    }
    catch(error){
        console.log(error.message);
        return response(res,400,'Internal Server Error')
    }
}

const verifyOtp = async(req,res) => {
     const {phoneNumber,phoneSuffix,email,otp}= req.body;
     try {
        let user;
        if(email)
        {
            
            user = await User.findOne({email});
            if(!user)
            {
                return response(res,404,"User Not Registered or Found");
            }
            const now = new Date();
            if(!(user.emailOtp)|| (user.emailOtp !== String(otp)) || (now > user.emailOtpExpire))
            {
                return response(res,404,"Invalid OTP Verification Step Maybe Missing OTP or Expired");
            }
            user.isVerified = true;
            user.emailOtp=null;
            user.emailOtpExpire=null;
            await user.save();
        }
        else{
            if(!phoneNumber || !phoneSuffix)
            {
               return response(res,400,'Phone Number or Phone Suffix is not received')
            }
            const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
            let user;
            user = await User.findOne({phoneNumber});
            if(!user)
            {
                return response(res,404,"User Not Registered or Found");
            }
            const result = await twillioService.verifyOtp(fullPhoneNumber,otp)
            if (result.status!='approved')
            {
                return response(res,400 ,"Wrong OTP");
            }
            user.isVerified=true;
            await user.save();
        }
        //token generation step 14536
        const token = generateToken(user?._id);
        res.cookie("auth_token",token,{
            httpOnly: true,
            maxAge : 1000 * 60 * 60 * 24 * 365
        });
        return response(res,200,"OTP Verified Successfully",{token,user})
     } catch (error) {
        console.error(error);
        return response (res,400,"Internal Server Error")
     }
}

module.exports={
    sendOtp,
    verifyOtp
}