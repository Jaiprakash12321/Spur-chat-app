import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { db } from "~/server/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { streamSchema } from "~/lib/zod";

// export const runtime = "edge";

export type RouteContext = {
   params: Promise<{
    chatId: string
   }>
}

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
})

export async function POST(req: NextRequest, ctx: RouteContext) {

   try {

      const session = await auth()
      if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})
      const userId = parseInt(session.user.id)

      const { chatId } = await ctx.params

      // OWNERSHIP CHECK
      const chat = await db.chat.findUnique({where: {id: chatId, userId}, select: {id: true}})
      if(!chat) return NextResponse.json({msg: 'chat not found. You do not own this chat'}, {status: 404})

      const prevMessages = await db.message.findMany({where: {chatId}, orderBy: {createdAt: 'asc'}, take: 5, select: {content: true, role: true}});
  
      let context = "";
  
      for(const msg of prevMessages) {
          context += msg.role === "USER" ? `User: ${msg.content}` : `Assistant: ${msg.content.slice(0,500)}`
          context += '\n'
      }

        const body = await req.json()
        const parsedData = streamSchema.safeParse(body)
        if(!parsedData.success) return NextResponse.json({msg: 'Invalid data', errors: parsedData.error.flatten()}, {status: 400})
      
        const { message } = parsedData.data

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
                User question: ${message.trim()}
            `;

        const result = streamText({
          model: openrouter("openai/gpt-4o-mini") as any,
          prompt
        })

      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      })

   } catch(err) {
      console.error(err)
      return NextResponse.json('Error streaming response', { status: 500})
   }
}
