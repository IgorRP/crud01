import { useEffect, useState } from 'react';

interface TiDBItem {
  id: number;
  nome?: string;
  preco?: number;
}

export default function App() {
  const [data, setData] = useState<TiDBItem[]>([]);

  useEffect(() => {
    fetch('/api/getter02')
      .then((res) => res.json())
      .then((data: TiDBItem[]) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Dados do TiDB:</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.nome || JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}
