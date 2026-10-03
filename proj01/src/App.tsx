import { useEffect, useState, type FormEvent } from 'react';

//cria um objeto de interface para definir a estrutura dos itens do banco de dados
interface TiDBItem {
  id: number;
  nome?: string;
  preco?: number;
}

//exporta o módulo app
export default function App() {
  //estados dos objetos exibidos em tela
  const [data, setData] = useState<TiDBItem[]>([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  
  //estados dos objetos editados em tela
  const [editingItem, setEditingItem] = useState<TiDBItem | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editPreco, setEditPreco] = useState('');

  //funcao para carregamento inicial dos dados do banco de dados
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

  //funcao para envio de novos dados do formulario para o banco de dados
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

  //funcao para exclusao de registros do banco de dados
  async function handleDelete(id: number): Promise<void> {
    try {
      const response = await fetch('/api/getter02', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Erro ao excluir item');
      }

      await loadData();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Erro ao excluir item');
    }
  }

  //funcao para abrir o modal de edicao
  function handleEdit(item: TiDBItem): void {
    setEditingItem(item);
    setEditNome(item.nome ?? '');
    setEditPreco(String(item.preco ?? ''));
  }

  //funcao para o salvamento das edicoes no banco de dados
  async function handleSaveEdit(): Promise<void> {
    if (!editingItem) {
      return;
    }

    const nomeTrim = editNome.trim();
    const precoNumber = Number(editPreco);

    if (!nomeTrim || Number.isNaN(precoNumber)) {
      alert('Preencha nome e preço válidos para edição.');
      return;
    }

    try {
      const response = await fetch('/api/getter02', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: editingItem.id,
          nome: nomeTrim,
          preco: precoNumber
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Erro ao atualizar item');
      }

      setEditingItem(null);
      setEditNome('');
      setEditPreco('');
      await loadData();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Erro ao atualizar item');
    }
  }

  //inteface renderizada
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
            <th style={{ border: '1px solid grey', borderCollapse: 'collapse' }}>Opções</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid grey', borderCollapse: 'collapse' }}>{item.nome || 'N/A'}</td>
              <td style={{ border: '1px solid grey', borderCollapse: 'collapse' }}>{item.preco !== undefined ? `R$ ${item.preco}` : 'N/A'}</td>
              <td style={{ border: '1px solid grey', borderCollapse: 'collapse', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              minWidth: '320px'
            }}
          >
            <h3>Editar item</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                value={editNome}
                onChange={(event) => setEditNome(event.target.value)}
                placeholder="Nome"
              />
              <input
                type="number"
                step="0.01"
                value={editPreco}
                onChange={(event) => setEditPreco(event.target.value)}
                placeholder="Preço"
              />
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingItem(null)}>Cancelar</button>
              <button onClick={handleSaveEdit}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}