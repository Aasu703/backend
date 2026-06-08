import express, { Application } from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import { join } from "path";
import { buildContext } from "./middleware/authMiddleware";
import { GraphQLContext } from "./dto/authDto";

// Core Controllers / Resolvers
import { resolvers as authResolvers } from "./controller/authController";
import { productResolvers } from "./controller/productController";

// ⚠️ FIX: Import from the standalone integration package instead of apollo subpaths!
const { expressMiddleware } = require("@as-integrations/express4");

const app: Application = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3003"
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Combine Auth operations and Product data retrieval routines
const mergedResolvers = {
  Query: {
    ...authResolvers.Query,
    ...productResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  }
};

// Initialize Apollo Server
const typeDefs = readFileSync(join(__dirname, "routes", "schema.graphql"), "utf-8");
const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers: mergedResolvers,
});

export async function initGraphQL() {
  await server.start();
  
  // Attach using the cleanly imported standalone middleware
  app.use(
    "/graphql", 
    expressMiddleware(server, { context: buildContext })
  );
}

export default app;