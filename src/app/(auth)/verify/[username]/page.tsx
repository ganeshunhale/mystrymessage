"use client"
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams,useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from "sonner"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
const VerifyAccount = () => {
    const router = useRouter()

    const params = useParams<{username:string}>()

    const form = useForm({
        resolver:zodResolver(verifySchema),
        
      })
      const onSubmit = async (data :z.infer<typeof verifySchema>)  => {

        try{
            const result = await axios.post<ApiResponse>("/api/verify-user-otp",{
                username:params.username,
                code:data.code
            })
             
            if(result){
                toast.success("verification successfull",{description:result.data.message})
                router.replace("/sign-in")
            }
        }catch (error){
            console.log("verification failed",error);
             const axiosError= error as AxiosError<ApiResponse>
            
                  let errorMessage = (axiosError.response?.data.message??"error verifying otp")
                  toast.error("verification failed",{description:errorMessage})
        }
      }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg">
        <div className="text-center">
          <h1 className = "text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            join Mystery Message
          </h1>
          <p className="mb-4">
            Enter The verification code sent to your email
          </p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                    <Input placeholder="Enter Code" {...field} />
                </FormControl>
                <FormDescription>
                    Enter OTP Sent to you
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit">Submit</Button>
        </form>
        </Form>
        </div>
    </div>
  )
}

export default VerifyAccount