export interface HotelItem {
    _id: string;
    name: string;
    address: string;
    district: string;
    province: string;
    postalcode: string;
    tel: string;
    region: string;
}

export interface BookingItem {
    _id: string;
    checkinDate: string;
    checkoutDate: string;
    user: string;
    hotel: HotelItem;
    createdAt: string;
}