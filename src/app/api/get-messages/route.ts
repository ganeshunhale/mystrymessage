import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !session.expires) {
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
        return NextResponse.json(
            {success: true,message: "User messages successfully fetched",messages:user[0].messages},
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