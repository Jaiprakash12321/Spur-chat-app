import { LogOut } from "lucide-react";
import UserAccountNav from "./UserAccountNav";
import { signOut, useSession } from "next-auth/react";


export default function ChatsSectionBottom() {

     const {data: session, status} = useSession()
     const user = session?.user


    return (
           <div className="flex items-center justify-between mt-auto text-lg font-bold uppercase border-t-[3px] border-zinc-400 p-1 dark:border-white/10">
             <div className="flex-center gap-4">
                  <UserAccountNav />
                  {user?.name}
             </div>

            <button onClick={() => signOut({callbackUrl: '/'})}
             className='flex items-center lowercase gap-2 text-base p-1.5 font-bold transition-all duration-100 text-red-500 hover:text-red-600 cursor-pointer'>
                  <LogOut className='size-4' strokeWidth={3}/> Log out
             </button>

       </div>
    )
}