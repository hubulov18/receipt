import { Good, Receipt, User } from "../models";
import { ConnectionOptions } from "typeorm";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const databaseConfig: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "receipt-db",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "postgres",
  synchronize: true,
  migrationsTableName: "migrations",
  entities: ["src/models/**/*.ts"],
  migrations: ["src/typeorm/migrations/**/*.ts"],
  // "subscribers": [
  //   "src/subscribers/**/*.ts"
  // ],
  cli: {
    entitiesDir: "src/models",
    migrationsDir: "src/typeorm/migrations"
    // "subscribersDir": "src/subscribers"
  }
};

export const testDatabaseConfig: ConnectionOptions = {
  type: "postgres",
  host: process.env.TEST_DB_HOST || "localhost",
  port: Number(process.env.TEST_DB_PORT) || 5432,
  username: process.env.TEST_DB_USER || "test_receipt_checker",
  password: process.env.TEST_DB_PASSWORD || "test_receipt_checker",
  database: process.env.TEST_DB_NAME || "test_receipt_checker",
  synchronize: true,
  migrationsTableName: "migrations",
  entities: ["src/models/**/*.ts"],
  migrations: ["src/typeorm/migrations/**/*.ts"],
  // "subscribers": [
  //   "src/subscribers/**/*.ts"
  // ],
  cli: {
    entitiesDir: "src/models",
    migrationsDir: "src/typeorm/migrations"
    // "subscribersDir": "src/subscribers"
  }
}

export const appConfig = {
  env: process.env.NODE_ENV as string,
  url: process.env.APP_URL as string,
  port: (process.env.APP_PORT || 3000) as number,
  webhookPath: process.env.WEBHOOK_PATH || ("" as string),
  token: process.env.BOT_TOKEN as string,
  tgApiUrl: process.env.TG_API_URL as string,
  rootPath: path.join(__dirname, "../../"),
  uploadsPath: path.join(__dirname, "../../uploads")
};

export const cronConfig = {
  jobs: {
    updateQrJob: {
      time: "55 3 1/* * *"
    }
  }
};

export const fnsConfig = {
  url: process.env.FNS_URL
};
