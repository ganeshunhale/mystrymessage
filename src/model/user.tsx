import mongoose ,{Schema,Document} from "mongoose";

export interface Message extends Document {
    _id: string;
    content:string;
    createdAt:Date;
}

const MessageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document {
username:string;
email:string;
password:string;
verifyCode:string;
verifyCodeExpiry:Date;
isVerified:boolean;
isAcceptingMessage:boolean;
messages:Message[]

}

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"User name is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
        ,"please use a valid email address "]
    },
    password:{
        type:String,
        required:[true,"password is required"]

    },
    verifyCode:{
        type:String,
        required:[true,"verify code is requried"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verify code Expiry is requried"]
    },
    isVerified:{
        type:Boolean,
       depault:false
    },
    isAcceptingMessage:{
        type:Boolean,
        depault:true
    },
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel;