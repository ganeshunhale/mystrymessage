import {NextAuthOptions} from "next-auth";

// Extend the User type to include custom properties

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" },
              },
              async authorize(credentials:any, req):Promise<any> {
                await dbConnect()
                try {
                    const user =await UserModel.findOne({
                        $or:[
                            {email:credentials.email},
                            {username:credentials.password}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your acount before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)

                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error ("Incorrect Password")
                    }
                } catch (error:any) {
                    throw new Error(error)
                }
              }
        })
    ],
    callbacks: { 
        async jwt({ token, user }) {
            if(user){
                token._id=user._id?.toString();
                token.isVerified=user.isVerified;
                token.isAcceptingMessage=user.isAcceptingMessage;
                token.username=user.username
    
            }
            return token
        },
    async session({ session, token }) {
        if(token){
            session.user._id = token._id;
            session.user.isVerified=token.isVerified;
            session.user.isAcceptingMessage = token.isAcceptingMessage;
            session.user.username = token.username

        }
        return session
    },
   
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
}