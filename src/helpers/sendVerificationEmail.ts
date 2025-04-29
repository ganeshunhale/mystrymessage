import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verficationCode:string
):Promise<ApiResponse>{
    try {
        
    const res = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: "Verification Code",
        react: VerificationEmail({username,otp:verficationCode})
        // react: 'temp check'
    });
    console.log(res,'>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        return {success:true, message:"verification email send suuceesfully"}
    } catch (error) {
        console.error("errror sending email verification ", error)
        return { success :false, message:"failed to send verification email"}
    }

}