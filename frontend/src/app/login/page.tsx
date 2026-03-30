"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { TextField, Button, Typography, Container, Paper } from "@mui/material";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        await signIn("credentials", {
            email, password, callbackUrl: "/"
        });
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
                    
                    <div className="text-center mb-10">
                        <Typography 
                            variant="h4" 
                            style={{ color: '#D4AF37' }} 
                            className="font-serif font-bold italic tracking-tight mb-2"
                        >
                            Welcome Back
                        </Typography>
                        <div 
                            style={{ backgroundColor: '#D4AF37' }} 
                            className="w-12 h-[1px] mx-auto mb-4 opacity-40"
                        ></div>
                        <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">
                            Enter your credentials to continue
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <TextField 
                            label="Email Address" 
                            variant="outlined" 
                            fullWidth
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                '& label.Mui-focused': { color: '#D4AF37' },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                                }
                            }}
                        />
                        
                        <div className="flex flex-col gap-2">
                            <TextField 
                                label="Password" 
                                type="password" 
                                variant="outlined" 
                                fullWidth
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{
                                    '& label.Mui-focused': { color: '#D4AF37' },
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
                                    }
                                }}
                            />
                        </div>

                        <Button 
                            variant="contained" 
                            fullWidth 
                            onClick={handleSubmit} 
                            sx={{ 
                                py: 2, 
                                bgcolor: '#D4AF37', 
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                letterSpacing: '0.15em',
                                borderRadius: '8px',
                                boxShadow: '0 4px 14px 0 rgba(212, 175, 55, 0.3)',
                                '&:hover': {
                                    bgcolor: '#B8860B',
                                    boxShadow: '0 6px 20px rgba(184, 134, 11, 0.2)',
                                }
                            }}
                        >
                            Login to Miracle
                        </Button>
                    </div>

                    <div className="mt-10 text-center border-t border-gray-100 pt-6">
                        <p className="text-gray-400 text-xs italic mb-4">
                            New to our sanctuary?
                        </p>
                        <Link href="/register">
                            <Button 
                                variant="outlined" 
                                fullWidth
                                sx={{ 
                                    borderColor: '#D4AF37', 
                                    color: '#D4AF37',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        borderColor: '#B8860B',
                                        bgcolor: 'rgba(212, 175, 55, 0.05)'
                                    }
                                }}
                            >
                                Create Account
                            </Button>
                        </Link>
                    </div>
                </Paper>
            </Container>
        </main>
    );
}