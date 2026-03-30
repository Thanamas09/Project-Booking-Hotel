"use client"
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { Dayjs } from "dayjs";

interface DateReserveProps {
    onDateChange: (value: string) => void;
}

export default function DateReserve({ onDateChange }: DateReserveProps) {
    const [reserveDate, setReserveDate] = useState<Dayjs | null>(null);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="Select Date"
                value={reserveDate}
                onChange={(newValue) => {
                    setReserveDate(newValue);
                    if (newValue) {
                        onDateChange(newValue.format("YYYY/MM/DD"));
                    }
                }}
                slotProps={{
                    textField: {
                        variant: "standard",
                        fullWidth: true,
                        sx: {
                            ".MuiInputBase-input": { color: "white" },
                            ".MuiInputLabel-root": { color: "#999" },
                            "& .MuiInput-underline:before": { borderBottomColor: "#666" },
                            "& .MuiInput-underline:hover:before": { borderBottomColor: "white" },
                        }
                    }
                }}
            />
        </LocalizationProvider>
    );
}