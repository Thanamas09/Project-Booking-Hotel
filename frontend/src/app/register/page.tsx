"use client"
import { useState } from "react";
import { TextField, Button, Paper, Container, Typography } from "@mui/material";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const handleRegister = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Registration Success:", data);
                alert("Welcome to Miracle Venue!");
            } else {
                const errorData = await res.json();
                alert(`Registration failed: ${errorData.message || "Please try again."}`);
            }
        } catch (err) {
            console.error("Network Error:", err);
            alert("Could not connect to the server. Please check your connection.");
        }
    };

    return (
        <main 
            style={{ backgroundColor: '#F9F6EE' }} 
            className="min-h-screen flex items-center justify-center py-20 px-4"
        >
            <Container maxWidth="xs">
                <Paper 
                    elevation={4} 
                    className="p-10 bg-white rounded-2xl shadow-2xl"
                    style={{ borderTop: '8px solid #D4AF37' }}
                >
                    <div className="text-center mb-8">
                        <Typography 
                            variant="h4" 
                            style={{ color: '#D4AF37' }} 
                            className="font-serif font-bold italic tracking-tight mb-2"
                        >
                            Join Miracle
                        </Typography>
                        <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">
                            Create your luxury account
                        </p>
                    </div>

                    <div className="flex flex-col gap-5">
                        <TextField 
                            label="Full Name" 
                            variant="outlined" 
                            fullWidth
                            onChange={e => setForm({...form, name: e.target.value})}
                            sx={{
                                '& label.Mui-focused': { color: '#D4AF37' },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                                }
                            }}
                        />
                        <TextField 
                            label="Email Address" 
                            variant="outlined" 
                            fullWidth
                            onChange={e => setForm({...form, email: e.target.value})}
                            sx={{
                                '& label.Mui-focused': { color: '#D4AF37' },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                                }
                            }}
                        />
                        <TextField 
                            label="Password" 
                            type="password" 
                            variant="outlined" 
                            fullWidth
                            onChange={e => setForm({...form, password: e.target.value})}
                            sx={{
                                '& label.Mui-focused': { color: '#D4AF37' },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                                }
                            }}
                        />
                        <TextField 
                            label="Phone Number" 
                            variant="outlined" 
                            fullWidth
                            onChange={e => setForm({...form, phone: e.target.value})}
                            sx={{
                                '& label.Mui-focused': { color: '#D4AF37' },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                                }
                            }}
                        />

                        <Button 
                            variant="contained" 
                            onClick={handleRegister} 
                            fullWidth
                            sx={{ 
                                mt: 2, 
                                py: 2, 
                                bgcolor: '#D4AF37', 
                                color: 'white',
                                fontWeight: 'bold',
                                letterSpacing: '0.1em',
                                boxShadow: '0 4px 14px 0 rgba(212, 175, 55, 0.3)',
                                '&:hover': {
                                    bgcolor: '#B8860B',
                                    boxShadow: '0 6px 20px rgba(184, 134, 11, 0.2)',
                                }
                            }}
                        >
                            Create Account
                        </Button>
                    </div>

                    <p className="mt-8 text-center text-gray-400 text-xs italic">
                        By joining, you agree to our <span style={{ color: '#D4AF37' }}>Elite Terms</span>
                    </p>
                </Paper>
            </Container>
        </main>
    );
}