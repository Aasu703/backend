import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

export const ProductModel = model<IProduct>('Product', productSchema);