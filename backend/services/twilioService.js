const twilio = require('twilio');


//Credentials

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;


const client = twilio(accountSid, authToken);


//sendOtp

const sendOtpToPhoneNumber = async (phoneNumber) => {
    try {
        console.log("Sending OTP")
        if (!phoneNumber)
            throw new Error("Phone Number is required for this service")
        const response = client.verify.v2.services(serviceSid).verifications.create({
            to: phoneNumber,
            channel: 'sms'
        });
        console.log("This is my OTP response", response);
        return response;
    }
    catch (error) {
        console.error("Error in sendOtpToPhoneNumber")
        throw new Error("Failed to Send OTP")
    }
}
//verification pendingb
const verifyOtp = async (phoneNumber,otp) =>{
    try {
        const response = client.verify.v2.services(serviceSid).verificationChecks.create({
            to: phoneNumber,
            code:otp
        });
        console.log("This is my OTP response", response);
        return response;
    }
    catch (error) {
        console.error("OTP verification failed ")
        throw new Error("Failed to Verify OTP")
    }
}
//12235
module.exports= {
    verifyOtp,
    sendOtpToPhoneNumber
}