export default async function getAppointments(token: string) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${BACKEND_URL}/api/v1/appointments`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        cache: 'no-store' 
    });

    if (!response.ok) {
        throw new Error("Failed to fetch appointments");
    }

    return await response.json();
}