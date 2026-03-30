export default async function getHotel(id: string) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${BACKEND_URL}/api/v1/hotels/${id}`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error("Failed to fetch hotel detail");
    }

    return await response.json();
}