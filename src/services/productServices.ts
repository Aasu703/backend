import { ProductRepository } from '../repositories/productRepositories';
import { ProductFilterInputDto, ProductResponseDto, ProductFilterSchema } from '../dto/productDto';
import { AppError } from '../error/errorHandlers';

export class ProductService {
  private productRepository = new ProductRepository();

  private mapToResponse(product: any): ProductResponseDto {
    return {
      id: product.id || product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      createdAt: product.createdAt.toISOString(),
    };
  }

  async getProductById(id: string): Promise<ProductResponseDto> {
    if (!id) {
      throw new AppError('Product ID parameter is required', 'VALIDATION_ERROR');
    }
    
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 'NOT_FOUND');
    }

    return this.mapToResponse(product);
  }

  async getAllProducts(filters: ProductFilterInputDto): Promise<ProductResponseDto[]> {
    // Run Zod parsing over incoming query options
    const validation = ProductFilterSchema.safeParse(filters);
    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const products = await this.productRepository.findAll(validation.data);
    return products.map(product => this.mapToResponse(product));
  }
}