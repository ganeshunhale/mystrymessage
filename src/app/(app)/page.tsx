'use client'
import React, { useRef } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Mail } from 'lucide-react'
const page = () => {
  const plugin = useRef(
    Autoplay({ delay: 2000 })
  )
  return (
    <main className='flex-grow flex flex-col item-center justify-center px-4 md:px-24 py-12'>
<section className='text-center mb-8 md:mb-12'>
  <h1 className='text-3xl md:text-5xl font-bold'>
    Dive into the word of Anonymous conversations
  </h1>
  <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore Mystery Messages - Where Your identity remians a secret</p>
</section>
    
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: "start",
      }}
      className="md:w-full ms:max-w-sm"
    >
      <CarouselContent>
        {messages.map((message, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardHeader>
                  {message.title}
                </CardHeader>
                <CardContent className="flex-grow flex aspect-square items-center justify-center p-6">
                <Mail className="flex-shrink-0" />
                      <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
  )
}

export default page