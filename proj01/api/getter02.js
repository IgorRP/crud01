import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    port: process.env.TIDB_PORT || 4000,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });

  try {
    const [rows] = await connection.execute('SELECT * FROM produtos LIMIT 10');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    await connection.end();
  }

}
