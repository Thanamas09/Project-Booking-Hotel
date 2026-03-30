"use client"
import Link from "next/link"

export default function TopMenuItem({ title, pageRef }: { title: string, pageRef: string }) {
  return (
    <Link 
      href={pageRef} 
      style={{ color: '#D4AF37' }}
      className="font-serif font-medium text-sm uppercase tracking-widest hover:opacity-70 transition-opacity no-underline px-2"
    >
      {title}
    </Link>
  )
}