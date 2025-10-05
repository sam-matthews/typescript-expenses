"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database = require('better-sqlite3');
const DB_PATH = 'expenses.db';
let db = null;
function openDb(path = DB_PATH) {
    if (!db)
        db = new Database(path);
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
}
function getAllExpenses() {
    const d = openDb();
    return d.prepare('SELECT id, description, amount, date FROM expenses ORDER BY date DESC, id DESC').all();
}
function insertExpense(e) {
    const d = openDb();
    const stmt = d.prepare('INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)');
    const info = stmt.run(e.description, e.amount, e.date);
    return info.lastInsertRowid;
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
