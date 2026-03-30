export default async function userLogIn(userEmail: string, userPassword: string) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: userEmail,
            password: userPassword
        })
    });

    if (!res.ok) {
        return null;
    }

    return await res.json();
}