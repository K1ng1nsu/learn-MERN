export type PlaceType = {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    address: string;
    creator: string;
    location: CoordinateType;
};

export type CoordinateType = {
    lat: number;
    lng: number;
};
