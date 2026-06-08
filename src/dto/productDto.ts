import { z } from 'zod';

// Input Filter Validation Schema
export const ProductFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
});

export type ProductFilterInputDto = z.infer<typeof ProductFilterSchema>;

// Exact structure the GraphQL layer expects to receive
export interface ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
}