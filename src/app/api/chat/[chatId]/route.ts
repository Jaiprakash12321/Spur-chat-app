import { NextRequest, NextResponse } from "next/server";
import { updateTitleSchema } from "~/lib/zod";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export type RouteContext = {
   params: Promise<{
    chatId: string
   }>
}

export async function DELETE(req: NextRequest, context: RouteContext) {
    try {
      const session = await auth()
      if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})

      const { chatId } = await context.params

      const chat = await db.chat.findUnique({where: {id: chatId}, select: {id: true}})

      if(!chat) return NextResponse.json({msg: 'chat not found'}, {status: 404})

      await db.chat.delete({where: {id: chat.id}})

      return NextResponse.json({success: true}, { status: 200})
    } catch(err) {
      console.error(err)
      return NextResponse.json({msg: 'Error deleting chat'}, { status: 500})
    }
}

export async function GET(req: NextRequest, context: RouteContext) {
    try {
      const session = await auth()
      if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})
      const userId = parseInt(session.user.id)

      const { chatId } = await context.params

      // Add userId to ensure chat belongs to right user
      const chat = await db.chat.findUnique({where: {id: chatId, userId}, select: {id: true}})

      if(!chat) return NextResponse.json({msg: 'chat not found'}, {status: 404})

      const messages = await db.message.findMany({where: {chatId}})

      return NextResponse.json({messages}, {status: 200})
    } catch(err) {
      console.error(err)
      return NextResponse.json({msg: 'Error getting messages'}, { status: 500})
    }
}

export async function POST(req: NextRequest, context: RouteContext) {
    try {
      const session = await auth()
      if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})

      const body = await req.json()
      const parsedData = updateTitleSchema.safeParse(body)
      if(!parsedData.success) return NextResponse.json({msg: 'Invalid data', errors: parsedData.error.flatten()}, {status: 400})

      const { title } = parsedData.data

      const { chatId } = await context.params

      const chat = await db.chat.findUnique({where: {id: chatId}, select: {id: true}})

      if(!chat) return NextResponse.json({msg: 'chat not found'}, {status: 404})

      await db.chat.update({where: {id: chat.id}, data: {title}})

      return NextResponse.json({success: true}, {status: 200})
    } catch(err) {
      console.error(err)
      return NextResponse.json({msg: 'Error updating title'}, { status: 500})
    }
}