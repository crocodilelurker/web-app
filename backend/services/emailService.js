const nodemailer = require ('nodemailer')
const dotenv = require ('dotenv')

dotenv.config();
const trasnsporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
trasnsporter.verify((error,success)=>{
    if(error)
    {
        console.error("Gmail Services Connection Failed");
    }
    else{
        console.log("Gmail Configured Success ready to send email")
    }
})

const sendOtpToEmail =async (email,otp)=>{
      const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #075e54;">🔐 SogyChat Verification</h2>
      
      <p>Hi there,</p>
      
      <p>Your one-time password (OTP) to verify your sogyChat is:</p>
      
      <h1 style="background: #e0f7fa; color: #000; padding: 10px 20px; display: inline-block; border-radius: 5px; letter-spacing: 2px;">
        ${otp}
      </h1>

      <p><strong>This OTP is valid for the next 5 minutes.</strong> Please do not share this code with anyone.</p>

      <p>If you didn’t request this OTP, please ignore this email.</p>

      <p style="margin-top: 20px;">Thanks & Regards,<br/>Swagat Sahu Indian Institue of Information Technology Bhagalpur</p>

      <hr style="margin: 30px 0;" />

      <small style="color: #777;">This is an automated message. Please do not reply.</small>
    </div>
  `;
  await trasnsporter.sendMail({
    from: `sogychat ${process.env.EMAIL_USER}`,
    to:email,
    subject:`SogyChat Verification OTP`,
    html
  })
}

module.exports={
    sendOtpToEmail
}//exporting transporter is not necesary 
