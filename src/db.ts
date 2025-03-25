import { Pool } from "pg";

export const pool = new Pool({
    host: "db",
    database: "rsvp-db",
    user: "postgres",
    password: "password",
    port: 5432
});