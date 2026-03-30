import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            _id: string
            id: string
            name: string
            email: string
            role: string
            token: string
            phone: string
        } & DefaultSession["user"]
    }

    interface User {
        _id: string
        id: string
        name: string
        email: string
        role: string
        token: string
        phone: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string
        id: string
        name: string
        email: string
        role: string
        token: string
        phone: string
    }
}