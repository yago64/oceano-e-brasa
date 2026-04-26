/* ── Add to cart with full visual feedback ── */
function handleAddToCart(event, id) {
  event.stopPropagation();
  const btn = event.currentTarget;
  cartAdd(id);
  syncCartCount();
  renderDrawer();

  btn.classList.add("adding");
  btn.textContent = "✓ Adicionado";
  setTimeout(() => { btn.classList.remove("adding"); btn.textContent = "🛒 Adicionar"; }, 900);

  addRipple(event, btn);

  const p = allProducts.find(x => x.id === id);
  showToast(`${p.emoji} ${p.name} adicionado!`, "success");
}

/* ── Mobile nav toggle ── */
function toggleMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");
  toggle.classList.toggle("open");
  links.classList.toggle("open");
}

/* ── Live validation bindings ── */
function bindLiveValidation() {
  const pairs = [
    ["f_nome","e_nome","nome"], ["f_tel","e_tel","tel"], ["f_email","e_email","email"],
    ["f_cep","e_cep","cep"], ["f_rua","e_rua","rua"], ["f_numero","e_numero","numero"],
    ["f_bairro","e_bairro","bairro"], ["f_cidade","e_cidade","cidade"],
  ];

  pairs.forEach(([fid, eid, key]) => {
    const el = document.getElementById(fid);
    if (!el) return;
    el.addEventListener("blur", () => setFieldState(fid, eid, validators[key]?.(el.value) ?? null));
    if (key === "tel") el.addEventListener("input", maskPhone);
    if (key === "cep") el.addEventListener("input", maskCEP);
  });

  const uf = document.getElementById("f_uf");
  if (uf) {
    uf.addEventListener("change", () => {
      uf.classList.toggle("has-value", !!uf.value);
      setFieldState("f_uf", "e_uf", validators.uf(uf.value));
    });
  }
}

function bindContactMasks() {
  const tel = document.getElementById("fc_tel");
  if (tel) tel.addEventListener("input", maskPhone);

  const sel = document.getElementById("fc_produto");
  if (sel) sel.addEventListener("change", () => sel.classList.toggle("has-value", !!sel.value));
}

/* ── Keyboard shortcuts ── */
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (document.getElementById("wizardOverlay").classList.contains("open")) closeCheckout();
  else if (document.getElementById("cartDrawer").classList.contains("open")) closeDrawer();
});

/* ── Global ripple on CTAs ── */
document.addEventListener("click", e => {
  const btn = e.target.closest(".btn-primary, .btn-whatsapp, .btn-checkout, .cart-btn, .btn-wiz-next");
  if (btn) addRipple(e, btn);
});

/* ── Close mobile nav on link click ── */
document.querySelectorAll(".nav-links a").forEach(a => {
  a.addEventListener("click", () => {
    document.getElementById("navToggle").classList.remove("open");
    document.getElementById("navLinks").classList.remove("open");
  });
});

/* ── INIT ── */
renderDestaques();
renderTabs();
renderCatalog();
bindLiveValidation();
bindContactMasks();
initSpline();      /* Spline 3D hero background */
initCardTilt();    /* 3D perspective tilt on product cards */
