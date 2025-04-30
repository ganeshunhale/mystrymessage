import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {z} from "zod"
import { usernameValidation } from "@/schemas/singUpSchema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:NextRequest){
await dbConnect()
try {
    const {searchParams} =new URL(request.url)
    const queryParam ={
        username:searchParams.get('username')
    }
    const result=UsernameQuerySchema.safeParse(queryParam)
    console.log("result>>>>>>",result);
    if(!result.success){
        const usernameErrors = result.error.format().username?._errors||[]
        return NextResponse.json({
            success:false,
            message:usernameErrors?.length > 0? usernameErrors.join(', '):"Invalid query parameters"
        },{status:400})
    }

    const {username}=result.data

    const existingUser = await UserModel.findOne({username,isVerified:true})
    if(existingUser){
        return NextResponse.json({success:false,message:"usename already exists please select other username"},{status:400})
    }


    return NextResponse.json({success:true,message:"User name is available"},{status:200})
    
} catch (error) {
    console.error("Error checking username",error)
    return NextResponse.json({success:false,message:"Error chekking username"},{status:400})
}
}