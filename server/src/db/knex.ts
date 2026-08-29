import knex from "knex";

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
    },
    pool: { min: 0, max: 7 }
});

export default db;