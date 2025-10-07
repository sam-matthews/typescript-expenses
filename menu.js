"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbModule = require('./db');
const readline = require('readline');
dbModule.init();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function prompt(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}
function showAll() {
    const rows = dbModule.getAllExpenses();
    if (rows.length === 0) {
        console.log('No records found.');
        return;
    }
    console.table(rows);
}
async function addRecord() {
    const description = (await prompt('Description: ')).trim();
    const amountStr = (await prompt('Amount: ')).trim();
    const date = (await prompt('Date (YYYY-MM-DD) [today]: ')).trim() || new Date().toISOString().slice(0, 10);
    const amount = Number(amountStr);
    // If there is no decription
    if (!description) {
        console.log('Description is required.');
        return;
    }
    // If there is no Number.
    if (Number.isNaN(amount)) {
        console.log('Amount must be a number.');
        return;
    }
    const id = dbModule.insertExpense({ description, amount, date });
    console.log(`Inserted row id=${id}`);
}
async function mainMenu() {
    while (true) {
        console.log('\n--- Expenses Menu ---');
        console.log('1) Show all records');
        console.log('2) Add record');
        console.log('3) Exit');
        const choice = (await prompt('Choose an option: ')).trim();
        if (choice === '1') {
            showAll();
        }
        else if (choice === '2') {
            await addRecord();
        }
        else if (choice === '3' || choice.toLowerCase() === 'q' || choice.toLowerCase() === 'exit') {
            break;
        }
        else {
            console.log('Unknown option.');
        }
    }
    rl.close();
    dbModule.close();
}
mainMenu().catch((err) => {
    console.error('Unexpected error:', err);
    rl.close();
    dbModule.close();
    process.exit(1);
});
