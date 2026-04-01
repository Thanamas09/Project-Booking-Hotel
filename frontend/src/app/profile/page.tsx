"use client"
import { useSession } from "next-auth/react"
import { Container, Typography, Paper } from "@mui/material"
import getUser from "@/libs/getUser"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<any>(null)
    useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!session?.user?.token) return

        const res = await getUser(session.user.token)
        setUserData(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchUser()
  }, [session])
  if (!session) {
    return <div className="text-center py-20">Please login</div>
  }
  console.log(useSession())
  return (
    <main className="min-h-screen bg-[#F9F6EE] py-20">
      <Container maxWidth="sm">
        
        <Typography 
          variant="h4" 
          className="text-center font-serif italic mb-10 text-gray-800"
        >
          My Profile
        </Typography>

        <Paper className="p-10 rounded-[30px] shadow-md border border-[#D4AF37]/20 space-y-6">

        <div className="grid grid-cols-2 gap-6">

            <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Name</p>
                <p className="text-lg font-medium">{session.user?.name}</p>
            </div>

            <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Email</p>
                <p className="text-lg font-medium">{session.user?.email}</p>
            </div>

            <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Role</p>
                <p className="text-lg font-medium">{session.user?.role}</p>
            </div>
            <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Phone</p>
                <p className="text-lg font-medium">
                    {session.user?.phone || "-"}
                </p>
            </div>
        </div>
        </Paper>
      </Container>
    </main>
  )
}