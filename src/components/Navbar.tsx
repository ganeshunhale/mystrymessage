"use client"
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
const Navbar = () => {
    const { data: session } = useSession()
    console.log(session)    
    const user = session?.user
  return (<nav className='p-4 md:p-6 shadow-md'>
    <div className='container mx-auto flex justify-between items-center'>
        <Link className='text-xl font-bold mb-4 md:mb-0' href="/">Mystry Message</Link>
        {session ? (<>
            <span className='mr-4'>welcome {user?.name||user?.email}</span>  
            <button className='w-full md:w-auto' onClick={()=>signOut}>logout</button>
            </>
        ) : (   
            <Link href="/sign-in">
              <button className='w-full md:w-auto'>Login</button>
              </Link>

        )}
    </div>
    </nav>
  )
}

export default Navbar