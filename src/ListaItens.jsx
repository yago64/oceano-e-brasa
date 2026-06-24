import CartaoItem from "./CartaoItem";

function ListaItens(props) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "25px",
      padding: "20px 0",
      width: "100%"
    }}>
      {props.itens.map((prato) => (
        <CartaoItem
          key={prato.id} 
          nome={prato.nome}
          categoria={prato.categoria}
          preco={prato.preco}
          descricao={prato.descricao}
          imagem={prato.imagem}
          status={prato.status}
        />
      ))}
    </div>
  );
}

export default ListaItens;