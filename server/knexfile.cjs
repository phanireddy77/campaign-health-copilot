
import { env } from "./src/config/env";

module.exports = {
    development: {
        client: "pg",
        connection: {
            host: env.DATABASE_HOST,
            port: env.DATABASE_PORT,
            database: env.DATABASE_NAME,
            user: env.DATABASE_USER,
            password: env.DATABASE_PASSWORD,
        },
        migrations: {
            directory: "./migrations",
            extension: "cjs"
        },
        seeds: {
            directory: "./seeds",
            extension: "cjs"
        },  
        pool: {
            min: 2,
            max: 10,
        }
    }
};