import app, { initGraphQL } from "./app";
import { PORT } from "./config";
import { connectdb } from "./database/mongodb";

async function startServer() {
    await connectdb();
    
    // Ensure the GraphQL middleware layer is ready before starting the engine
    await initGraphQL();

    app.listen(PORT, () => {
        console.log(` Server is running on port ${PORT}`);
        console.log(` GraphQL Endpoint ready at http://localhost:${PORT}/graphql`);
    }); 
}

startServer();