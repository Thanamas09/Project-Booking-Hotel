"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useDispatch } from "react-redux"
import { removeBookingThunk, updateBookingThunk } from "@/redux/features/bookSlice"
import getAppointments from "@/libs/getAppointments"
import {
  Button,
  Paper,
  Container,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Rating
} from "@mui/material"
import { Stack } from "@mui/material"

export default function MyBookingPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<any[]>([])
  const dispatch = useDispatch<any>()

  // edit dialog
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<any>(null)
  const [newCheckin, setNewCheckin] = useState("")
  const [newCheckout, setNewCheckout] = useState("")

  // rating dialog
  const [isRateOpen, setIsRateOpen] = useState(false)
  const [ratingBooking, setRatingBooking] = useState<any>(null)
  const [ratingValue, setRatingValue] = useState<number | null>(5)
  const [ratingComment, setRatingComment] = useState("")

  const loadData = async () => {
    if (session?.user?.token) {
      try {
        const res = await getAppointments(session.user.token)
        setBookings(res.data)
      } catch (error) {
        console.log("Failed to fetch bookings:", error)
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [session])

  const handleDelete = async (id: string) => {
    if (session && confirm("Are you sure you want to cancel this reservation?")) {
      await dispatch(removeBookingThunk({ id, token: session.user.token }))
      loadData()
    }
  }

  const handleEditClick = (booking: any) => {
    setEditingBooking(booking)
    setNewCheckin(new Date(booking.checkinDate).toISOString().split("T")[0])
    setNewCheckout(new Date(booking.checkoutDate).toISOString().split("T")[0])
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    if (session && editingBooking) {
      try {
        await dispatch(
          updateBookingThunk({
            id: editingBooking._id,
            checkinDate: newCheckin,
            checkoutDate: newCheckout,
            token: session.user.token
          })
        )
        setIsEditOpen(false)
        loadData()
        alert("Your journey has been updated.")
      } catch (err) {
        alert("Update failed. Please try again.")
      }
    }
  }

  const canRateBooking = (booking: any) => {
    return !booking?.isRated
  }

  const handleOpenRate = (booking: any) => {
    setRatingBooking(booking)
    setRatingValue(5)
    setRatingComment("")
    setIsRateOpen(true)
  }

  const handleSubmitRating = async () => {
  if (!session?.user?.token || !ratingBooking || !ratingValue) return

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotels/${ratingBooking.hotel._id}/rate`
    console.log("Submitting rating to:", url)

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`
      },
      body: JSON.stringify({
        appointmentId: ratingBooking._id,
        rating: ratingValue,
        comment: ratingComment
      })
    })

    const text = await res.text()
    console.log("Raw response:", text)

    let data
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(`Server did not return JSON. Response was: ${text.slice(0, 200)}`)
    }

    if (!res.ok) {
      throw new Error(data.message || "Rating failed")
    }

    alert("Rating submitted successfully")
    setIsRateOpen(false)
    loadData()
  } catch (err: any) {
    alert(err.message || "Rating failed")
  }
}

  return (
    <main style={{ backgroundColor: "#F9F6EE" }} className="min-h-screen py-20">
      <Container maxWidth="md">
        <Box className="text-center mb-20">
          <Typography
            variant="h3"
            style={{ color: "#D4AF37" }}
            className="font-serif font-bold italic mb-3 tracking-tight"
          >
            {session?.user.role === "admin" ? "Reservation Management" : "My Reservations"}
          </Typography>
          <div
            style={{ backgroundColor: "#D4AF37" }}
            className="w-24 h-[1px] mx-auto mb-4 opacity-40"
          ></div>
          <Typography className="text-gray-400 text-[10px] uppercase tracking-[0.4em]">
            Luxury stays curated for you
          </Typography>
        </Box>

        <div className="max-w-4xl mx-auto">
          {bookings.length > 0 ? (
            <Stack spacing={4}>
              {bookings.map((b) => (
                <Paper
                  key={b._id}
                  elevation={0}
                  className="p-10 bg-white rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm border-l-[8px] border-[#D4AF37] transition-all duration-300 hover:shadow-lg"
                  sx={{ width: "100%" }}
                >
                  <div className="text-center md:text-left flex-grow px-2">
                    <Typography variant="h5" className="text-gray-800 font-bold mb-1 font-serif">
                      {b.hotel?.name || "Premium Venue"}
                    </Typography>

                    <Typography className="text-gray-400 text-sm italic">
                      Booked by: {b.user?.name}
                    </Typography>

                    <Typography
                      style={{ color: "#D4AF37" }}
                      className="font-medium text-xs uppercase tracking-[0.2em] mb-4 block"
                    >
                      {b.hotel?.province}
                    </Typography>

                    <Divider className="my-6 opacity-30" />

                    <div className="flex justify-center md:justify-start gap-12 mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                          Check-in
                        </span>
                        <b className="text-gray-700 text-base">
                          {new Date(b.checkinDate).toLocaleDateString("en-GB")}
                        </b>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                          Check-out
                        </span>
                        <b className="text-gray-700 text-base">
                          {new Date(b.checkoutDate).toLocaleDateString("en-GB")}
                        </b>
                      </div>
                    </div>

                    {b.isRated && (
                      <Box className="mt-3">
                        <Typography className="text-sm text-gray-500 mb-1">
                          Your review
                        </Typography>
                        <Rating value={b.rating || 0} readOnly />
                        {b.comment && (
                          <Typography className="text-sm text-gray-600 mt-1 italic">
                            "{b.comment}"
                          </Typography>
                        )}
                      </Box>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-52 shrink-0">
                    {!b.isRated && canRateBooking(b) && session?.user.role !== "admin" && (
                      <Button
                        variant="contained"
                        onClick={() => handleOpenRate(b)}
                        sx={{
                          bgcolor: "#D4AF37",
                          color: "white",
                          borderRadius: "50px",
                          py: 1.2,
                          fontWeight: "bold",
                          "&:hover": { bgcolor: "#B8860B" }
                        }}
                      >
                        Rate Stay
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      onClick={() => handleEditClick(b)}
                      sx={{
                        borderColor: "#D4AF37",
                        color: "#D4AF37",
                        borderRadius: "50px",
                        py: 1.2,
                        fontWeight: "bold"
                      }}
                    >
                      Edit Booking
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => handleDelete(b._id)}
                      sx={{
                        bgcolor: "#FEF2F2",
                        color: "#DC2626",
                        borderRadius: "50px",
                        py: 1.2,
                        boxShadow: "none",
                        fontWeight: "bold"
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Box className="text-center py-20 bg-white/40 rounded-[40px] border border-dashed border-[#D4AF37]/30">
              <Typography className="font-serif italic text-gray-400">
                No active reservations.
              </Typography>
            </Box>
          )}
        </div>

        <Dialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          PaperProps={{
            style: { borderRadius: 30, padding: 20, width: "100%", maxWidth: 450 }
          }}
        >
          <DialogTitle className="font-serif text-[#D4AF37] text-3xl font-bold italic text-center">
            Adjust Stay
          </DialogTitle>
          <DialogContent className="space-y-6 pt-6">
            <TextField
              label="New Check-in Date"
              type="date"
              fullWidth
              variant="standard"
              value={newCheckin}
              onChange={(e) => setNewCheckin(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="New Check-out Date"
              type="date"
              fullWidth
              variant="standard"
              value={newCheckout}
              onChange={(e) => setNewCheckout(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions className="p-6 justify-center gap-4">
            <Button onClick={() => setIsEditOpen(false)} sx={{ color: "gray", textTransform: "none" }}>
              Dismiss
            </Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              sx={{
                bgcolor: "#D4AF37",
                px: 4,
                borderRadius: "50px",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#B8860B" }
              }}
            >
              Confirm Changes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isRateOpen}
          onClose={() => setIsRateOpen(false)}
          PaperProps={{
            style: { borderRadius: 30, padding: 20, width: "100%", maxWidth: 450 }
          }}
        >
          <DialogTitle className="font-serif text-[#D4AF37] text-3xl font-bold italic text-center">
            Rate Your Stay
          </DialogTitle>

          <DialogContent className="space-y-6 pt-6">
            <Box className="flex justify-center py-4">
              <Rating
                value={ratingValue}
                onChange={(_, newValue) => setRatingValue(newValue)}
                size="large"
              />
            </Box>

            <TextField
              label="Comment"
              fullWidth
              multiline
              minRows={3}
              variant="standard"
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
            />
          </DialogContent>

          <DialogActions className="p-6 justify-center gap-4">
            <Button onClick={() => setIsRateOpen(false)} sx={{ color: "gray", textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRating}
              variant="contained"
              sx={{
                bgcolor: "#D4AF37",
                px: 4,
                borderRadius: "50px",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#B8860B" }
              }}
            >
              Submit Rating
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </main>
  )
}