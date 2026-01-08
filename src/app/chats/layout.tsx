import { redirect } from "next/navigation";
import ChatInput from "~/components/ChatInput";
import ChatSidebar from "~/components/chatSidebar";
import { sleep } from "~/lib/utils";
import { auth } from "~/server/auth";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {


   // Try commenting out this 
   const session = await auth()
   if(!session?.user) return redirect('/signin?reason=auth')

  //  await sleep(5000)

  return (
    <div className="flex h-screen">
      <ChatSidebar />

      <main className="relative flex flex-1 flex-col">
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        <div className="sticky bottom-0">
          <ChatInput />
        </div>

      </main>
    </div>
  );
}
