import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const {
    TIDB_HOST,
    TIDB_USER,
    TIDB_PASSWORD,
    TIDB_DATABASE,
    TIDB_PORT
  } = process.env;

  if (!TIDB_HOST || !TIDB_USER || !TIDB_PASSWORD || !TIDB_DATABASE) {
    return res.status(500).json({
      error:
        'Missing TiDB configuration. Add TIDB_HOST, TIDB_USER, TIDB_PASSWORD and TIDB_DATABASE in Vercel environment variables.'
    });
  }

  let connection;

  try {
    connection = await mysql.createConnection({
      host: TIDB_HOST,
      user: TIDB_USER,
      password: TIDB_PASSWORD,
      database: TIDB_DATABASE,
      port: Number(TIDB_PORT || 4000),
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      }
    });

    const [rows] = await connection.execute('SELECT * FROM produtos LIMIT 10');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
