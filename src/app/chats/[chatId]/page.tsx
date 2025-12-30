import { auth } from "~/server/auth"
import { db } from "~/server/db"
import { redirect, notFound } from "next/navigation"
import MessageList from "~/components/MessageList"

type PageProps = {
  params: Promise<{
    chatId: string
  }>
}

export default async function ChatPage({params}: PageProps) {

    const session = await auth()
    if(!session?.user) return redirect('/signin')
    const userId = parseInt(session.user.id)
    
    const { chatId } = await params

    const chats = await db.chat.findMany({where: {userId}})
    if(!chats || chats.length == 0) return redirect('/chats')

    // ADD userId to ensure chat belongs to user
    const chat = await db.chat.findUnique({where: {id: chatId, userId}})

    const current_chat = chats.find(chat => chat.id == chatId)
    if(!current_chat) return notFound()

    const messages = await db.message.findMany({where: {chatId: current_chat.id}, orderBy: {createdAt: 'desc'}})
//  border-4 border-red-500
  return (
    <div className="flex h-full flex-col">
        <MessageList chatId={chatId}/>
    </div>
  );
}
