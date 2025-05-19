'use client'
import { Message, User } from '@/model/user'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading,setIsLoading] = useState(false)
const [isSwitchLoading,setIsSwitchLoading] = useState(false)
  const handleDeleteMessage = (messageId:string)=>{
    setMessages(messages.filter(message=>{message}))
  }
  const {data:session} = useSession()
  const form = useForm({
    resolver:zodResolver(AcceptMessageSchema)
  })
  const {register,watch,setValue} = form;
  const acceptMessages = watch('acceptMessages')
  
  const fetAcceptingMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const responce = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages',responce.data.isAcceptingMessage||false)
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Error',{description:axiosError.response?.data.message||"Failed to fetch message settings"})
    }finally{
      setIsSwitchLoading(false)
    }
  },[setValue])

  const fetchMessages = useCallback(async(refresh :boolean=false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages||[])
      if(refresh){
        toast('Refreshed messages',{description:"Showing latest messages"})

      }
      
    } catch (error){
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Error',{description:axiosError.response?.data.message||"Failed to fetch message settings"})
    }finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  },[setIsLoading,setIsSwitchLoading,setMessages])

  useEffect(() => {
   if(!session||!session.user)return
    fetchMessages()
    fetAcceptingMessage()
  }, [session,setValue,fetAcceptingMessage,fetchMessages])

  const handleSwitchChange = async () =>{
    try {
      const responce = await axios.post<ApiResponse>('/api/accept-messages',{acceptMessages:!acceptMessages})
      setValue('acceptMessages',acceptMessages)
      toast(responce.data.message||"Succesfully updated user status to accept messages")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Error',{description:axiosError.response?.data.message||"Failed to updated user status to accept messages"})
      
    }
  }
  const { username } =session?.user as User
  
  if(!session||!session.user){
    return <div>Please login</div>
  }
  return (
    <div>dashboard</div>
  )
}

export default page