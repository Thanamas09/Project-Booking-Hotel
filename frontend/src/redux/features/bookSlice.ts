import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ดึง URL จาก Environment Variable (ถ้าไม่มีให้ใช้ localhost เป็นค่าเริ่มต้นสำหรับรันในเครื่อง)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const addBookingThunk = createAsyncThunk(
    'book/addBooking',
    async ({ hotelId, checkin, checkout, token }: any, { rejectWithValue }) => {
        try {
            console.log("Sending Booking:", { hotelId, checkin, checkout, hasToken: !!token });
            
            const url = `${BACKEND_URL}/api/v1/appointments/${hotelId}`;
            
            const res = await fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    checkinDate: checkin, 
                    checkoutDate: checkout 
                })
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Backend Error Details:", data);
                return rejectWithValue(data.message || "Booking Fail!");
            }
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeBookingThunk = createAsyncThunk(
    'book/removeBooking',
    async ({ id, token }: any, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/appointments/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                const data = await response.json();
                return rejectWithValue(data.message || "Delete failed");
            }
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateBookingThunk = createAsyncThunk(
    "booking/update",
    async ({ id, checkinDate, checkoutDate, token }: { id: string, checkinDate: string, checkoutDate: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/appointments/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    checkinDate: checkinDate,
                    checkoutDate: checkoutDate,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Update failed");
            }

            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const bookSlice = createSlice({
    name: "book",
    initialState: { bookItems: [] as any[] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addBookingThunk.fulfilled, (state, action) => { 
            state.bookItems.push(action.payload.data); 
        });
        builder.addCase(removeBookingThunk.fulfilled, (state, action) => {
            state.bookItems = state.bookItems.filter(item => item._id !== action.payload);
        });
        builder.addCase(updateBookingThunk.fulfilled, (state, action) => {
            const index = state.bookItems.findIndex(item => item._id === action.payload.data._id);
            if (index !== -1) {
                state.bookItems[index] = action.payload.data;
            }
        });
    }
});

export default bookSlice.reducer;