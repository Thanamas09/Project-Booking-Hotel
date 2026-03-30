export default async function getHotels(token?: string) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${BACKEND_URL}/api/v1/hotels`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch hotels");
    }

    return await response.json();
}