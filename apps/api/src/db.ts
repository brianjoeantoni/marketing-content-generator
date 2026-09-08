import pg from "pg"

const { Pool } = pg


// env contains: 
// database user
//database password
//host
// port
// database name
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

const pool = new Pool({
  connectionString,
})

export { pool }