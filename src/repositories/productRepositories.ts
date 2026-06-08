import { ProductModel, IProduct } from '../models/productModel';
import { ProductFilterInputDto } from '../dto/productDto';

export class ProductRepository {
  async findById(id: string): Promise<IProduct | null> {
    return await ProductModel.findById(id);
  }

  async findAll(filters: ProductFilterInputDto): Promise<IProduct[]> {
    const query: any = {};

    if (filters.category) {
      query.category = filters.category.toLowerCase();
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }

    return await ProductModel.find(query).sort({ createdAt: -1 });
  }
}