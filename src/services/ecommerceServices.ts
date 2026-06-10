import { Buffer } from 'buffer';
import { EcommerceRepository } from '../repositories/ecommerceRepository';
import { UserDto, ProductConnectionDto, ProductEdgeDto, CartDto, CartItemDto } from '../dto/ecommerceDto';

export class EcommerceService {
  private ecommerceRepository = new EcommerceRepository();

  async getUsersList(): Promise<UserDto[]> {
    return await this.ecommerceRepository.findUsers();
  }

  async getUserById(id: string): Promise<UserDto | null> {
    return await this.ecommerceRepository.findUserById(id);
  }

  async getPaginatedProducts(first: number = 3, after?: string): Promise<ProductConnectionDto> {
    const products = await this.ecommerceRepository.findAllProducts();
    let startIndex = 0;

    if (after) {
      // Decode the cursor (base64 string) to product ID
      const decodedId = Buffer.from(after, 'base64').toString('ascii');
      const foundIndex = products.findIndex(p => p.id === decodedId);
      if (foundIndex !== -1) {
        startIndex = foundIndex + 1; // Begin selection immediately after the cursor
      }
    }

    const slicedProducts = products.slice(startIndex, startIndex + first);

    // Map item IDs to base64 cursors cleanly
    const edges: ProductEdgeDto[] = slicedProducts.map(product => ({
      cursor: Buffer.from(product.id).toString('base64'),
      node: product
    }));

    const hasNextPage = startIndex + first < products.length;
    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

    return {
      pageInfo: {
        hasNextPage,
        endCursor
      },
      edges,
      nodes: slicedProducts
    };
  }

  async getCartForUser(userId: string): Promise<CartDto | null> {
    const foundCart = await this.ecommerceRepository.findCartByUserId(userId);
    if (!foundCart) {
      return null;
    }

    // Hydrate the products inside cart items
    const items: CartItemDto[] = [];
    for (const item of foundCart.items) {
      const product = await this.ecommerceRepository.findProductById(item.productId);
      if (!product) {
        throw new Error(`Product not found with ID: ${item.productId}`);
      }
      items.push({
        product,
        quantity: item.quantity
      });
    }

    const totalPrice = items.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);

    return {
      id: foundCart.id,
      userId: foundCart.userId,
      items,
      totalPrice: parseFloat(totalPrice.toFixed(2))
    };
  }
}
