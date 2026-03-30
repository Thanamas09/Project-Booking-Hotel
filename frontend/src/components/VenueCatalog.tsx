"use client"
import Card from "./Card"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function VenueCatalog({
  venuesJson,
  sortType,
  searchText
}: {
  venuesJson: Promise<any>;
  sortType: string;
  searchText: string;
}) {

  const [venueData, setVenueData] = useState<any>(null)

  const hotelImages: Record<string, string> = {
    "Phuket Beach Paradise": "/img_hotel/Phuket Beach Paradise.png",
    "Chiang Mai Riverside Resort": "/img_hotel/Chiang Mai Riverside Resort.png",
    "Bangkok Grand Hotel": "/img_hotel/Bangkok Grand Hotel.png",
    "Khon Kaen City Hotel": "/img_hotel/Khon Kaen City Hotel.png",
    "Pattaya Ocean View Hotel": "/img_hotel/Pattaya Ocean View Hotel.png",
    "Golden Temple Resort": "/img_hotel/Golden Temple Resort.png",
    "Siam City Hotel": "/img_hotel/Siam City Hotel.png",
    "Chiang Rai Mountain View": "/img_hotel/Chiang Rai Mountain.png",
    "Pattaya Sunset Resort": "/img_hotel/Pattaya Sunset Resort.png",
    "Krabi Paradise Hotel": "/img_hotel/Krabi Paradise Hotel.png",
    "Udon Thani Grand Hotel": "/img_hotel/Udon Thani Grand Hotel.png",
    "Andaman Sea View Hotel": "/img_hotel/Andaman Sea View Hotel.png"
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await venuesJson
      setVenueData(data)
    }
    fetchData()
  }, [venuesJson])

  if (!venueData) return <div>Loading...</div>

  const filteredHotels = venueData.data.filter((hotel: any) =>
    hotel.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortType === "name") return a.name.localeCompare(b.name)
    if (sortType === "rating") return b.rating - a.rating
    return 0
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 p-12">
      {sortedHotels.map((hotel: any) => (
        <Link key={hotel._id} href={`/hotels/${hotel._id}`}>
          <Card
            venueName={hotel.name}
            rating={hotel.rating}
            image={hotelImages[hotel.name]}
          />
        </Link>
      ))}
    </div>
  )
}