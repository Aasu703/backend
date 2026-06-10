import { Schema, model, Document } from 'mongoose';

export interface ICartItem {
  productId: string;
  quantity: number;
}

export interface ICart extends Document {
  id: string;
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const CartModel = model<ICart>('Cart', cartSchema);
