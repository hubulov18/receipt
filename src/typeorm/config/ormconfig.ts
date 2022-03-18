export default [
    {
        name: 'default',
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
    },
    {
        name: 'test',
        type: "postgres",
        host: process.env.TEST_DB_HOST || "localhost",
        port: Number(process.env.TEST_DB_PORT) || 5432,
        username: process.env.TEST_DB_USER || "test_receipt_checker",
        password: process.env.TEST_DB_PASSWORD || "test_receipt_checker",
        database: process.env.TEST_DB_NAME || "test_receipt_checker",
        synchronize: true,
        migrationsTableName: "migrations",
        seeds: ["src/typeorm/seeding/seeds/**/*{.ts,.js}"],
        factories: ["src/typeorm/seeding/factories/**/*{.ts,.js}"],
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
]