import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export let isMockMode = false;

export async function connectdb() {
    try {   
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.warn("⚠️ Failed to connect to MongoDB. Falling back to Standalone Mock Mode using in-memory mock data!");
        isMockMode = true;
    }
}

export async function connectdbTest() {
    try {
        await mongoose.connect(MONGO_URI + "_test");
        console.log("Connected to MongoDB Test Database");
    } catch (err) {
        console.error("Failed to connect to MongoDB Test Database", err);
        process.exit(1);
    }
}

