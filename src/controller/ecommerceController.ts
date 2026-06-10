import { EcommerceService } from '../services/ecommerceServices';

const ecommerceService = new EcommerceService();

export const ecommerceResolvers = {
  Query: {
    users: async () => {
      return await ecommerceService.getUsersList();
    },
    
    user: async (_: unknown, { id }: { id: string }) => {
      return await ecommerceService.getUserById(id);
    },
    
    allProducts: async (
      _: unknown, 
      { first = 3, after }: { first?: number; after?: string }
    ) => {
      return await ecommerceService.getPaginatedProducts(first, after);
    },
    
    cart: async (_: unknown, { userId }: { userId: string }) => {
      return await ecommerceService.getCartForUser(userId);
    }
  }
};
