import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
   try {
      const session = await auth()
      if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})
      const userId = parseInt(session.user.id)

      const chat = await db.chat.create({data: {title: 'New Chat', userId}, select: {id: true}})

      return NextResponse.json({ chatId: chat.id }, {status: 200});
   } catch(err) {
      console.error(err)
      return NextResponse.json({msg: 'Error creating chat'}, { status: 500})
   }
}

export async function GET(req: NextRequest) {
    try {
      const session = await auth()
      if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})
      const userId = parseInt(session.user.id)

      const chats = await db.chat.findMany({where: {userId}, orderBy: {updatedAt: 'desc'}, select: {id: true, title: true, createdAt: true}})

      return NextResponse.json({chats}, {status: 200})
    } catch(err) {
      console.error(err)
      return NextResponse.json({msg: 'Error fetching chats'}, { status: 500})
    }
}
