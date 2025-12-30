'use client'

import { motion } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import UserAccountNav from './UserAccountNav'
import Link from 'next/link'
import { Bot, Loader2, LogIn} from 'lucide-react'
import SpurIcon from './SpurIcon'

export default function Navbar() {

  const pathname = usePathname()
  if (!(['/', '/signin', '/signup'].includes(pathname))) return null

  const { data: session, status } = useSession()
  const isAuth = !!session 

  return <motion.nav initial={{ opacity: 0, y: -17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, type: 'spring', damping: 7, stiffness: 100 }}
    className="fixed top-0 inset-x-0 z-999 p-3 backdrop-blur-md border-b-2 border-primary/20 bg-background flex justify-between items-center">

    <SpurIcon />

    <div className='flex items-center gap-3 p-1 sm:mr-10'>
      <ThemeToggle />
      {status === 'loading' ? <Loader2 className='animate-spin size-10'/> : isAuth ? <UserAccountNav /> : <Link className='flex items-center font-medium mb:hidden gap-2 p-2 rounded-lg bg-blue-700 text-xl text-white group' href={'/signin'}>Sign in<LogIn className='group-hover:translate-x-1 duration-200'/></Link>}
    </div>
  </motion.nav>
}