import app from './app'
import mongoose from 'mongoose'
import env from './util/validateEnv'
import Logger from "./lib/logger";
import {errorHandler} from "./error-handler/errorHandler";

const port = env.PORT
const MongoDB = env.MONGO_CONNECTION_STRING

//handle mongodb
async function connectToDatabase(url: string ): Promise<void> {
    try {
        if (!url) Logger.error('MongoDB url not specified');

            await mongoose.connect(url, {
                  dbName: 'shop-database',
            });
            Logger.info('Mongoose connected');
    } catch (error) {
        Logger.error(error);
        throw error;
    }
}
app.use(errorHandler);
function startServer(port: number): void {
    const server = app.listen(port, () => {
        Logger.debug(`Server is up and running @ http://localhost:${port}`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
        server.close(() => {
            Logger.info('Server closed');
            process.exit(0);
        });
    });
}

async function initialize(): Promise<void> {
    try {
        await connectToDatabase(MongoDB);
        startServer(port);
    } catch (error) {
        Logger.error(error);
        process.exit(1);
    }
}

initialize().catch((error: Error) => {
    Logger.error(error);
    process.exit(1);
});



