import Database from "better-sqlite3";
import path from "path";

const db = new Database(process.env.DB_URL);

db.pragma('journal_mode = WAL');

export default db;