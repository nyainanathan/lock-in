import Database from "better-sqlite3";
import path from "path";
import fs from 'fs'
const dbPath = process.env.DB_URL
  ?? path.join(process.cwd(), 'database.sqlite');

const db = new Database(dbPath);

const dbDir = path.dirname(dbPath);
fs.mkdirSync(dbDir, { recursive: true });

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

    CREATE TABLE IF NOT EXISTS chronos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        project_id INTEGER,
        status TEXT DEFAULT 'running',
        total_focus_time INTEGER DEFAULT 0,
        stopped_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (project_id) REFERENCES projects(id)
    );
`);

export default db;