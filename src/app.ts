import "reflect-metadata";
import { ConnectionOptions, createConnection } from "typeorm";
import { appConfig, databaseConfig, testDatabaseConfig } from "./config";
import Bot from "./bot";
import Server from "./server";
/**
 * Application entrypoint
 * @param dbConfig
 */
const main = async (dbConfig: ConnectionOptions) => {
  await createConnection(dbConfig); // connect to database
  await Promise.all([new Bot(appConfig.token).start(), new Server().start()]); // start bot && api
};

// Run application
main(databaseConfig)
  .then(() => console.log("Application started!"))
  .catch((err) => {
    console.log("Error on start application!", err);
    process.exit(1);
  });
