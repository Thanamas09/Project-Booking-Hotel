import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userLogIn from "@/libs/userLogIn";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
              if(!credentials){
                return null;
              }
              const authResponse = await userLogIn(credentials.email, credentials.password);
              
              if (authResponse && authResponse.token) {
                  const userRes = await fetch("http://localhost:5000/api/v1/auth/me", {
                      method: "GET",
                      headers: { Authorization: `Bearer ${authResponse.token}` }
                  });
                  const userData = await userRes.json();
                  console.log(userData)
                  return {
                      id: userData.data._id,
                      name: userData.data.name,
                      email: userData.data.email,
                      token: authResponse.token,
                      role: userData.data.role,
                      phone: userData.data.phone
                  } as any;
              }
              return null;
          }
        })
    ],
    session: { 
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
                token.token = user.token;
                token.phone = user.phone;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
                session.user.token = token.token as string;
                session.user.phone = token.phone as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
};