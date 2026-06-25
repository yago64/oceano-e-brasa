import React, { useState } from "react";
import { pratos } from "./dados";

export default function App() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [carrinho, setCarrinho] = useState({});

  const adicionarAoCarrinho = (id) => {
    setCarrinho((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const removerDoCarrinho = (id) => {
    setCarrinho((prev) => {
      const novoCarrinho = { ...prev };
      if (novoCarrinho[id] > 1) {
        novoCarrinho[id] -= 1;
      } else {
        delete novoCarrinho[id];
      }
      return novoCarrinho;
    });
  };

  const pratosFiltrados = pratos.filter((prato) => {
    const bateuCategoria = categoriaAtiva === "Todos" || prato.categoria === categoriaAtiva;
    const bateuBusca = prato.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       prato.descricao.toLowerCase().includes(busca.toLowerCase());
    return bateuCategoria && bateuBusca;
  });

  const totalItens = Object.values(carrinho).reduce((a, b) => a + b, 0);
  
  const valorTotal = pratos.reduce((total, prato) => {
    const qtd = carrinho[prato.id] || 0;
    return total + qtd * prato.preco;
  }, 0);

  return (
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#020617", color: "#f8fafc", minHeight: "100vh", paddingBottom: "40px" }}>
      
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #1e293b", backgroundColor: "#0f172a", sticky: "top" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* Ícone de Onda em SVG - Customizado com a cor do tema */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#f59e0b" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ width: "40px", height: "40px" }}
          >
            <path d="M2 6c.6 0 1.2.2 1.6.6L6.2 9.2c.8.8 2 .8 2.8 0l2.6-2.6c.8-.8 2-.8 2.8 0l2.6 2.6c.8.8 2 .8 2.8 0l2.6-2.6c.4-.4 1-.6 1.6-.6" />
            <path d="M2 12c.6 0 1.2.2 1.6.6l2.6 2.6c.8.8 2 .8 2.8 0l2.6-2.6c.8-.8 2-.8 2.8 0l2.6 2.6c.8.8 2 .8 2.8 0l2.6-2.6c.4-.4 1-.6 1.6-.6" />
            <path d="M2 18c.6 0 1.2.2 1.6.6l2.6 2.6c.8.8 2 .8 2.8 0l2.6-2.6c.8-.8 2-.8 2.8 0l2.6 2.6c.8.8 2 .8 2.8 0l2.6-2.6c.4-.4 1-.6 1.6-.6" />
          </svg>
          <h1 style={{ color: "#f59e0b", margin: 0, fontSize: "1.8rem" }}>Oceano & Brasa</h1>
        </div>
        
        <button 
          onClick={() => setCarrinhoAberto(true)}
          style={{ backgroundColor: "#f59e0b", color: "#020617", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
        >
          🛒 Meu Pedido 
          {totalItens > 0 && (
            <span style={{ backgroundColor: "#020617", color: "#f59e0b", borderRadius: "50%", padding: "2px 8px", fontSize: "0.85rem" }}>
              {totalItens}
            </span>
          )}
        </button>
      </header>

      <div style={{ maxWidth: "1200px", margin: "30px auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        <input
          type="text"
          placeholder="Buscar por nome ou ingredientes..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#f8fafc", fontSize: "1rem" }}
        />

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["Todos", "Entradas", "Pratos Principais", "Bebidas"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              style={{
                padding: "10px 20px",
                borderRadius: "20px",
                border: "1px solid #334155",
                backgroundColor: categoriaAtiva === cat ? "#f59e0b" : "#1e293b",
                color: categoriaAtiva === cat ? "#020617" : "#f8fafc",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "0.2s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
        {pratosFiltrados.map((prato) => {
          const qtdNoCarrinho = carrinho[prato.id] || 0;
          const isEsgotado = prato.status === "Esgotado";

          return (
            <div key={prato.id} style={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #1e293b", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: isEsgotado ? 0.6 : 1 }}>
              
              <div style={{ position: "relative" }}>
                <img src={prato.imagem} alt={prato.nome} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: isEsgotado ? "#ef4444" : "#10b981", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>
                  {prato.status}
                </span>
              </div>

              <div style={{ padding: "20px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "1.25rem", color: "#f8fafc" }}>{prato.nome}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 15px 0", minHeight: "40px" }}>{prato.descricao}</p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                  <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#f59e0b" }}>
                    R$ {prato.preco.toFixed(2)}
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#1e293b", padding: "5px 12px", borderRadius: "20px" }}>
                    <button 
                      onClick={() => removerDoCarrinho(prato.id)}
                      disabled={qtdNoCarrinho === 0 || isEsgotado}
                      style={{ background: "none", border: "none", color: qtdNoCarrinho === 0 ? "#475569" : "#f59e0b", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: "bold", width: "15px", textAlign: "center" }}>{qtdNoCarrinho}</span>
                    <button 
                      onClick={() => adicionarAoCarrinho(prato.id)}
                      disabled={isEsgotado}
                      style={{ background: "none", border: "none", color: isEsgotado ? "#475569" : "#f59e0b", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </main>

      {carrinhoAberto && (
        <div style={{ position: "fixed", top: 0, right: 0, width: "380px", height: "100vh", backgroundColor: "#0f172a", borderLeft: "1px solid #1e293b", boxShadow: "-10px 0 30px rgba(0,0,0,0.5)", zIndex: 1000, padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <h2 style={{ margin: 0, color: "#f59e0b" }}>Meu Pedido</h2>
              <button onClick={() => setCarrinhoAberto(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", maxHeight: "60vh" }}>
              {pratos.filter(p => carrinho[p.id] > 0).map(prato => (
                <div key={prato.id} style={{ display: "flex", gap: "15px", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "15px" }}>
                  <img src={prato.imagem} alt={prato.nome} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ margin: "0 0 5px 0" }}>{prato.nome}</h4>
                    <span style={{ color: "#64748b", fontSize: "0.9rem" }}>{carrinho[prato.id]}x R$ {prato.preco.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => removerDoCarrinho(prato.id)} style={{ backgroundColor: "#1e293b", border: "none", color: "#fff", padding: "2px 8px", borderRadius: "4px", cursor: "pointer" }}>-</button>
                    <button onClick={() => adicionarAoCarrinho(prato.id)} style={{ backgroundColor: "#1e293b", border: "none", color: "#fff", padding: "2px 8px", borderRadius: "4px", cursor: "pointer" }}>+</button>
                  </div>
                </div>
              ))}
              {totalItens === 0 && <p style={{ color: "#64748b", textAlign: "center" }}>Seu carrinho está vazio.</p>}
            </div>
          </div>

          <div style={{ borderTop: "1px solid #1e293b", paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold", marginBottom: "20px" }}>
              <span>Total:</span>
              <span style={{ color: "#f59e0b" }}>R$ {valorTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => { alert("Pedido enviado para a cozinha com sucesso! 🔥"); setCarrinho({}); setCarrinhoAberto(false); }}
              disabled={totalItens === 0}
              style={{ width: "100%", padding: "14px", backgroundColor: totalItens === 0 ? "#1e293b" : "#f59e0b", color: totalItens === 0 ? "#64748b" : "#020617", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold", cursor: totalItens === 0 ? "not-allowed" : "pointer" }}
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
