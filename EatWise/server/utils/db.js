import pg from "pg"; //lets Node.js talk to PostgreSQL
import dotenv from "dotenv"; //loads secret values from a .env file
import path from "path"; //just helpers to correctly locate your .env file.
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); //gives u the current files location
const __dirname = path.dirname(__filename); //the folder location (utils)

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // to tell node where env file from current folder(utils) look for ../.env

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
