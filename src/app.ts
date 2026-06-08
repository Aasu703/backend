import express, { Application } from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { readFileSync } from "fs";
import { join } from "path";
import { resolvers } from "./controller/authController";
import { buildContext } from "./middleware/authMiddleware";
import { GraphQLContext } from "./dto/authDto";

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

// Initialize and hook up Apollo Server to Express
const typeDefs = readFileSync(join(__dirname, "routes", "schema.graphql"), "utf-8");
const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

export async function initGraphQL() {
  await server.start();
  // GraphQL will listen on http://localhost:PORT/graphql
  app.use("/graphql", expressMiddleware(server, { context: buildContext }));
}

export default app;