import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/user";
import { NextResponse } from "next/server";
export async function POST(request:Request){
    await dbConnect()
    try {

        const {username,email,password}=await request.json()
        
        const existingUserVerifiedByUsername = await UserModel.findOne({username,isVerified:true})

        if(existingUserVerifiedByUsername){
            return NextResponse.json({
                success:false,
                message:"Username is already taken"
            },{status:400})
        }

        const existingUserByEmail = await UserModel.findOne({email})
            const verifyCode =Math.floor(100000 + Math.random()*900000).toString()
            if(existingUserByEmail){
                if(existingUserByEmail.isVerified){
                    return NextResponse.json({
                        success:false,
                        message:"user already exist "
                    },{
                        status:400
                    })
                }else{
                    const hashedPassword = await bcrypt.hash(password,10);
                    existingUserByEmail.username = username;
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verifyCode;
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                    await existingUserByEmail.save()
                }

                
            }else{
                const hasedPassword = await bcrypt.hash(password,10)
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours()+1)

                const newUser= new UserModel({
                    username,
                    email,
                    password:hasedPassword,
                    verifyCode,
                    verifyCodeExpiry:expiryDate,
                    isVerified:false,
                    isAcceptingMessage:true,
                    message:[]

                })
                await newUser.save()

            }

            const emailResponse = await sendVerificationEmail(email,username,verifyCode)
            if(!emailResponse.success){
                return NextResponse.json({success:false,message:emailResponse.message},{status:500})
            }
            console.log({emailResponse});
            
            return NextResponse.json({
                success: true,
                message: "User registered successfully. Verification email sent."
            }, { status: 200 });

    } catch (error) {
        console.error("Error resgistering user",error)
        return NextResponse.json(
            {success:false,message:"Error registerin user"},
            {status:500}
        )
    }
}