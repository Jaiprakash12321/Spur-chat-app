'use server'

import { SignUpSchema } from "~/lib/zod"
import bcrypt from 'bcrypt'
import { db } from "~/server/db"
import { z } from 'zod'
import { streamText, generateText } from 'ai'
// import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from "@ai-sdk/openai";
import { auth } from "./auth"

type formData = z.infer<typeof SignUpSchema>

export async function signup(formData: formData) {
 try {
    const parsedData = SignUpSchema.safeParse(formData)
    if(!parsedData.success) return {success: false, errors: parsedData.error.flatten().fieldErrors, msg: 'Invalid inputs'}
    const {username, email, password} = parsedData.data
    
    const userExists = await db.user.findUnique({where: {email}})
    if(userExists) return {success: false, msg: 'user already exists'}

    const hashedPassword = await bcrypt.hash(password,10)
    const user = await db.user.create({data: {username,email,password: hashedPassword}, select: {id: true, email: true}})

    return {success: true, msg: 'Signed up successfully. Welcome to Spur !!!'}
} catch(err) {
    console.error('Error while signing up',err)
    return {success: false, msg: 'Something went wrong !!!'}
 }
}

export async function createMessage(content: string, chatId: string) {
     const session = await auth()
     if(!session?.user) throw new Error('Unauthorized')
     
     await db.message.create({data: {content, chatId, role: 'ASSISTANT'}})
}


const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string})

export const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY as string,
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL as string, 
    "X-Title": "Spur Chat App",              
  },
});

export async function askQuestion(question: string, chatId: string) {
    // const stream = createStreamableValue();

    // let fullAnswer = "";

    const prevMessages = await db.message.findMany({where: {chatId}, orderBy: {createdAt: 'asc'}, take: 5, select: {content: true, role: true}});

    let context = "";

    for(const msg of prevMessages) {
        context += msg.role === "USER" ? `User: ${msg.content}` : `Assistant: ${msg.content.slice(0,500)}`
        context += '\n'
    }

    const prompt = `You are a helpful support agent for a small e-commerce store. Answer clearly and concisely. If you do not know the answer, say so.

                 Store knowledge:

                Shipping Policy:
                - We ship across India.
                - Orders are processed within 24 hours.
                - Standard delivery takes 3–5 business days.
                - Shipping is free on orders above ₹999.

                Return & Refund Policy:
                - Returns are accepted within 7 days of delivery.
                - Items must be unused and in original packaging.
                - Refunds are processed within 5–7 business days after the return is approved.
                - Shipping fees are non-refundable.

                Support Hours:
                - Customer support is available Monday to Friday.
                - Support hours: 9 AM – 6 PM IST.
                - Support is asynchronous; replies may take up to 24 hours.
                
                Conversation so far : ${context}
                User question: ${question.trim()}
            `;

    // (async () => {
    //      const { textStream } = streamText({
    //         // model: google('gemini-2.0-flash'),
    //         model: openrouter('gpt-4') as any,
    //         prompt
    //      })

    //      for await (const chunk of textStream) {
    //         fullAnswer += chunk
    //         stream.update(chunk)
    //      }

    //      await db.message.create({data: {content: fullAnswer, chatId, role: 'ASSISTANT'}})

    //      stream.done()
    // })()

    // return {
    //      output: stream.value,
    //  }   
}
