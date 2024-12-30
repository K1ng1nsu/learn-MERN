import React from 'react';
import PlaceList from '../components/PlaceList';
import { PlaceType } from '../PlacesType';
import { useParams } from 'react-router-dom';

type Props = {};

const DUMMY_PLACES: Array<PlaceType> = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of most famous sky scrapers in the world!',
        imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipMnGg2AimiTgzaRgCWzYudpdA2Wen7AFk65YVrH=s680-w680-h510',
        address: '20 W 34th St., New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9856644,
        },
        creator: 'u1',
    },
    {
        id: 'p2',
        title: 'Emp. State Building',
        description: 'One of most famous sky scrapers in the world!',
        imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipMnGg2AimiTgzaRgCWzYudpdA2Wen7AFk65YVrH=s680-w680-h510',
        address: '20 W 34th St., New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9856644,
        },
        creator: 'u2',
    },
];

const UserPlaces = (props: Props) => {
    const userId = useParams().userId;

    const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);

    return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
