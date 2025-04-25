import {z} from "zod";

export const usernameValidation  = z.string()
.min(2,"username mist be atleast 2 character")
.max(20,"User must be no more than 20 characters")
.regex(/[a-zA-Z][a-zA-Z0-9-_]{3,32}/gi,"Username must not contain special character")


export const signupSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"passoword nust be at least 6 characters"})

})