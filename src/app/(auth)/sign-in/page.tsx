"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/singUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react';
import Link from "next/link"
import Error from "next/error"
import { signInSchema } from "@/schemas/singInSchema"
import { signIn } from "next-auth/react"

const page = () => {
  // const [username,setUsername]= useState('')
  // const [usernameMessage, setUsernameMessage] = useState('')
  // const [isCheckingUsername, setISChekingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const debounced=useDebounceCallback(setUsername,300)
  const router = useRouter()

  //zod resolver
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      // username:'',
      identifier: '',
      password: ''
    }
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      // if(usernameMessage!="User name is available"){
      //   throw Error
      // }
      const response = await signIn('credentials', {
        
        redirect: false, identifier: data.identifier,
        password: data.password
      })
      if (response?.error || !response) {
        throw Error
      } else {
        if (response.url) {

          toast('Success', { description: response.url })
          router.replace(`/dashboard`)
          setIsSubmitting(false)
        }

      }
    } catch (error) {
      console.error("Login Failed ", error)
      // const axiosError= error as AxiosError<ApiResponse>

      // let errorMessage = (axiosError.response?.data.message??'Error while checking username')
      toast.error("Login Failed", { description: "Incorrect username or password" })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg">

        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Sign In
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>) : ("Signin")}
            </Button>
          </form>
        </Form>


      </div></div>
  )
}

export default page