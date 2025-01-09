import mongoose, { Document, Schema } from 'mongoose';
// @ts-ignore
import uniqueValidator from 'mongoose-unique-validator';
// mongoose 7에서만 지원하기 때문에 mongoose 8 -> 7 로 다운그레이드함
import { PlaceType } from './Place';

export interface UserType extends Document {
    name: string;
    email: string;
    password: string;
    image: string;
    places: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<UserType>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: { type: [Schema.Types.ObjectId], required: false, ref: 'Place' },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
