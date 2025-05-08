"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm} from  "react-hook-form"
import * as z from "zod"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/singUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react';
import Link from "next/link"
const page =()=>{
  const [username,setUsername]= useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setISChekingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [debouncedUsername, setDebioucedUsername]=useDebounceValue(username,300)
  const router = useRouter()

  //zod resolver
  const form = useForm({
    resolver:zodResolver(signupSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

  useEffect(() => {
    ( async () => {
    console.log(debouncedUsername);

      if(debouncedUsername){
        setISChekingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get('/api/check-username-unique',{params:{username:debouncedUsername}})
          setUsernameMessage(response.data.message)
          console.log(response);
          
        } catch (error) {
          console.log(error);
          const axiosError= error as AxiosError<ApiResponse>

          setUsernameMessage(axiosError.response?.data.message??'Error while checking username')


        }finally{
          setISChekingUsername(false)
        }
      }
    })()
  }, [debouncedUsername])

  const onSubmit = async (data : z.infer<typeof signupSchema>) =>{
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up',data)
      toast('Success',{description:response.data.message})
      router.replace(`verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in sign-up user ",error)
      const axiosError= error as AxiosError<ApiResponse>

      let errorMessage = (axiosError.response?.data.message??'Error while checking username')
      toast.error("sign up failed",{description:errorMessage})
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p8 space-y-8 bg-white rounded-lg">

        <div className="text-center">
          <h1 className = "text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anuonnymu s adventure</p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} onChange={(e)=>{
                  field.onChange(e)
                  setUsername(e.target.value)
                }} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}  />
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
                <Input type="password" placeholder="password" {...field}  />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting?(<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please with</>):("Signup")}
        </Button>
        </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member ?{' '}
            <Link href="/sign-in" className="text-blue-600 hoer:text-blue-800">Sign in</Link>
          </p>
        </div>

      </div></div>
  )
}

export default page