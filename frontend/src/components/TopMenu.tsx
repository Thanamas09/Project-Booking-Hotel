"use client"
import TopMenuItem from "./TopMenuItem"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export default function TopMenu() {
  const { data: session } = useSession()

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-[#F9F6EE] border-b border-[#D4AF37]/20 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/">
           <img src="/img/logo.png" alt="logo" className="h-10 hover:opacity-80 transition-all" />
        </Link>
        <TopMenuItem title="Hotels" pageRef="/hotels" />
        <TopMenuItem title="Booking" pageRef="/booking" />
        <TopMenuItem title="My Booking" pageRef="/mybooking" />
      </div>
      
      <div className="flex items-center gap-6">
        {session ? (
          <div className="flex items-center gap-4">

         <TopMenuItem title="My Profile" pageRef="/profile" />
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="font-serif font-medium text-sm uppercase tracking-widest text-[#D4AF37] hover:opacity-70 transition-opacity px-2"
          >
            Sign Out
          </button>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <TopMenuItem title="Sign In" pageRef="/login" />
            <TopMenuItem title="Register" pageRef="/register" />
          </div>
        )}
      </div>
    </div>
  )
}