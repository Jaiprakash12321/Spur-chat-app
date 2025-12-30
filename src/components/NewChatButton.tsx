"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SquarePen, RotateCw } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";

export default function NewChatButton() {

  const router = useRouter();

  const queryClient = useQueryClient()

  const {mutateAsync: createChat, isPending} = useMutation({
    mutationFn: async () => {
        const res = await axios.post('/api/chat')
        return res.data
    }, 
    onSuccess: async ({chatId}: {chatId: string}) => {
           toast.success('New chat created', {position: 'top-center'})
           router.push(`/chats/${chatId}`)
    },
    onError: (err) => {
         console.error(err)
         toast.error('Something went wrong')
    },
    onSettled: () => {
       queryClient.refetchQueries({queryKey: ['getChats']})
    }
  })

  return (
   <button
    onClick={async () => {
        await createChat()
    }}
    disabled={isPending}
    className="flex-center text-lg py-3 px-2 cursor-pointer font-semibold gap-2 rounded-md border border-gray-500 dark:border-white/30 border-dashed hover:bg-white/10 duration-75 disabled:cursor-not-allowed disabled:opacity-70"
>
  {isPending ? (
     <>
        <RotateCw className="h-5 w-5 animate-spin" strokeWidth={2}/>
        creating...
     </>
  ) : (
    <>
      <SquarePen className="h-5 w-5" strokeWidth={2}/>
      New chat
    </>
  )}
</button>
  )
}
