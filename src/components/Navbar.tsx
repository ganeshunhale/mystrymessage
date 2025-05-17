"use client"
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
const Navbar = () => {
    const { data: session } = useSession()
    console.log(session)    
    const user = session?.user
  return (
    <div>
        <a href="#">Mystry Message</a>
        {session ? (<>
            <span>welcome {user?.name||user?.email}</span>  
            <button  onClick={()=>signOut}>logout</button>
            </>
        ) : (   
            <Link href="/signin">Login</Link>

        )}
    </div>
  )
}

export default Navbar