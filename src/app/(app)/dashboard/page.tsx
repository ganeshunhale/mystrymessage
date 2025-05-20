'use client'
import {MessageCard} from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message} from '@/model/user'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading,setIsLoading] = useState(false)
const [isSwitchLoading,setIsSwitchLoading] = useState(false)
  const handleDeleteMessage = (messageId:string)=>{
    setMessages(messages.filter(message=>{message._id == messageId}))
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
   if(!session||!session.user) return
    fetchMessages()
    fetAcceptingMessage()
  }, [session,setValue,fetAcceptingMessage,fetchMessages])

  const handleSwitchChange = async () =>{
    try {
      const responce = await axios.post<ApiResponse>('/api/accept-messages',{acceptMessages:!acceptMessages})
      setValue('acceptMessages',!acceptMessages)
      toast(responce.data.message||"Succesfully updated user status to accept messages")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Error',{description:axiosError.response?.data.message||"Failed to updated"})
      
    }
  }
  
  // const baseUrl = `${window.location.protocol}//${window.location.host}`;
  // const baseUrl = `http://localhost:3000`;
  const [profileUrl, setProfileUrl] = useState('');

  useEffect(() => {
    if (session?.user?.username) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${session.user.username}`);
    }
  }, [session]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast('URL Copied!',{
      description: 'Profile URL has been copied to clipboard.',
    });
  };
  if(!session||!session.user){
    return <div>Please login</div>
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              OnMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default page