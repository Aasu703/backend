import mongoose from "mongoose";
import dotenv from "dotenv";
import { ProductModel } from "../models/productModel";
import { UserModel } from "../models/userModel";
import { CartModel } from "../models/cartModel";

dotenv.config();

// ==========================================
// SEED DATA EXPORTS FOR STANDALONE FALLBACK
// ==========================================
export const mockUsers = [
  { id: "777777777777777777770001", name: "Aayush", email: "aayush@bloc.dev", passwordHash: "$2a$10$Y1/n812Z7.F/f.p95qWk6eP0.oB8q/hK8bO.K87Lszx03BqD5j/K." },
  { id: "777777777777777777770002", name: "Flutter Dev", email: "senior@flutter.io", passwordHash: "$2a$10$Y1/n812Z7.F/f.p95qWk6eP0.oB8q/hK8bO.K87Lszx03BqD5j/K." }
];

export const mockProducts = [
  { id: "666666666666666666660001", title: "Wireless Mechanical Keyboard", name: "Wireless Mechanical Keyboard", description: "Premium tactile keyboard.", price: 89.99, category: "Electronics", stock: 15, createdAt: new Date("2026-01-01").toISOString() },
  { id: "666666666666666666660002", title: "Ergonomic Wireless Mouse", name: "Ergonomic Wireless Mouse", description: "Ergonomic mouse.", price: 49.50, category: "Electronics", stock: 30, createdAt: new Date("2026-01-02").toISOString() },
  { id: "666666666666666666660003", title: "UltraWide 34-inch Monitor", name: "UltraWide 34-inch Monitor", description: "34-inch curved monitor.", price: 349.99, category: "Electronics", stock: 10, createdAt: new Date("2026-01-03").toISOString() },
  { id: "666666666666666666660004", title: "Noise Cancelling Headphones", name: "Noise Cancelling Headphones", description: "ANC wireless headphones.", price: 199.99, category: "Electronics", stock: 12, createdAt: new Date("2026-01-04").toISOString() },
  { id: "666666666666666666660005", title: "Full-Grain Leather Wallet", name: "Full-Grain Leather Wallet", description: "Genuine leather wallet.", price: 35.00, category: "Accessories", stock: 50, createdAt: new Date("2026-01-05").toISOString() },
  { id: "666666666666666666660006", title: "Minimalist Laptop Backpack", name: "Minimalist Laptop Backpack", description: "Sleek travel backpack.", price: 75.00, category: "Accessories", stock: 20, createdAt: new Date("2026-01-06").toISOString() },
  { id: "666666666666666666660007", title: "Hydro Stainless Water Bottle", name: "Hydro Stainless Water Bottle", description: "Insulated water bottle.", price: 28.00, category: "Fitness", stock: 40, createdAt: new Date("2026-01-07").toISOString() },
  { id: "666666666666666666660008", title: "Adjustable Aluminum Laptop Stand", name: "Adjustable Aluminum Laptop Stand", description: "Folding laptop stand.", price: 39.99, category: "Office Supplies", stock: 15, createdAt: new Date("2026-01-08").toISOString() },
  { id: "666666666666666666660009", title: "Smart RGB Desk Ambient Light", name: "Smart RGB Desk Ambient Light", description: "App controlled desk light.", price: 45.00, category: "Electronics", stock: 25, createdAt: new Date("2026-01-09").toISOString() },
  { id: "666666666666666666660010", title: "Premium Desk Felt Pad", name: "Premium Desk Felt Pad", description: "Large desk protection pad.", price: 29.99, category: "Office Supplies", stock: 35, createdAt: new Date("2026-01-10").toISOString() },
  { id: "666666666666666666660011", title: "Bamboo Charging Dock Station", name: "Bamboo Charging Dock Station", description: "Multi-device bamboo dock.", price: 22.50, category: "Accessories", stock: 18, createdAt: new Date("2026-01-11").toISOString() },
  { id: "666666666666666666660012", title: "Memory Foam Lumbar Support Pillow", name: "Memory Foam Lumbar Support Pillow", description: "Office chair support cushion.", price: 42.00, category: "Office Supplies", stock: 22, createdAt: new Date("2026-01-12").toISOString() },
];

export const mockCarts = [
  {
    id: "888888888888888888880001",
    userId: "777777777777777777770001",
    items: [
      { productId: "666666666666666666660001", quantity: 1 },
      { productId: "666666666666666666660002", quantity: 2 }
    ]
  }
];

// ==========================================
// DB SEED SCRIPT RUNNER
// ==========================================
async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/graphql_auth_db";
    await mongoose.connect(mongoUri);

    console.log("✅ Seeding: Connected to MongoDB");

    // Clear existing collections
    await ProductModel.deleteMany({});
    await UserModel.deleteMany({});
    await CartModel.deleteMany({});

    // Seed Products
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

    // Seed Users
    await UserModel.insertMany(
      mockUsers.map(u => ({
        _id: new mongoose.Types.ObjectId(u.id),
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash
      }))
    );

    // Seed Carts
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

    console.log("✅ E-commerce seed data populated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

// Run seed runner if file executed directly
if (require.main === module) {
  seed();
}