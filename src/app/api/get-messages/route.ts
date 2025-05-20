import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !user?._id) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 }
        )
    }
    const userId = new mongoose.Types.ObjectId(user?._id)
    
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        if (!user) {
            return NextResponse.json(
                {success: false,message: "User not found"},
                {status: 404}
            )
        }
        console.log({user});
        
        return NextResponse.json(
            {success: true,message: "User messages successfully fetched",messages:user.length?user?.[0].messages:null},
            {status: 200}
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {success: false,message: "User not found"},
            {status: 401}
        )
    }

}