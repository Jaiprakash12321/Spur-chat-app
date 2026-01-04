import { toast } from "sonner";
import { useChatStore } from "~/lib/store";
import { sleep } from "~/lib/utils";
import { createMessage } from "~/server/actions";
import { getQueryClient } from "~/lib/queryClient";

export async function streamResponse(message: string, chatId: string) {
      
    const { appendAnswer, setLoading, resetAnswer} = useChatStore.getState()

    const queryClient = getQueryClient()
 
    try {
        
        resetAnswer(chatId)
        setLoading(chatId, true)

        await sleep(2000)

        const res = await fetch(`/api/chat/stream/${chatId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        })

        if(!res.body) throw new Error('No response body')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        let fullAnswer = ''

        while(true) {
            const { value, done} = await reader.read()
             if (done) break

             const chunk = decoder.decode(value)
             if(chunk) {
                 fullAnswer += chunk
                 appendAnswer(chatId, chunk)
                 await sleep(60)
             }
        }

        const result = await createMessage(fullAnswer, chatId)

        if (!result.ok) {
            if (result.code === "UNAUTHORIZED") {
                toast.error("Please sign in again")
            } else if (result.code === "FORBIDDEN") {
                toast.error("You don't have access to this chat")
            } else {
                toast.warning("Reply generated but not saved")
            }
        }

        await queryClient.refetchQueries({queryKey: ['getMessages', chatId]})

        resetAnswer(chatId)

    } catch(err) {
         console.error(err)
         toast.error('Something went wrong')
    } finally {
        setLoading(chatId, false)
    }
}
