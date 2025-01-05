import mongoose, { Document, Schema } from 'mongoose';

interface Product extends Document {
    name: string;
    price: number;
}

const productSchema = new Schema<Product>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
});

export default mongoose.model('Product', productSchema);
