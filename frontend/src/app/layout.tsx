import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import { getServerSession } from "next-auth"
import NextAuthProvider from "@/providers/NextAuthProvider"
import ReduxProvider from "@/redux/ReduxProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { 
    title: "Miracle Venue | Luxury Event Spaces", 
    description: "Exquisite venues for your most precious moments" 
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#F9F6EE] text-gray-900 antialiased`}>
        <ReduxProvider> 
          <NextAuthProvider session={session}>
            <TopMenu/>
            
            <div className="min-h-screen flex flex-col pt-[70px]">
               <main className="flex-grow">
                  {children}
               </main>
               
               <footer 
                 style={{ borderTop: '1px solid rgba(212, 175, 55, 0.1)' }} 
                 className="py-10 bg-[#F9F6EE] text-center"
               >
                  <div 
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }} 
                    className="w-20 h-[1px] mx-auto mb-6"
                  ></div>

                  <p 
                    style={{ color: '#D4AF37' }} 
                    className="font-serif italic text-sm tracking-widest"
                  >
                    FRONTEND MIRACLE GROUP
                  </p>
                  
                  <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-[0.2em]">
                    © 2026 Excellence in Every Event
                  </p>
               </footer>
            </div>
          </NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}