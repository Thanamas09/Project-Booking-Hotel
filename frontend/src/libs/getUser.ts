export default async function getUser(token: string) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    return await res.json();
}