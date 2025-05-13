import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    await dbConnect()
    try {

        const {username,code} = await request.json()
        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username:decodedUsername})

        if(!user){
            return NextResponse.json({success:false,message:"user is not found"},{status:400})
        }
        const isCodeValid = user.verifyCode == code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(!isCodeValid){
            return NextResponse.json({success:false,message:"Incorrect verification code"},{status:400})
        }
        if(!isCodeNotExpired){
            return NextResponse.json({success:false,message:"verification code expired please sign-up again to get new code"},{status:400})
        }
        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true
            await user.save()
            return NextResponse.json({success:true,message:"user verified succesfully"},{status:200})
        }

        
    } catch (error) {
        console.error("error verifying otp ",error);
        
        return NextResponse.json({success:false,message:"error verifying otp"},{status:500}) 
    }

}