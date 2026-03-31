export interface HotelItem {
    _id: string;
    name: string;
    address: string;
    district: string;
    province: string;
    postalcode: string;
    tel: string;
    region: string;
    rating: number;
    ratingCount: number;
}

export interface BookingItem {
    _id: string;
    checkinDate: string;
    checkoutDate: string;
    user: string | {
        _id?: string;
        name?: string;
        email?: string;
        phone?: string;
    };
    hotel: HotelItem;
    createdAt: string;
    rating?: number | null;
    comment?: string;
    isRated?: boolean;
    ratedAt?: string | null;
}
