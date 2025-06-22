import winston from "winston";
import app from "./src/app";
import envConfig from "./src/config/config";
import adminSeeder from "./adminSeeder";
require ("dotenv").config()


function startServer(){
    const PORT = process.env.PORT || 10000

    const logger = winston.createLogger({
        level : "info",
        format : winston.format.json(),
        transports:[
            new winston.transports.Console()
        ]
    })
    const server = app.listen(PORT, ()=>{
        logger.info(`Server running at ${PORT}`)
        // adminSeeder()
    })
   process.on('SIGTERM', () => {
        logger.info('signal received: closing HTTP server');
        server.close(() => {
            logger.info('HTTP server closed');
        });
    });
}
startServer();
