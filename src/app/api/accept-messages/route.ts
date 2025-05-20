import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user
    if(!session || !user?._id){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },
            {status:401}
        )
    }
    const userId = user?._id
    const {acceptMessages} = await request.json()

    
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            {isAcceptingMessage:acceptMessages},{new:true})
        
            if(!updatedUser){

                return NextResponse.json({success:false,message:"failed to update user status to accept messages"},{status:401})
            }
            return NextResponse.json({success:true,message:"Succesfully updated user status to accept messages",updatedUser},{status:200})

        
    } catch (error) {
        console.log("failed to update")
        return NextResponse.json({success:false,message:"failed to update user status to accept messages"},{status:500})
    }
}

export async function GET(request:NextRequest){

    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session||!user?._id){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },
            {status:401}
        )
    }
    const userId = user?._id
    try {
        const user = await UserModel.findById(userId)
        if(!user){
            return NextResponse.json({success:false,message:"User not Faound"},{status:404})
        }
        return NextResponse.json({success:true,message:"Succesfully updated user status to accept messages",isAcceptingMessage:user.isAcceptingMessage},{status:200})
    } catch (error) {
        console.log("failed to get accept message status for the user")
        return NextResponse.json({success:false,message:"failed to Get user status to accept messages"},{status:500})
    }
}