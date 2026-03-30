"use client"
import Banner from "@/components/Banner"
import VenueCatalog from "@/components/VenueCatalog"
import getHotels from "@/libs/getHotels"
import { Suspense } from "react"
import { Typography, Container } from "@mui/material"
import { useState } from "react"

export default function Home() {
  const hotels = getHotels();
  const [sortType, setSortType] = useState("default")
  const [searchText, setSearchText] = useState("")

  return (
    <main className="bg-[#F9F6EE]">
      <Banner />
      
      <Container className="py-20">

        <div className="mb-12 border-b border-[#D4AF37]/20 pb-6">

          <Typography 
            variant="h3" 
            className="font-serif font-bold text-[#D4AF37] tracking-tight text-center mb-6"
          >
            Featured Destinations
          </Typography>

          <div className="flex justify-between items-center w-full px-12">

            <div className="relative">
              <input
                type="text"
                placeholder="Search hotel..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-gray-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-serif">Sort by:</span>

              <div className="relative">
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  className="px-4 py-2 rounded-full border border-gray-400 bg-white text-gray-800 shadow-sm appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="default">Default</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="rating">Rating (High → Low)</option>
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">
                  ▼
                </div>
              </div>
            </div>

          </div>
        </div>

        <Suspense fallback={
          <p className="text-center text-[#D4AF37] font-serif italic">
            Loading Miracle Experiences...
          </p>
        }>
          <VenueCatalog 
            venuesJson={hotels} 
            sortType={sortType} 
            searchText={searchText}
          />
        </Suspense>

      </Container>

      <section 
        className="py-20 border-t border-[#D4AF37]/20 bg-[#F9F6EE]"
      >
        <Container className="text-center">
          <Typography 
            variant="h5" 
            className="font-serif italic mb-4 text-[#D4AF37]"
          >
            "The best way to predict the future is to create it."
          </Typography>
          <p className="text-gray-400 tracking-widest uppercase text-[10px]">
            Frontend Miracle Group © 2026
          </p>
        </Container>
      </section>

    </main>
  )
}