import {z} from "zod"

export const signInSchema = z.object(
    {
        identifier: z
        .string()
        .min(1, { message: "This field has to be filled." }),
        password:z.string()
    }
)