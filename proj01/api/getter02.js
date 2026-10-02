import mysql from 'mysql2/promise';

const getConnectionConfig = () => {
  const {
    TIDB_HOST,
    TIDB_USER,
    TIDB_PASSWORD,
    TIDB_DATABASE,
    TIDB_PORT
  } = process.env;

  if (!TIDB_HOST || !TIDB_USER || !TIDB_PASSWORD || !TIDB_DATABASE) {
    throw new Error(
      'Missing TiDB configuration. Add TIDB_HOST, TIDB_USER, TIDB_PASSWORD and TIDB_DATABASE in Vercel environment variables.'
    );
  }

  return {
    host: TIDB_HOST,
    user: TIDB_USER,
    password: TIDB_PASSWORD,
    database: TIDB_DATABASE,
    port: Number(TIDB_PORT || 4000),
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  };
};

export default async function handler(req, res) {
  let connection;

  try {
    const config = getConnectionConfig();
    connection = await mysql.createConnection(config);

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
      const nome = String(body.nome ?? '').trim();
      const preco = Number(body.preco);

      if (!nome || Number.isNaN(preco)) {
        return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
      }

      const [result] = await connection.execute(
        'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
        [nome, preco]
      );

      return res.status(201).json({
        id: result.insertId,
        nome,
        preco
      });
    }

    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
      const id = Number(body.id);
      const nome = String(body.nome ?? '').trim();
      const preco = Number(body.preco);

      if (!Number.isInteger(id) || id <= 0 || !nome || Number.isNaN(preco)) {
        return res.status(400).json({ error: 'ID, nome e preço são obrigatórios.' });
      }

      await connection.execute('UPDATE produtos SET nome = ?, preco = ? WHERE id = ?', [nome, preco, id]);
      return res.status(200).json({ id, nome, preco, message: 'Item atualizado com sucesso.' });
    }

    if (req.method === 'DELETE') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
      const id = Number(body.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      await connection.execute('DELETE FROM produtos WHERE id = ?', [id]);
      return res.status(200).json({ message: 'Item excluído com sucesso.' });
    }

    const [rows] = await connection.execute('SELECT * FROM produtos ORDER BY id DESC LIMIT 10');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
