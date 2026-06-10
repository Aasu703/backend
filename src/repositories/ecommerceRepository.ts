import mongoose from 'mongoose';
import { isMockMode } from '../database/mongodb';
import { mockUsers, mockProducts, mockCarts } from '../data/seed';
import { UserModel } from '../models/userModel';
import { ProductModel } from '../models/productModel';
import { CartModel } from '../models/cartModel';
import { UserDto, ProductDto, MockCartDto } from '../dto/ecommerceDto';

export class EcommerceRepository {
  
  async seedMockDataIfNeeded(): Promise<void> {
    if (isMockMode) {
      console.log("ℹ️ Auto-seeding skipped: Running in Standalone Mock Mode.");
      return;
    }

    try {
      // 1. Auto-seed Products if collection is empty
      const productCount = await ProductModel.countDocuments();
      if (productCount === 0) {
        console.log("🌱 Auto-seeding: Seeding products into MongoDB...");
        await ProductModel.insertMany(
          mockProducts.map(p => ({
            _id: new mongoose.Types.ObjectId(p.id),
            name: p.name,
            title: p.title,
            description: p.description,
            price: p.price,
            stock: p.stock,
            category: p.category,
            createdAt: new Date(p.createdAt)
          }))
        );
      }

      // 2. Auto-seed Users if collection is empty
      const userCount = await UserModel.countDocuments();
      if (userCount === 0) {
        console.log("🌱 Auto-seeding: Seeding users into MongoDB...");
        await UserModel.insertMany(
          mockUsers.map(u => ({
            _id: new mongoose.Types.ObjectId(u.id),
            name: u.name,
            email: u.email,
            passwordHash: u.passwordHash
          }))
        );
      }

      // 3. Auto-seed Carts if collection is empty
      const cartCount = await CartModel.countDocuments();
      if (cartCount === 0) {
        console.log("🌱 Auto-seeding: Seeding carts into MongoDB...");
        await CartModel.insertMany(
          mockCarts.map(c => ({
            _id: new mongoose.Types.ObjectId(c.id),
            userId: c.userId,
            items: c.items.map(item => ({
              productId: new mongoose.Types.ObjectId(item.productId),
              quantity: item.quantity
            }))
          }))
        );
      }
    } catch (err) {
      console.error("⚠️ Failed to perform database auto-seeding:", err);
    }
  }

  async findUsers(): Promise<UserDto[]> {
    if (isMockMode) {
      return mockUsers.map(u => ({ id: u.id, name: u.name, email: u.email }));
    }

    const dbUsers = await UserModel.find({});
    return dbUsers.map(u => ({
      id: u._id.toString(),
      name: u.name || "",
      email: u.email
    }));
  }

  async findUserById(id: string): Promise<UserDto | null> {
    if (isMockMode) {
      const u = mockUsers.find(user => user.id === id);
      return u ? { id: u.id, name: u.name, email: u.email } : null;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const u = await UserModel.findById(id);
    if (!u) return null;
    return {
      id: u._id.toString(),
      name: u.name || "",
      email: u.email
    };
  }

  async findAllProducts(): Promise<ProductDto[]> {
    if (isMockMode) {
      return mockProducts;
    }

    const dbProducts = await ProductModel.find({});
    return dbProducts.map(p => ({
      id: p._id.toString(),
      title: p.title,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
      createdAt: p.createdAt.toISOString()
    }));
  }

  async findProductById(id: string): Promise<ProductDto | null> {
    if (isMockMode) {
      const p = mockProducts.find(product => product.id === id);
      return p || null;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const p = await ProductModel.findById(id);
    if (!p) return null;
    return {
      id: p._id.toString(),
      title: p.title,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
      createdAt: p.createdAt.toISOString()
    };
  }

  async findCartByUserId(userId: string): Promise<MockCartDto | null> {
    if (isMockMode) {
      const c = mockCarts.find(cart => cart.userId === userId);
      return c || null;
    }

    const c = await CartModel.findOne({ userId });
    if (!c) return null;
    return {
      id: c._id.toString(),
      userId: c.userId,
      items: c.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };
  }
}
