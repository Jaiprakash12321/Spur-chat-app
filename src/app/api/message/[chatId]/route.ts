import { NextRequest, NextResponse } from "next/server";
import { generateChatTitle } from "~/lib/gemini";
import { createMessageSchema } from "~/lib/zod";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export type RouteContext = {
   params: Promise<{
    chatId: string
   }>
}

export async function POST(req: NextRequest, context: RouteContext) {
     try {
            const session = await auth()
            if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})
            const userId = parseInt(session.user.id)

            const body = await req.json()
            const parsedData = createMessageSchema.safeParse(body)
            if(!parsedData.success) return NextResponse.json({msg: 'Invalid data', errors: parsedData.error.flatten()}, {status: 400})

            const { message } = parsedData.data
            // Always add server side protection
            // Client side can be manipulated by attackers
            if(message.length > 1500) return NextResponse.json({msg: 'Prompt too big'}, { status: 401})

            const { chatId } = await context.params
            const chat = await db.chat.findUnique({where: {id: chatId}, select: {id: true, messages: { select: {role: true}}, title: true}})
            if(!chat) return NextResponse.json({msg: 'chat not found'}, {status: 404})

            const msg = await db.message.create({data: {content: message, chatId, role: 'USER'}, select: {id: true, content: true}})

            const isFirstUserMessage = !chat.messages.some((m) => m.role === "USER") && chat.title === "New Chat";

            let titleUpdated = false;

            if (isFirstUserMessage) {
                const title = await generateChatTitle(message);
                await db.chat.update({where: {id: chat.id}, data: {title}})
                titleUpdated = true;
            }

            return NextResponse.json({success: true, msg, titleUpdated}, {status: 200})

     } catch(err) {
         console.error(err)
         return NextResponse.json({msg: 'Error creating message'}, { status: 500})
     }
}