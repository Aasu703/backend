import app, { initGraphQL } from "./app";
import { PORT } from "./config";
import { connectdb } from "./database/mongodb";
import { EcommerceRepository } from "./repositories/ecommerceRepository";
import logger from "./config/logger";

async function startServer() {
    // 1. Connect to MongoDB database
    await connectdb();
    
    // 1.5. Auto-seed mock data if MongoDB is connected and empty
    const ecommerceRepo = new EcommerceRepository();
    await ecommerceRepo.seedMockDataIfNeeded();
    
    // 2. Start Apollo Server and attach middleware routing
    await initGraphQL();

    // 3. Begin listening for client requests
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`🚀 GraphQL Endpoint ready at http://localhost:${PORT}/graphql`);
        logger.info(`Server is running on port ${PORT}`);
    }); 
}

startServer();