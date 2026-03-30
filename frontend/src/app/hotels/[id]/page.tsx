"use client"
import { useEffect, useState, use } from "react"
import getHotel from "@/libs/getHotel"
import {
  Container,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Paper,
  Box
} from "@mui/material"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Rating from "@mui/material/Rating"
import { useSession } from "next-auth/react"

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
}

export default function HotelDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
    const { data: session } = useSession()
  const { id } = use(params)

  const [hotelDetail, setHotelDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [userRating, setUserRating] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const router = useRouter()

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getHotel(id)
        setHotelDetail(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  const handleSubmitRating = async () => {
    
  try {
    const token = session?.user?.token

    if (!token) {
      alert("Please login first")
      return
    }

    const res = await fetch(
      `${BACKEND_URL}/api/v1/hotels/${id}/rate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: userRating
        })
      }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error("Backend error:", data)
      alert(data.message || "Submit rating failed")
      return
    }

    setHotelDetail(data.data)
    setSubmitted(true)

  } catch (err) {
    console.error("Fetch error:", err)
  }
}

  // loading
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F9F6EE]">
        <CircularProgress style={{ color: "#D4AF37" }} />
      </div>
    )

  if (!hotelDetail)
    return (
      <div className="text-center py-20 bg-[#F9F6EE] min-h-screen">
        Venue not found
      </div>
    )

  return (
    <main className="min-h-screen bg-[#F9F6EE] py-20">
      <Container maxWidth="md">
        <Box className="text-center mb-16">
          <Typography className="tracking-[0.5em] text-[#D4AF37] font-bold mb-4">
            Exclusive Sanctuary
          </Typography>

          <Typography className="font-serif font-bold italic text-gray-800 mb-6 text-4xl">
            {hotelDetail.name}
          </Typography>

          <div className="flex flex-col items-center">
            <Rating
              value={hotelDetail.rating}
              readOnly
              precision={0.1}
              sx={{ color: "#D4AF37" }}
            />

            <p className="text-[#D4AF37] text-sm font-serif mt-1">
              {hotelDetail.rating?.toFixed(1)} / 5.0
            </p>

            <p className="text-xs text-gray-400">
              ({hotelDetail.ratingCount} reviews)
            </p>
          </div>
        </Box>

        <div className="mb-12">
          <img
            src={
              hotelImages[hotelDetail.name] || "/img/default.jpg"
            }
            alt={hotelDetail.name}
            className="w-full h-[400px] object-cover rounded-[30px]"
          />
        </div>

        <Paper className="p-12 rounded-[40px] bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <section>
                <Typography className="font-serif italic text-[#D4AF37] mb-2">
                  The Experience
                </Typography>

                <Typography className="text-gray-600">
                  {hotelDetail.description ||
                    "Discover a realm of tranquility and refined elegance."}
                </Typography>
              </section>

              <Divider />

              <section className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Location
                  </p>
                  <p>{hotelDetail.province}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    District
                  </p>
                  <p>{hotelDetail.district}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Address
                  </p>
                  <p>{hotelDetail.address}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Postal Code
                  </p>
                  <p>{hotelDetail.postalcode}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Region
                  </p>
                  <p>{hotelDetail.region}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Contact
                  </p>
                  <p>{hotelDetail.tel}</p>
                </div>
              </section>
            </div>

            <div className="flex flex-col items-center bg-[#FDFBF7] rounded-3xl p-8">
              <Typography className="font-serif italic mb-2">
                Reservation
              </Typography>

              <Link
                href={`/booking?id=${id}&name=${hotelDetail.name}`}
                className="w-full"
              >
                <Button
                  fullWidth
                  sx={{
                    bgcolor: "#D4AF37",
                    color: "white",
                    borderRadius: "50px"
                  }}
                >
                  BOOK NOW
                </Button>
              </Link>

              <Button
                onClick={() => router.back()}
                className="mt-4 text-gray-400 text-xs"
              >
                ← Return
              </Button>
            </div>
          </div>
        </Paper>

        <Box className="mt-16 flex flex-col items-center gap-4">
          <Typography className="text-[#D4AF37] font-serif text-xs uppercase tracking-[0.3em] font-bold">
            Rate This Sanctuary
          </Typography>

          <Rating
            value={userRating}
            onChange={(e, newValue) => setUserRating(newValue)}
            max={5}
            precision={1}
            sx={{
              fontSize: "2.5rem",
              color: "#D4AF37",
              "& .MuiRating-iconEmpty": {
                color: "#D1D5DB"
              }
            }}
          />

          {userRating && (
            <p className="text-[#D4AF37] text-sm">
              You rated: {userRating} / 5
            </p>
          )}

          <Button
            variant="contained"
            disabled={!userRating || submitted}
            onClick={handleSubmitRating}
            sx={{
              bgcolor: "#D4AF37",
              borderRadius: "50px",
              px: 4
            }}
          >
            {submitted ? "Thank you!" : "Submit Rating"}
          </Button>
        </Box>
      </Container>
    </main>
  )
}