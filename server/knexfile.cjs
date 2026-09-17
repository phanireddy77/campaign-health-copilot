module.exports = {
    client: "pg",
    connection: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 5432,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
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
};
