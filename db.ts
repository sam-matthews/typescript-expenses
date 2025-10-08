const Database = require('better-sqlite3') as typeof import('better-sqlite3');
type DatabaseType = import('better-sqlite3').Database;

export type Expense = {
  id?: number;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
};

const DB_PATH = 'expenses.db';
let db: import('better-sqlite3').Database | null = null;

function openDb(path = DB_PATH) {
  if (!db) db = new Database(path);
  return db;
}

function init() {
  const d = openDb();
  d.prepare(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL
    )
  `).run();

    d.prepare(`
    CREATE TABLE IF NOT EXISTS meta 
    (
      key TEXT PRIMARY KEY, 
      value TEXT
    )
  `).run();

}

function getAllExpenses() {
  const d = openDb();

  const select_stmt = `
    SELECT id, description, printf('%.2f', amount) AS Amount, date
    FROM expenses
    ORDER BY date DESC, id DESC
  `;
  return d.prepare(select_stmt).all() as Expense[];

}

function tableExists(db: DatabaseType, tableName: string): boolean {
  const all_tabs = db.prepare(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
  ).get(tableName);

  return !!all_tabs;
}

function insertExpense(e: Expense) {
  const d = openDb();
  const stmt = d.prepare('INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)');
  const info = stmt.run(e.description, e.amount, e.date);
  return info.lastInsertRowid as number;
}

function close() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  init,
  getAllExpenses,
  insertExpense,
  close,
};
