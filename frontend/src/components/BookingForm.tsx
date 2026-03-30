"use client"
import { useState, useEffect } from "react";
import { Button, Select, MenuItem, FormControl, InputLabel, Typography, Paper, Box } from "@mui/material";
import DateReserve from "@/components/DateReserve";
import { useDispatch } from "react-redux";
import { addBookingThunk } from "@/redux/features/bookSlice";
import { useSession } from "next-auth/react";
import { AppDispatch } from "@/redux/store";
import getHotels from "@/libs/getHotels";
import dayjs from "dayjs";

export default function BookingForm() {
    const { data: session } = useSession();
    const dispatch = useDispatch<AppDispatch>();

    const [hotelId, setHotelId] = useState("");
    const [checkin, setCheckin] = useState<any>(null);
    const [checkout, setCheckout] = useState<any>(null);
    const [hotels, setHotels] = useState<any[]>([]);

    useEffect(() => {
    const fetchHotels = async () => {
        try {
            const token = session?.user?.token

            const data = await getHotels(token)
            setHotels(data.data)
        } catch (err) {
            console.log(err)
        }
    }

    if (session) {
        fetchHotels()
    }
}, [session])

    const handleBooking = async () => {
        if (hotelId && checkin && checkout && session) {
            const formattedCheckin = dayjs(checkin).format("YYYY-MM-DD");
            const formattedCheckout = dayjs(checkout).format("YYYY-MM-DD");

            try {
                await dispatch(addBookingThunk({ 
                    hotelId, 
                    checkin: formattedCheckin, 
                    checkout: formattedCheckout, 
                    token: session.user.token 
                })).unwrap();
                alert("Your luxury stay has been reserved!");
            } catch (err: any) {
                alert(`Booking failed: ${err}`);
            }
        } else {
            alert("Please complete your reservation details.");
        }
    };

    return (
        <Paper 
            elevation={0} 
            className="flex flex-col gap-8 p-12 bg-white rounded-[40px] w-[500px]"
            style={{ 
                border: '1px solid #F5F1E6',
                boxShadow: '0 20px 40px rgba(212, 175, 55, 0.08)' 
            }}
        >
            <Box className="text-center">
                <Typography 
                    variant="overline" 
                    className="tracking-[0.4em] text-[#D4AF37] font-bold block mb-2"
                >
                    Private Selection
                </Typography>
                <Typography 
                    variant="h3" 
                    className="text-[#D4AF37] font-serif font-bold italic tracking-tighter"
                    sx={{ fontSize: '2.5rem' }}
                >
                    Miracle Reservation
                </Typography>
                <div 
                    style={{ backgroundColor: '#D4AF37' }} 
                    className="w-16 h-[1px] mx-auto mt-4 opacity-30"
                ></div>
            </Box>
            
            <div className="flex flex-col gap-3">

                <Typography className="text-[#D4AF37] font-serif text-[10px] uppercase tracking-[0.3em] font-bold">
                    Sanctuary Destination
                </Typography>

                <Box 
                    sx={{ 
                    p: 0.5,
                    borderBottom: '1px solid #F5F1E6',
                    '&:hover': { borderBottomColor: '#D4AF37' },
                    '&:focus-within': { borderBottomColor: '#D4AF37' },
                    transition: 'all 0.3s'
                    }}
                >
                    <Select 
                    value={hotelId} 
                    onChange={(e) => setHotelId(e.target.value)}
                    displayEmpty
                    variant="standard"
                    disableUnderline
                    sx={{
                        width: '100%',
                        fontFamily: 'serif',
                        fontSize: '1.1rem',
                        '.MuiSelect-select': { 
                        color: '#4A4A4A',
                        padding: 0
                        }
                    }}
                    >
                    <MenuItem value="" disabled className="italic text-[#D4AF37]">
                        Choose your miracle hotel...
                    </MenuItem>

                    {hotels.map((hotel) => (
                        <MenuItem key={hotel._id} value={hotel._id}>
                        {hotel.name}
                        </MenuItem>
                    ))}
                    </Select>
                </Box>

            </div>

            <div className="grid grid-cols-1 gap-8 mt-2">
                <div className="flex flex-col gap-3">
                    <Typography className="text-[#D4AF37] font-serif text-[10px] uppercase tracking-[0.3em] font-bold">
                        Check-in Journey
                    </Typography>
                    <Box 
                        sx={{ 
                            p: 0.5,
                            borderBottom: '1px solid #F5F1E6',
                            '&:hover': { borderBottomColor: '#D4AF37' },
                            transition: 'all 0.3s'
                        }}
                    >
                        <DateReserve onDateChange={(val) => setCheckin(val)} />
                    </Box>
                </div>

                <div className="flex flex-col gap-3">
                    <Typography className="text-[#D4AF37] font-serif text-[10px] uppercase tracking-[0.3em] font-bold">
                        Check-out Journey
                    </Typography>
                    <Box 
                        sx={{ 
                            p: 0.5,
                            borderBottom: '1px solid #F5F1E6',
                            '&:hover': { borderBottomColor: '#D4AF37' },
                            transition: 'all 0.3s'
                        }}
                    >
                        <DateReserve onDateChange={(val) => setCheckout(val)} />
                    </Box>
                </div>
            </div>

            <Button 
                variant="contained" 
                onClick={handleBooking}
                fullWidth
                sx={{ 
                    mt: 4, 
                    py: 2.5, 
                    borderRadius: '50px',
                    fontWeight: 'bold', 
                    bgcolor: '#D4AF37',
                    color: 'white',
                    fontSize: '0.85rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    boxShadow: '0 10px 25px rgba(212, 175, 55, 0.2)',
                    '&:hover': {
                        bgcolor: '#B8860B',
                        boxShadow: 'none',
                    }
                }}
            >
                Confirm Luxury Stay
            </Button>
            
            <Typography variant="caption" className="text-center text-gray-300 italic tracking-wider">
                — Elegance in every detail —
            </Typography>
        </Paper>
    );
}