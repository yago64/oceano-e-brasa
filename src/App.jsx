import { useState } from "react";
import { pratos } from "./dados";
import ListaItens from "./ListaItens";
import Filtro from "./Filtro";

function App() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");

  const pratosFiltrados = pratos.filter((prato) => {
    const bateuCategoria = categoriaAtiva === "Todos" || prato.categoria === categoriaAtiva;
    
    const bateuBusca = prato.nome.toLowerCase().includes(busca.toLowerCase());
    
    return bateuCategoria && bateuBusca;
  });

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "30px 20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f8fafc", 
      minHeight: "100vh"
    }}>
      
      <header style={{
        textAlign: "center",
        marginBottom: "30px",
        padding: "30px",
        backgroundColor: "#0f172a", 
        color: "#f8fafc",
        borderRadius: "16px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      }}>
        <h1 style={{ margin: "0 0 10px 0", fontSize: "2.5rem" }}>🌊 Oceano & Brasa</h1>
        <p style={{ margin: "0", color: "#94a3b8", fontSize: "1.1rem" }}>
          Cardápio Exclusivo — Alta Gastronomia e Sabores Marcantes
        </p>
      </header>

      <Filtro 
        categoriaAtiva={categoriaAtiva} 
        setCategoriaAtiva={setCategoriaAtiva}
        busca={busca}
        setBusca={setBusca}
      />

      <main>
        <h2 style={{ color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>
          {categoriaAtiva === "Todos" ? "Todos os Pratos" : categoriaAtiva}
        </h2>
        
        {pratosFiltrados.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b", fontSize: "1.2rem", marginTop: "40px" }}>
            Nenhum prato encontrado com esses critérios. 🍽️
          </p>
        ) : (
          <ListaItens itens={pratosFiltrados} />
        )}
      </main>

    </div>
  );
}

export default App;