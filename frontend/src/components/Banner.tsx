"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

export default function Banner() {
  const covers = ["/img/cover.jpg", "/img/cover2.jpg", "/img/cover3.jpg", "/img/cover4.jpg"]
  const [index, setIndex] = useState(0)
  const router = useRouter()
  const { data: session } = useSession()

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const changeBanner = () => setIndex((index + 1) % covers.length)

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await fetch(`${BACKEND_URL}/api/v1/auth/logout`, { method: "GET" });
    } catch (err) {
      console.error("Backend logout failed", err);
    }

    signOut({ callbackUrl: "/" });
  }

  return (
    <div 
      className="relative w-full h-[600px] cursor-pointer overflow-hidden"
      onClick={changeBanner}
    >
      <Image
        src={covers[index]}
        alt="Miracle Venue Banner"
        fill
        priority
        className="object-cover transition-all duration-1000 ease-in-out"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />

      {session && (
        <div className="absolute top-8 right-8 z-30 flex flex-col items-end gap-2 group">
          <div 
            style={{ borderBottom: '1px solid #D4AF37' }} 
            className="text-[#D4AF37] font-serif italic text-lg pb-1 transition-all group-hover:pr-2"
          >
            Welcome, <span style={{ color: '#D4AF37' }}>{session.user?.name}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-center items-start px-20 text-white z-10 max-w-4xl">
        <h1 className="text-6xl font-serif font-bold leading-tight mb-4 drop-shadow-lg">
          Where Every Event <br/> 
          <span style={{ color: '#D4AF37' }} className="italic font-playfair">Finds Its Miracle</span>
        </h1>

        <button
          onClick={(e) => {
            e.stopPropagation()
            router.push("/hotels")
          }}
          style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37' }}
          className="hover:bg-white hover:text-[#D4AF37] text-white px-10 py-4 rounded-full z-20 transition-all duration-300 font-bold uppercase tracking-widest shadow-xl border-2"
        >
          Explore Our Miracle Hotels
        </button>
      </div>
    </div>
  )
}