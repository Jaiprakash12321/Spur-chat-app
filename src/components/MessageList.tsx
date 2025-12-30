"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { Message } from "generated/prisma"
import { AlertCircle, Bot, Loader, Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"
import { twMerge } from "tailwind-merge"
import { motion } from 'framer-motion'
import UserAvatar from "./UserAvatar"
import { useChatStore } from "~/lib/store"

export default function MessageList({chatId}: {chatId: string}) {

    const { answer, loading} = useChatStore()

    const {data: messages, isLoading, isFetching, isRefetching, isError} = useQuery<Message[]>({
        queryKey: ['getMessages', chatId],
        queryFn: async () => {
            const res = await axios.get(`/api/chat/${chatId}`)
            return res.data.messages
        },
        refetchInterval: 5 * 60 * 60
    })

     const divRef = useRef<HTMLDivElement | null>(null)

      useEffect(() => {
        if(divRef.current) divRef.current.scrollIntoView({ behavior: 'smooth'})
      }, [messages])


     useEffect(() => {
        const messageContainer = document.getElementById('message-container')
        if(messageContainer) {
            messageContainer.scrollTo({
            top: messageContainer.scrollHeight,
            behavior: 'smooth'
            })
        }
      }, [messages]) 

      if(isError) return <div className="flex-center grow text-red-500 gap-4 text-xl font-semibold">
             <AlertCircle /> Error fetching messages
      </div>

      if(isLoading && !messages) return <div className="flex-center grow">
           <Loader2 className="animate-spin size-12"/>
      </div>

    // toast.success(JSON.stringify(messages))

    return <div id="message-container" className="flex flex-col p-2 grow gap-3 overflow-y-auto">
           {messages?.length == 0 ? (
                 <div className="flex flex-col items-center gap-3 self-center my-auto">
                    <span className="flex-center p-3 rounded-full bg-blue-700">
                         <Bot className="size-7"/>
                    </span>
                         <p className="text-2xl font-semibold">Ask something to start ✨</p>
                 </div>
           ) : (
                <>
                       
      {messages?.map((message, i) => {
        const isUser = message.role === "USER";

        // const isUser = message.role === "USER" && false;

        return (
          <div key={message.id} className={twMerge("flex gap-3", isUser ? "justify-end" : "justify-start")}>

            {!isUser && (
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-white">
                <Bot className="size-6" />
              </div>
            )}

                    <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={twMerge(
                        "relative max-w-[75%] whitespace-pre-wrap rounded-xl px-4 py-2 leading-relaxed",
                        isUser
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-accent dark:bg-white/10 border rounded-tl-none"
                    )}
                    >
                    {message.content}
                    </motion.div>

                    {isUser && <UserAvatar />}
                </div>
                );
            })}

                </>
           )}

           {(loading || answer) && (
              <div className="flex gap-3 justify-start">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-white">
                  <Bot className="size-6" />
                </div>

                <div className="relative max-w-[75%] rounded-xl px-4 py-2 leading-relaxed rounded-tl-none bg-accent dark:bg-white/10 border">
                  {answer ? (
                    <span className="whitespace-pre-wrap leading-relaxed">{answer}</span>
                  ) : (
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            )}

            <div ref={divRef}/>
    </div>
}