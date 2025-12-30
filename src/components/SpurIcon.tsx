import { Bot } from "lucide-react";
import { motion } from 'framer-motion'

export default function SpurIcon() {
    return  <div className='flex items-center gap-2'>
            <div className="relative flex-center rounded-full border-4 border-blue-500/40 p-2">
                <Bot className="h-7 w-7 animate-pulse text-blue-400" />
                <span className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl" />
            </div>
            <motion.h2 initial={{ y: -23 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'backInOut' }}
                className='mb:text-4xl bg-linear-to-r from-blue-400 to-blue-700 bg-clip-text font-black tracking-tighter text-transparent min-[375px]:block'>Spur AI Agent</motion.h2>
    </div>
}