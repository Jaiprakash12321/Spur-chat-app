import { Bot } from "lucide-react";

export default function EmptyChatPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-4 flex-center rounded-full border-4 border-blue-500/40 p-4">
        <Bot className="h-8 w-8 text-blue-400 animate-pulse" />
      </div>

      <h2 className="text-xl font-semibold">Start a new conversation</h2>
      <p className="mt-1 text-sm text-gray-400">
        Start a conversation to get help with Returns or Shipping!
      </p>
    </div>
  );
}
