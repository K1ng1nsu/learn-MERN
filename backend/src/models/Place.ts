import mongoose, { Document, Schema } from 'mongoose';
import { UserType } from './User';

interface Location {
    lat: number;
    lng: number;
}

export interface PlaceType extends Document {
    title: string;
    description: string;
    image: string;
    address: string;
    location: Location;
    creator: mongoose.Types.ObjectId;
}

const placeSchema = new Schema<PlaceType>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    creator: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

export default mongoose.model('Place', placeSchema);
