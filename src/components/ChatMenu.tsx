import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";


export default function ChatMenu({chatId, isActive}: {chatId: string, isActive: boolean}) {

    const queryClient = useQueryClient()

    const router = useRouter()

    const deleteChat = useMutation({
        mutationFn: async () => {
            const res = await axios.delete(`/api/chat/${chatId}`)
            return res.data
        },
         onMutate: async () => {
                await queryClient.cancelQueries({ queryKey: ['getChats'] });

                const previousChats = queryClient.getQueryData<any[]>(['getChats']);

                queryClient.setQueryData<any[]>(['getChats'], (old) =>
                    old?.filter((chat) => chat.id !== chatId)
                );

                return { previousChats }
        },
        onSuccess: () => {
            toast.success('chat deleted', { position: 'bottom-right'})
            
            if(isActive) router.push('/chats')
        },
        onError: (err,  _vars, context) => {
            console.error(err)
            if (context?.previousChats) {
                queryClient.setQueryData(['getChats'], context.previousChats);
            }
            toast.error("Failed to delete chat");
        }, 
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['getChats']})
        }
    })

    return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button onClick={e => {
                     e.stopPropagation()
                }} className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 duration-150 cursor-pointer">
                <MoreHorizontal size={18} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center">

                <DropdownMenuItem className="p-0 cursor-pointer" onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                     deleteChat.mutate()
                }}>
                         <span className='flex justify-start items-center gap-2 text-base w-full p-1.5 font-medium transition-all duration-300 text-red-500 hover:bg-red-500/10 rounded-lg'><Trash2 className='size-5 text-red-500' strokeWidth={2}/>Delete</span>
                </DropdownMenuItem>

            </DropdownMenuContent>
    </DropdownMenu>
    )
}