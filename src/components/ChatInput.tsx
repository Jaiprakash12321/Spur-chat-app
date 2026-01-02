"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2 } from "lucide-react";
import { z } from "zod";
import { createMessageSchema } from "~/lib/zod";
import { motion } from 'framer-motion'
import { useParams, usePathname } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useChatStore } from "~/lib/store";
import { streamResponse } from '~/hooks/useStreamResponse'
import { useState } from "react";
// import { readStreamableValue } from "ai/rsc";

type Input = z.infer<typeof createMessageSchema>

export default function ChatInput() {

  // const [answer, setAnswer] = useState('')
  // const [loading, setLoading] = useState(false)

  const pathname = usePathname()
  const isChatsRoot = pathname === "/chats"

  // Should get chatId from server component via props
  const params = useParams<{ chatId?: string }>();
  const chatId = params.chatId ?? "";

  const queryClient = useQueryClient()

  const form = useForm<Input>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: { message: "" },
  })

  const {mutateAsync: createMessage, isPending} = useMutation({
      mutationFn: async (content: string) => {
          // await new Promise(r => setTimeout(r,5000))
          const res = await axios.post(`/api/message/${chatId}`, {message: content})
          return res.data
      },
      // OPTIMISTIC UPDATE FOR MESSAGES
      // onMutate: async (content: string) => {
      //        await queryClient.cancelQueries({ queryKey: ["getMessages", chatId] })
      //        const previousMessages = queryClient.getQueryData<any[]>(["getMessages",chatId])

      //        const optimisticMessage = { id: crypto.randomUUID(), role: Role.USER, content, createdAt: new Date(), chatId }

      //        queryClient.setQueryData<Message[]>(["getMessages", chatId],(old = []) => [...old, optimisticMessage])

      //       return { previousMessages };

      // },
      onError: (err, _content, context) => {
            console.error(err)
            // if (context?.previousMessages) queryClient.setQueryData(["getMessages", chatId],context.previousMessages)

            toast.error('Something went wrong')
      },
      onSuccess: async (data) => {
             // start streaming only after user message is visible on UI 
             // try writing this in mutation fn
             await queryClient.refetchQueries({queryKey: ['getMessages', chatId]})
             // isPending remains true when onSuccess is getting executed 
             // but dont want to show loader in send button when AI is streaming 
             // that is why removed await from here
             streamResponse(data.msg.content as string, chatId)
            if(data.titleUpdated) queryClient.refetchQueries({queryKey: ['getChats']})    
      },
      // onSettled runs after OnSuccess
      onSettled: (data) => {
           queryClient.invalidateQueries({queryKey: ['getMessages', chatId]})
           if(data.titleUpdated)  {
               toast.info('Updated chat title', { position: 'bottom-right'})
               queryClient.invalidateQueries({queryKey: ['getChats']})
           }
      }
  })

  // const { setAnswer, setLoading, loading, appendAnswer} = useChatStore()

  const loading = useChatStore(s => s.loading[chatId])

  const onSubmit = async (data: Input) => {
    // try {
    //   setIsLoading(true);
    //   await new Promise((r) => setTimeout(r, 5000));
    //   form.reset();
    // } finally {
    //   setIsLoading(false);
    // }


    // it does not allow to submit (show formMessage) if you do not meet the conditions 
    // so you have to remove it from zod schema in order to show toast
    // try uncommenting the FormMessage
     if(data.message.length > 1500) {
         toast.error('Prompt too big !')
         return
     }

     await createMessage(data.message)
     form.reset()

      // BETTER put it in onSuccess of createMessage
    //  await streamResponse(data.message, chatId)

    //  setAnswer('')
    //  try { 
    //       setLoading(true)
    //       const { output } = await askQuestion(data.message, chatId as string)

    //          for await (const chunk of readStreamableValue(output)) {
    //            if(chunk) appendAnswer(chunk)
                  // setAnswer(prev => prev + chunk)
    //          }
    //  } catch(err) {
    //        toast.error('Something went wrong. Try again!!!')
    //  } finally {
    //     setLoading(false)
    //  }

  }

  return (
    <div className="w-full border-t-[3px] border-neutral-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-neutral-900">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative mx-auto flex-center gap-3 max-w-4xl"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <textarea
                    {...field}
                    rows={1}
                    placeholder="Type your message…"
                    disabled={isPending || form.formState.isSubmitting || isChatsRoot || loading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    className="w-full placeholder:text-lg bg-secondary dark:bg-black border focus:ring-2 focus:ring-blue-600 focus:border-transparent duration-100 resize-none rounded-full px-5 py-3 pr-7 text-lg outline-none disabled:opacity-50"
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          <motion.button
            type="submit" whileTap={{scale: 0.9}}
            disabled={form.formState.isSubmitting || isPending || loading || !form.watch("message") || isChatsRoot}
            className="flex-center p-3 rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Send className="" />}
          </motion.button>
        </form>
      </Form>
    </div>
  );
}
