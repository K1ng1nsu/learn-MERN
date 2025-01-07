export type PlaceType = {
    id: string;
    image: string;
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
