import ChatInput from "~/components/ChatInput";
import ChatSidebar from "~/components/chatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
