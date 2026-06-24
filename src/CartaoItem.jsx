import { useState } from "react";

function CartaoItem(props) {
  const [quantidade, setQuantidade] = useState(0);

  function adicionarItem() {
    setQuantidade(quantidade + 1);
  }

  function removerItem() {
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
    }
  }

  return (
    <div style={{
      border: "1px solid #cbd5e1",
      borderRadius: "12px",          
      padding: "20px",               
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", 
      maxWidth: "300px",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }}>
      <img 
        src={props.imagem} 
        alt={props.nome} 
        style={{ 
          width: "100%", 
          height: "180px", 
          objectFit: "cover", 
          borderRadius: "8px" 
        }} 
      />

      <h3 style={{ margin: "5px 0 0 0", fontSize: "1.3rem" }}>{props.nome}</h3>
      
      <span style={{ 
        color: "#0284c7", 
        fontWeight: "600", 
        fontSize: "0.9rem",
        textTransform: "uppercase" 
      }}>
        {props.categoria}
      </span>
      
      <p style={{ color: "#64748b", fontSize: "0.95rem", margin: "0" }}>
        {props.descricao}
      </p>
      
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginTop: "auto",
        paddingTop: "10px"
      }}>
        <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0f172a" }}>
          R$ {props.preco.toFixed(2)}
        </span>
        
        <span style={{ 
          fontSize: "0.85rem", 
          fontWeight: "600",
          color: props.status === "Disponível" ? "#16a34a" : "#dc2626"
        }}>
          {props.status}
        </span>
      </div>

      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: "15px", 
        marginTop: "10px",
        backgroundColor: "#f8fafc",
        padding: "8px",
        borderRadius: "8px"
      }}>
        <button 
          onClick={removerItem}
          disabled={quantidade === 0 || props.status === "Esgotado"}
          style={{ padding: "5px 12px", cursor: "pointer" }}
        >
          -
        </button>
        
        <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>{quantidade}</span>
        
        <button 
          onClick={adicionarItem}
          disabled={props.status === "Esgotado"}
          style={{ padding: "5px 12px", cursor: "pointer" }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default CartaoItem;