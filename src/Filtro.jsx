function Filtro(props) {
  const categorias = ["Todos", "Burgers", "Pizzas", "Massas", "Sobremesas", "Bebidas"];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginBottom: "30px",
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
    }}>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <label style={{ fontWeight: "600", color: "#334155" }}>Buscar prato:</label>
        <input
          type="text"
          placeholder="Digite o nome de um prato ou ingrediente..."
          value={props.busca}
          onChange={(e) => props.setBusca(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            outline: "none",
            width: "100%",
            boxSizing: "border-box"
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontWeight: "600", color: "#334155" }}>Categorias:</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {categorias.map((cat) => {
            const estaAtivo = props.categoriaAtiva === cat;
            return (
              <button
                key={cat}
                onClick={() => props.setCategoriaAtiva(cat)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  backgroundColor: estaAtivo ? "#0284c7" : "#e2e8f0",
                  color: estaAtivo ? "#ffffff" : "#334155",
                  transition: "all 0.2s ease"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default Filtro;