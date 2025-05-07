import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {Message} from "@/model/user"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request:NextRequest){
    await dbConnect()
    
    try {
        const {username,content} = await request.json()
        const user = await UserModel.findOne({username})
        if(!user){

        return NextResponse.json(
                {success: false,message: "User not found"},
                {status: 404}
            )
        }
        if(!user.isAcceptingMessage){
             return NextResponse.json(
                            {success: false,message: "User is nt accepting messages"},
                            {status: 403}
                        )
        }

        const newMessage = {content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        user.save()
        return NextResponse.json(
            {success: true,message: "user message updated successfully"},
            {status: 200}
        )
    } catch (error) {
        console.log("unexpected message",error)
        return NextResponse.json(
            {success: false,message: "Error storing message"},
            {status: 500}
        )
        
    }
}