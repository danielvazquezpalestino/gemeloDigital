import mysql = require('mysql2/promise');
import envs = require('./envs.ts/');

const pool = mysql.createPool({
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    user: envs.DB_USER,
    password: envs.DB_PASSWORD ?? '',
    database: envs.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export = pool;
