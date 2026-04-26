function getProductArt(id) {
  const p = allProducts.find(x => x.id === id);
  const alt = p ? p.name : '';
  return `<img src="assets/products/product-${id}.svg" alt="${alt}" loading="lazy" width="160" height="160" style="width:100%;height:100%;object-fit:contain">`;
}
