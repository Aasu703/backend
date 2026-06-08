import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const products = [
  {
    name: "iPhone 15",
    description: "Apple smartphone with powerful chip",
    price: 999,
    stock: 20,
    category: "Electronics",
    createdAt: new Date().toISOString(),
  },
  {
    name: "MacBook Air M3",
    description: "Lightweight laptop for students",
    price: 1299,
    stock: 10,
    category: "Computers",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB gaming keyboard",
    price: 79,
    stock: 50,
    category: "Accessories",
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("✅ Connected to MongoDB");

    // ⚠️ Uncomment when you have Product model
    // await Product.deleteMany({});
    // await Product.insertMany(products);

    console.log("🌱 Seed data ready (connect model to insert)");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();