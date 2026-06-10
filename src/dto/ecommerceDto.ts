export interface UserDto {
  id: string;
  name: string;
  email: string;
}

export interface ProductDto {
  id: string;
  title: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
}

export interface MockCartItemDto {
  productId: string;
  quantity: number;
}

export interface MockCartDto {
  id: string;
  userId: string;
  items: MockCartItemDto[];
}

export interface CartItemDto {
  product: ProductDto;
  quantity: number;
}

export interface CartDto {
  id: string;
  userId: string;
  items: CartItemDto[];
  totalPrice: number;
}

export interface PageInfoDto {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ProductEdgeDto {
  cursor: string;
  node: ProductDto;
}

export interface ProductConnectionDto {
  pageInfo: PageInfoDto;
  edges: ProductEdgeDto[];
  nodes: ProductDto[];
}
