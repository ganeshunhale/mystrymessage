import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(request: NextRequest,{params}:{params:{id:string}}) {
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
    const messageId = new mongoose.Types.ObjectId(params?.id)
    try {
        const user = await UserModel.findByIdAndUpdate(userId,
            {$pull : {messages :{_id :messageId}}},
            {new:true})
        if (!user) {
            return NextResponse.json(
                {success: false,message: "User not found or message not found"},
                {status: 404}
            )
        }
        return NextResponse.json(
            {success: true,message: "User message deleted successfully "},
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