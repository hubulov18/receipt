"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fnsConfig = exports.cronConfig = exports.appConfig = exports.testDatabaseConfig = exports.databaseConfig = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.databaseConfig = {
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
exports.testDatabaseConfig = {
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
};
exports.appConfig = {
    env: process.env.NODE_ENV,
    url: process.env.APP_URL,
    port: (process.env.APP_PORT || 3000),
    webhookPath: process.env.WEBHOOK_PATH || "",
    token: process.env.BOT_TOKEN,
    tgApiUrl: process.env.TG_API_URL,
    rootPath: path_1.default.join(__dirname, "../../"),
    uploadsPath: path_1.default.join(__dirname, "../../uploads")
};
exports.cronConfig = {
    jobs: {
        updateQrJob: {
            time: "55 3 1/* * *"
        }
    }
};
exports.fnsConfig = {
    url: process.env.FNS_URL
};
