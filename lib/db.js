import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'beeo7211',
    database: 'nextjs_users_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

export async function query(sql, values) {
    const [rows] = await pool.execute(sql, values);
    return rows;
}