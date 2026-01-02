"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, Loader, MessageSquarePlus } from "lucide-react";
import ChatsSectionHeader from "./ChatsSectionHeader";
import { usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge";
import ChatMenu from "./ChatMenu";
import ChatsSectionBottom from "./ChatsSectionBottom";
import { useEffect, useRef } from "react";

type Chat = {
    id: string;
    title: string | null;
    createdAt: string;
}

export default function ChatSidebar() {

 const pathname = usePathname()
 const activeChatRef = useRef<HTMLAnchorElement | null>(null)

 const {data: chats, isLoading, isFetching, isRefetching, isError} = useQuery<Chat[]>({
    queryKey: ['getChats'],
    queryFn: async () => {
        const res = await axios.get('/api/chat')
        return res.data.chats
    }
 })

 useEffect(() => {
    if (activeChatRef.current) {
      activeChatRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    // Why these dependencies ??
  }, [pathname, chats])

 if(isError) return <div className="flex h-screen w-[25%] flex-col gap-4 p-3 border-r border-zinc-400 bg-accent dark:border-white/10 dark:bg-black">
      
      <ChatsSectionHeader />

      <div className="w-full h-full flex-center gap-3 text-red-500 text-xl font-semibold">
           <AlertCircle className="text-red-500"/>
           Error fetching chats !
      </div>

      <ChatsSectionBottom />
 </div>

 if(isLoading || !chats) return <div className="flex h-screen w-[25%] flex-col gap-4 border-r border-zinc-400 bg-accent dark:border-white/10 dark:bg-black p-3">
        
        <ChatsSectionHeader />

        <div className="w-full h-full flex-center">
             <Loader className="w-8 h-8 animate-spin text-blue-100"/>
        </div>

        <ChatsSectionBottom />
 </div>

 if(chats.length == 0) return <div className="flex h-screen w-[25%] flex-col gap-4 border-r border-zinc-400 bg-accent dark:border-white/10 dark:bg-black p-3">
        <ChatsSectionHeader />

        <div className="flex-center w-full h-full gap-3 text-2xl font-semibold">
              <MessageSquarePlus /> No chats yet
        </div>

        <ChatsSectionBottom />
 </div>

  return (
    <aside className="flex h-screen w-[25%] gap-4 p-3 flex-col border-r border-zinc-400 bg-accent dark:border-white/10 dark:bg-black">
      
      <ChatsSectionHeader />

      <div className="mt-2 flex flex-col shrink-0 gap-3 overflow-y-auto h-[62vh] scrollbar scroll-smooth">
        {chats.map(chat => {

             const isActive = pathname === `/chats/${chat.id}`

            return <Link key={chat.id} href={`/chats/${chat.id}`} ref={isActive ? activeChatRef : null}
                className={twMerge("flex justify-between items-center gap-2 truncate shrink-0 rounded-lg px-4 font-semibold border-2 border-zinc-700 py-3 text-sm text-gray-600 dark:text-gray-300",
                    isActive ? "border-transparent bg-neutral-400 dark:bg-white/15" : "hover:bg-neutral-300 dark:hover:bg-white/10 duration-100"
                )}
            >
                <p className="truncate">{chat.title}</p>
                <ChatMenu chatId={chat.id} isActive={isActive}/>
            </Link>
        }
        )}

        {/* <div className="bg-yellow-500 w-20 h-250 shrink-0"/> */}
      </div>

        <ChatsSectionBottom />
    </aside>
  );
}
