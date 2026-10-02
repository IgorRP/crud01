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
      <h2>Cadastro de novos itens</h2>

      <div style={{margin: "20px 0;"}}>
        <input type="text" id="nome" name="nome" placeholder="Digite o nome" style={{ minWidth: "300px" }} />
        <input type="number" id="preco" name="preco" placeholder="Digite o preço" step="0.01" />
        <button id="adicionar" >Adicionar</button>
    </div>

      <h2>Dados do Banco de Dados</h2>
      <table style={{ border: "1px solid grey", fontFamily: "sans-serif", borderCollapse: "collapse", minWidth: "600px" }}>
        <thead style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
          <tr>
            <th style={{ border: "1px solid grey", borderCollapse: "collapse" }}>Nome</th>
            <th style={{ border: "1px solid grey", borderCollapse: "collapse" }}>Preço</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td style={{ border: "1px solid grey", borderCollapse: "collapse" }}>{item.nome || 'N/A'}</td>
              <td style={{ border: "1px solid grey", borderCollapse: "collapse" }}>{item.preco ? `R$ ${item.preco}` : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
}