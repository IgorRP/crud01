import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const connection = await mysql.createConnection({
    host: TIDB_HOST,
    user: TIDB_USER,
    password: TIDB_PASSWORD,
    database: TIDB_DATABASE,
    port: TIDB_PORT || 4000,
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
