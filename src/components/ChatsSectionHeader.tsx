import { MessageSquare } from "lucide-react";
import NewChatButton from "./NewChatButton";
import SpurIcon from "./SpurIcon";


export default function ChatsSectionHeader() {
  return <>
      <SpurIcon />
      <NewChatButton />

      <div className="mt-2 flex items-center gap-2 px-2 text-lg font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-300 border-b-[3px] border-gray-700 py-2">
            <MessageSquare className="h-6 w-6" />
            Your Chats
       </div>
   </>
}
