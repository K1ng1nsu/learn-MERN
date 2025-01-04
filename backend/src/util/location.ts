import { HttpError } from '../models/http-error';
import { config } from './config';
import axios from 'axios';

const API_KEY = config.GOOGLE_API_KEY;

interface GeocodingResult {
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

interface GeocodingResponse {
    results: GeocodingResult[];
    status: string;
}

async function getCoordsForAddress(address: string) {
    const response = await axios.get<GeocodingResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
    );

    const data = response.data;
    console.log(data);

    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new HttpError('Could not find location for the specified address.', 400);
        throw error;
    }

    const coordinates = data.results[0].geometry.location;

    return coordinates;
}

export default getCoordsForAddress;
