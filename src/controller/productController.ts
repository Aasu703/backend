import { ProductService } from '../services/productServices';
import { ProductFilterInputDto } from '../dto/productDto';

const productService = new ProductService();

export const productResolvers = {
  Query: {
    products: async (_parent: any, args: { filter?: ProductFilterInputDto }) => {
      return await productService.getAllProducts(args.filter || {});
    },
    product: async (_parent: any, args: { id: string }) => {
      return await productService.getProductById(args.id);
    }
  }
};