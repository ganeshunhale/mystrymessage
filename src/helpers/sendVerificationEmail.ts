// import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
// import  VerificationEmail  from "../../emails/VerificationEmail";
import { transporter } from "@/lib/nodemailer";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verficationCode:string
):Promise<ApiResponse>{
    try {
       
        //resend 
    // const res = await resend.emails.send({
    //     from: 'onboarding@resend.dev',
    //     to: "ganeshunhale.15@gmail.com",
    //     subject: "Verification Code",
    //     react: VerificationEmail({username,otp:verficationCode})
    //     // react: 'temp check'
    // });
    // console.log(res,'>>>>>>>>>>>>>>>>>>>>>>>>>>>')

    
//nodemailer

const html = `
            <html>
                <head>
                    <title>Verification Code</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <h1 style="text-align: center; color: #333;">Hello, ${username}!</h1>
                    <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
                        Thank you for signing up. Please use the verification code below to complete your registration:
                    </p>
                    <h2 style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #000;">
                        ${verficationCode}
                    </h2>
                    <p style="font-size: 14px; color: #999; margin-top: 20px; text-align: center;">
                        If you did not request this code, please ignore this email.
                    </p>
                </body>
            </html>
        `;
        
  const result = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verification Code",
    html:html
  });
  console.log("result",result);
  
        return {success:true, message:"verification email send suuceesfully"}
    } catch (error) {
        console.error("errror sending email verification ", error)
        return { success :false, message:"failed to send verification email"}
    }

}


