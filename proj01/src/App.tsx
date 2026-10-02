import { useEffect, useState, type FormEvent } from 'react';

interface TiDBItem {
  id: number;
  nome?: string;
  preco?: number;
}

export default function App() {
  const [data, setData] = useState<TiDBItem[]>([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');

  const loadData = async () => {
    const response = await fetch('/api/getter02');

    if (!response.ok) {
      throw new Error('Erro ao carregar os dados');
    }

    const result: TiDBItem[] = await response.json();
    setData(result);
  };

  useEffect(() => {
    loadData().catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nomeTrim = nome.trim();
    const precoNumber = Number(preco);

    if (!nomeTrim || Number.isNaN(precoNumber)) {
      alert('Preencha nome e preço válidos.');
      return;
    }

    try {
      const response = await fetch('/api/getter02', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nomeTrim, preco: precoNumber })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Erro ao cadastrar item');
      }

      setNome('');
      setPreco('');
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Erro ao cadastrar item');
    }
  };

  return (
    <div>
      <h2>Cadastro de novos itens</h2>

      <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
        <input
          type="text"
          id="nome"
          name="nome"
          placeholder="Digite o nome"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          style={{ minWidth: '300px', margin: '5px 0' }}
        />
        <input
          type="number"
          id="preco"
          name="preco"
          placeholder="Digite o preço"
          step="0.01"
          value={preco}
          onChange={(event) => setPreco(event.target.value)}
          style={{ margin: '5px 0' }}
        />
        <button type="submit" id="adicionar">
          Adicionar
        </button>
      </form>

      <h2>Dados do Banco de Dados</h2>
      <table style={{ border: '1px solid grey', fontFamily: 'sans-serif', borderCollapse: 'collapse', minWidth: '600px' }}>
        <thead style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
          <tr>
            <th style={{ border: '1px solid grey', borderCollapse: 'collapse' }}>Nome</th>
            <th style={{ border: '1px solid grey', borderCollapse: 'collapse' }}>Preço</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid grey', borderCollapse: 'collapse' }}>{item.nome || 'N/A'}</td>
              <td style={{ border: '1px solid grey', borderCollapse: 'collapse' }}>{item.preco !== undefined ? `R$ ${item.preco}` : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}