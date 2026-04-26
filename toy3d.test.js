/**
 * toy3d.test.js — SensoPrint Test Suite
 * Compatível com: Vitest, Jest, ou browser console
 *
 * Rodar com Vitest:  npx vitest run toy3d.test.js
 * Rodar com Jest:    npx jest toy3d.test.js
 */

/* ═══════════════════════════════════════════
   MINI TEST RUNNER (fallback para browser)
═══════════════════════════════════════════ */
const isNode = typeof process !== "undefined";

let _pass = 0, _fail = 0;

function describe(name, fn) {
  if (isNode) console.log(`\n▶ ${name}`);
  fn();
}

function it(name, fn) {
  try {
    fn();
    _pass++;
    if (isNode) console.log(`  ✅ ${name}`);
  } catch (e) {
    _fail++;
    if (isNode) console.error(`  ❌ ${name}\n     ${e.message}`);
  }
}
const test = it;

function expect(val) {
  return {
    toBe:        exp => { if (val !== exp)  throw new Error(`Expected ${JSON.stringify(exp)}, got ${JSON.stringify(val)}`); },
    toEqual:     exp => { if (JSON.stringify(val) !== JSON.stringify(exp)) throw new Error(`Expected ${JSON.stringify(exp)}, got ${JSON.stringify(val)}`); },
    toBeTruthy:  ()  => { if (!val)         throw new Error(`Expected truthy, got ${JSON.stringify(val)}`); },
    toBeFalsy:   ()  => { if (val)          throw new Error(`Expected falsy, got ${JSON.stringify(val)}`); },
    toBeNull:    ()  => { if (val !== null) throw new Error(`Expected null`); },
    toContain:   sub => { if (!String(val).includes(sub)) throw new Error(`Expected "${val}" to contain "${sub}"`); },
    toBeGreaterThan: n => { if (!(val > n)) throw new Error(`Expected ${val} > ${n}`); },
    toBeCloseTo: (exp, d=2) => { if (Math.abs(val - exp) >= Math.pow(10,-d)) throw new Error(`Expected ~${exp}, got ${val}`); },
    not: {
      toBe:       exp => { if (val === exp)  throw new Error(`Expected not ${JSON.stringify(exp)}`); },
      toContain:  sub => { if (String(val).includes(sub)) throw new Error(`Expected "${val}" NOT to contain "${sub}"`); },
      toBeFalsy:  ()  => { if (!val)         throw new Error(`Expected truthy`); },
    },
  };
}

/* ═══════════════════════════════════════════
   PURE FUNCTIONS (mirrors of toy3d_sensory_store.html)
   Mantidas aqui para que os testes não dependam do DOM.
═══════════════════════════════════════════ */

// ── Produtos fixture ──
const PRODUCTS = [
  { id:1, emoji:"🌀", name:"Pop Fidget Hexagonal",      price:39.90, cat:"fidget" },
  { id:2, emoji:"🧊", name:"Cubo Infinito Antiestresse", price:49.90, cat:"cubo" },
  { id:3, emoji:"🐚", name:"Caracol Articulado",         price:34.90, cat:"articulado" },
  { id:8, emoji:"🌿", name:"Kit Zen Completo",           price:99.90, cat:"kit" },
];

// ── Cart ──
function makeCart() { return []; }

function cartAdd(cart, id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return cart;
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; return cart; }
  return [...cart, { ...product, qty: 1 }];
}

function cartRemove(cart, id) {
  return cart.filter(i => i.id !== id);
}

function cartChangeQty(cart, id, delta) {
  const next = cart.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i);
  return next.filter(i => i.qty > 0);
}

function cartTotal(cart) {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function cartCount(cart) {
  return cart.reduce((s, i) => s + i.qty, 0);
}

// ── Validators ──
const validators = {
  nome:  v => v.trim().length >= 3  ? null : "Nome deve ter ao menos 3 caracteres",
  tel:   v => /^\(\d{2}\)\s\d\s\d{4}-\d{4}$/.test(v) ? null : "Formato: (61) 9 1234-5678",
  email: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "E-mail inválido",
  cep:   v => /^\d{5}-?\d{3}$/.test(v.trim()) ? null : "CEP inválido",
  rua:   v => v.trim().length >= 4  ? null : "Informe a rua / avenida",
  numero:v => v.trim().length >= 1  ? null : "Informe o número",
  bairro:v => v.trim().length >= 2  ? null : "Informe o bairro",
  cidade:v => v.trim().length >= 2  ? null : "Informe a cidade",
  uf:    v => v.trim().length === 2 ? null : "Selecione o estado",
};

// ── WhatsApp payload ──
function buildCheckoutPayload(cart, checkout) {
  const { nome, tel, email, cep, rua, numero, complemento, bairro, cidade, uf, pagamento, orderId } = checkout;
  const subtotal = cartTotal(cart);
  const hasPix   = pagamento === "pix";
  const discount = hasPix ? subtotal * 0.05 : 0;
  const total    = subtotal - discount;
  const fmt      = n => n.toFixed(2).replace(".", ",");

  let msg = `🛒 *NOVO PEDIDO — SensoPrint*\n🔖 Pedido *#${orderId}*\n\n`;
  cart.forEach(i => {
    msg += `• ${i.emoji} ${i.name} × ${i.qty}\n`;
    msg += `   ↳ R$ ${fmt(i.price)} × ${i.qty} = *R$ ${fmt(i.price * i.qty)}*\n`;
  });
  msg += `\n💰 Subtotal: R$ ${fmt(subtotal)}`;
  if (hasPix) msg += `\n🎁 Desconto PIX (5%): -R$ ${fmt(discount)}`;
  msg += `\n💵 *TOTAL: R$ ${fmt(total)}*\n\n`;
  msg += `👤 *DADOS DO CLIENTE:*\n• Nome: ${nome}\n• WhatsApp: ${tel}\n`;
  if (email) msg += `• E-mail: ${email}\n`;
  msg += `\n📍 *ENDEREÇO:*\n• CEP: ${cep}\n• ${rua}, ${numero}`;
  if (complemento) msg += ` — ${complemento}`;
  msg += `\n• ${bairro}, ${cidade} — ${uf}\n`;
  msg += `\n💳 *PAGAMENTO:* ${pagamento}\n\n✅ Confirmo o pedido!`;
  return msg;
}

function genOrderId(seed) {
  return "SP-" + seed.toString(36).toUpperCase();
}

/* ═══════════════════════════════════════════
   1. TESTES UNITÁRIOS — CART
═══════════════════════════════════════════ */
describe("Cart — addToCart", () => {
  test("adiciona novo item com qty:1", () => {
    const cart = cartAdd(makeCart(), 1);
    expect(cart.length).toBe(1);
    expect(cart[0].qty).toBe(1);
    expect(cart[0].id).toBe(1);
  });

  test("incrementa qty para item já existente", () => {
    let cart = cartAdd(makeCart(), 1);
    cart = cartAdd(cart, 1);
    expect(cart.length).toBe(1);
    expect(cart[0].qty).toBe(2);
  });

  test("ignora id inexistente", () => {
    const cart = cartAdd(makeCart(), 999);
    expect(cart.length).toBe(0);
  });

  test("adiciona múltiplos produtos distintos", () => {
    let cart = makeCart();
    cart = cartAdd(cart, 1);
    cart = cartAdd(cart, 2);
    cart = cartAdd(cart, 3);
    expect(cart.length).toBe(3);
  });
});

describe("Cart — removeFromCart", () => {
  test("remove item existente", () => {
    let cart = cartAdd(makeCart(), 1);
    cart = cartRemove(cart, 1);
    expect(cart.length).toBe(0);
  });

  test("não afeta outros itens ao remover", () => {
    let cart = cartAdd(cartAdd(makeCart(), 1), 2);
    cart = cartRemove(cart, 1);
    expect(cart.length).toBe(1);
    expect(cart[0].id).toBe(2);
  });

  test("remover id inexistente não altera o cart", () => {
    let cart = cartAdd(makeCart(), 1);
    cart = cartRemove(cart, 999);
    expect(cart.length).toBe(1);
  });
});

describe("Cart — changeQty", () => {
  test("incrementa qty corretamente", () => {
    let cart = cartAdd(makeCart(), 1);
    cart = cartChangeQty(cart, 1, 2);
    expect(cart[0].qty).toBe(3);
  });

  test("decrementa qty corretamente", () => {
    let cart = cartAdd(makeCart(), 1);
    cart = cartAdd(cart, 1); // qty=2
    cart = cartChangeQty(cart, 1, -1);
    expect(cart[0].qty).toBe(1);
  });

  test("remove item quando qty chega a 0", () => {
    let cart = cartAdd(makeCart(), 1);
    cart = cartChangeQty(cart, 1, -1);
    expect(cart.length).toBe(0);
  });

  test("remove item quando qty fica negativa", () => {
    let cart = cartAdd(makeCart(), 1);
    cart = cartChangeQty(cart, 1, -5);
    expect(cart.length).toBe(0);
  });
});

describe("Cart — cartTotal e cartCount", () => {
  test("total com item único", () => {
    const cart = cartAdd(makeCart(), 1); // 39.90
    expect(cartTotal(cart)).toBeCloseTo(39.90);
  });

  test("total com múltiplos itens e quantidades", () => {
    let cart = makeCart();
    cart = cartAdd(cart, 1); // 39.90
    cart = cartAdd(cart, 1); // 39.90 × 2 = 79.80
    cart = cartAdd(cart, 2); // + 49.90 = 129.70
    expect(cartTotal(cart)).toBeCloseTo(129.70);
  });

  test("total do carrinho vazio é zero", () => {
    expect(cartTotal(makeCart())).toBe(0);
  });

  test("cartCount retorna soma das quantidades", () => {
    let cart = makeCart();
    cart = cartAdd(cart, 1);
    cart = cartAdd(cart, 1);
    cart = cartAdd(cart, 2);
    expect(cartCount(cart)).toBe(3);
  });

  test("cartCount do carrinho vazio é zero", () => {
    expect(cartCount(makeCart())).toBe(0);
  });
});

/* ═══════════════════════════════════════════
   2. TESTES UNITÁRIOS — VALIDATORS
═══════════════════════════════════════════ */
describe("Validator — nome", () => {
  test("aceita nome válido", ()  => expect(validators.nome("Bruno Melo")).toBeNull());
  test("rejeita string vazia",  ()  => expect(validators.nome("")).not.toBeNull());
  test("rejeita nome muito curto", () => expect(validators.nome("AB")).not.toBeNull());
  test("aceita exatamente 3 chars", () => expect(validators.nome("Ana")).toBeNull());
  test("ignora espaços nas bordas", () => expect(validators.nome("  AB  ")).not.toBeNull());
});

describe("Validator — tel (WhatsApp)", () => {
  test("aceita (61) 9 1234-5678", () => expect(validators.tel("(61) 9 1234-5678")).toBeNull());
  test("aceita (11) 9 9999-8888", () => expect(validators.tel("(11) 9 9999-8888")).toBeNull());
  test("rejeita número sem DDD",  () => expect(validators.tel("9 1234-5678")).not.toBeNull());
  test("rejeita formato incorreto", () => expect(validators.tel("61999999999")).not.toBeNull());
  test("rejeita string vazia",    () => expect(validators.tel("")).not.toBeNull());
});

describe("Validator — email", () => {
  test("aceita vazio (campo opcional)", () => expect(validators.email("")).toBeNull());
  test("aceita email válido", () => expect(validators.email("user@example.com")).toBeNull());
  test("aceita subdomínio",   () => expect(validators.email("a@b.com.br")).toBeNull());
  test("rejeita sem @",       () => expect(validators.email("invalido.com")).not.toBeNull());
  test("rejeita sem domínio", () => expect(validators.email("a@")).not.toBeNull());
});

describe("Validator — cep", () => {
  test("aceita 70000-000",  () => expect(validators.cep("70000-000")).toBeNull());
  test("aceita 70000000",   () => expect(validators.cep("70000000")).toBeNull());
  test("rejeita letras",    () => expect(validators.cep("ABCDE-FGH")).not.toBeNull());
  test("rejeita curto",     () => expect(validators.cep("7000-000")).not.toBeNull());
  test("rejeita vazio",     () => expect(validators.cep("")).not.toBeNull());
});

describe("Validator — endereço", () => {
  test("rua aceita string >= 4 chars",    () => expect(validators.rua("Rua das Flores")).toBeNull());
  test("rua rejeita string muito curta",  () => expect(validators.rua("Av")).not.toBeNull());
  test("numero aceita qualquer caractere", () => expect(validators.numero("12")).toBeNull());
  test("numero rejeita vazio",            () => expect(validators.numero("")).not.toBeNull());
  test("bairro aceita string válida",     () => expect(validators.bairro("Asa Norte")).toBeNull());
  test("cidade aceita string válida",     () => expect(validators.cidade("Brasília")).toBeNull());
  test("uf aceita 2 chars (DF)",          () => expect(validators.uf("DF")).toBeNull());
  test("uf rejeita 1 char",              () => expect(validators.uf("D")).not.toBeNull());
  test("uf rejeita vazio",               () => expect(validators.uf("")).not.toBeNull());
});

/* ═══════════════════════════════════════════
   3. TESTES UNITÁRIOS — WHATSAPP PAYLOAD
═══════════════════════════════════════════ */
const CHECKOUT_BASE = {
  nome: "Bruno Melo", tel: "(61) 9 4319-6166", email: "bruno@email.com",
  cep: "70000-000", rua: "Rua das Flores", numero: "123", complemento: "Apto 45",
  bairro: "Asa Norte", cidade: "Brasília", uf: "DF",
  pagamento: "pix", orderId: genOrderId(1714000000000),
};

describe("buildCheckoutPayload — estrutura", () => {
  const cart = cartAdd(cartAdd(makeCart(), 1), 2);
  const msg  = buildCheckoutPayload(cart, CHECKOUT_BASE);

  test("contém o order ID",            () => expect(msg).toContain(CHECKOUT_BASE.orderId));
  test("contém nome do produto",       () => expect(msg).toContain("Pop Fidget Hexagonal"));
  test("contém emoji do produto",      () => expect(msg).toContain("🌀"));
  test("contém dados do cliente",      () => expect(msg).toContain("Bruno Melo"));
  test("contém whatsapp do cliente",   () => expect(msg).toContain("(61) 9 4319-6166"));
  test("contém email do cliente",      () => expect(msg).toContain("bruno@email.com"));
  test("contém CEP",                   () => expect(msg).toContain("70000-000"));
  test("contém cidade e UF",           () => expect(msg).toContain("Brasília"));
  test("contém complemento",           () => expect(msg).toContain("Apto 45"));
  test("contém forma de pagamento",    () => expect(msg).toContain("pix"));
  test("contém linha de confirmação",  () => expect(msg).toContain("Confirmo o pedido"));
});

describe("buildCheckoutPayload — desconto PIX", () => {
  test("aplica 5% de desconto quando PIX", () => {
    const cart = cartAdd(makeCart(), 8); // Kit Zen R$ 99,90
    const msg  = buildCheckoutPayload(cart, { ...CHECKOUT_BASE, pagamento: "pix" });
    expect(msg).toContain("Desconto PIX (5%)");
    // desconto = 99.90 * 0.05 = 4.995 → R$ 5,00 (arredondado)
    // total = 99.90 - 4.995 = 94.905 → R$ 94,91
    expect(msg).toContain("94,91");
  });

  test("NÃO aplica desconto quando não é PIX", () => {
    const cart = cartAdd(makeCart(), 8);
    const msg  = buildCheckoutPayload(cart, { ...CHECKOUT_BASE, pagamento: "boleto" });
    expect(msg).not.toContain("Desconto PIX");
  });
});

describe("buildCheckoutPayload — encoding & segurança", () => {
  test("encodeURIComponent não lança erro com payload completo", () => {
    const cart = cartAdd(makeCart(), 1);
    const msg  = buildCheckoutPayload(cart, CHECKOUT_BASE);
    let encoded;
    const encode = () => { encoded = encodeURIComponent(msg); };
    expect(encode).not.toThrow?.();
    if (!encoded) encoded = encodeURIComponent(msg);
    expect(typeof encoded).toBe("string");
    expect(encoded.length).toBeGreaterThan(50);
  });

  test("acentos são preservados antes do encode", () => {
    const checkout = { ...CHECKOUT_BASE, nome: "Márcia Ação" };
    const cart = cartAdd(makeCart(), 1);
    const msg  = buildCheckoutPayload(cart, checkout);
    expect(msg).toContain("Márcia Ação");
  });

  test("URL do WhatsApp tem formato correto", () => {
    const cart = cartAdd(makeCart(), 1);
    const msg  = buildCheckoutPayload(cart, CHECKOUT_BASE);
    const url  = `https://wa.me/556194319166?text=${encodeURIComponent(msg)}`;
    expect(url).toContain("wa.me/556194319166");
    expect(url).toContain("?text=");
    expect(url.startsWith("https://")).toBeTruthy();
  });
});

describe("genOrderId", () => {
  test("começa com SP-",              () => expect(genOrderId(Date.now()).startsWith("SP-")).toBeTruthy());
  test("IDs distintos para seeds distintos", () => {
    const a = genOrderId(1000000);
    const b = genOrderId(9999999);
    expect(a).not.toBe(b);
  });
  test("é string",                    () => expect(typeof genOrderId(123)).toBe("string"));
});

/* ═══════════════════════════════════════════
   4. TESTES DE INTEGRAÇÃO — FLUXO DE CHECKOUT
═══════════════════════════════════════════ */
describe("Checkout flow — simulação de estado", () => {
  test("carrinho vazio não gera payload útil", () => {
    const msg = buildCheckoutPayload(makeCart(), CHECKOUT_BASE);
    // sem itens, a lista de produtos fica vazia — payload deve conter o cabeçalho
    expect(msg).toContain("NOVO PEDIDO");
  });

  test("step 1 é inválido sem nome", () => {
    const err = validators.nome("");
    expect(err).not.toBeNull();
  });

  test("step 1 é válido com dados corretos", () => {
    expect(validators.nome("Bruno Melo")).toBeNull();
    expect(validators.tel("(61) 9 1234-5678")).toBeNull();
    expect(validators.email("a@b.com")).toBeNull();
  });

  test("step 2 falha com CEP inválido", () => {
    expect(validators.cep("1234")).not.toBeNull();
  });

  test("step 2 é válido com endereço completo", () => {
    expect(validators.cep("70000-000")).toBeNull();
    expect(validators.rua("Rua das Flores")).toBeNull();
    expect(validators.numero("123")).toBeNull();
    expect(validators.bairro("Asa Norte")).toBeNull();
    expect(validators.cidade("Brasília")).toBeNull();
    expect(validators.uf("DF")).toBeNull();
  });

  test("fluxo completo gera payload com todos os dados", () => {
    // Simula adição ao carrinho
    let cart = makeCart();
    cart = cartAdd(cart, 1);
    cart = cartAdd(cart, 1); // qty=2
    cart = cartAdd(cart, 2); // segundo produto

    // Simula coleta de dados do checkout
    const checkout = {
      ...CHECKOUT_BASE,
      pagamento: "cartao",
      orderId: genOrderId(Date.now()),
    };

    const msg = buildCheckoutPayload(cart, checkout);

    // Verifica presença de todos os blocos obrigatórios
    expect(msg).toContain("ITENS DO PEDIDO");
    expect(msg).toContain("DADOS DO CLIENTE");
    expect(msg).toContain("ENDEREÇO");
    expect(msg).toContain("PAGAMENTO");
    expect(msg).toContain("cartao");
    expect(msg).toContain("Pop Fidget Hexagonal × 2");
    // Total: 39.90 × 2 + 49.90 = 129.70
    expect(msg).toContain("129,70");
  });

  test("desconto PIX reduz o total em exatamente 5%", () => {
    let cart = cartAdd(makeCart(), 1); // 39.90
    const subtotal = cartTotal(cart); // 39.90
    const expected = subtotal * 0.95; // 37.905
    const msg = buildCheckoutPayload(cart, { ...CHECKOUT_BASE, pagamento: "pix" });
    // O payload deve conter o total com desconto formatado
    expect(msg).toContain(expected.toFixed(2).replace(".", ","));
  });
});

/* ═══════════════════════════════════════════
   5. TESTES E2E — PLAYWRIGHT  (specs descritivos)
   Para executar: npx playwright test
   Arquivo: sensoprint.spec.ts
═══════════════════════════════════════════ */

/*
── sensoprint.spec.ts ────────────────────────────────────────────

import { test, expect } from '@playwright/test';

test.describe('SensoPrint — Fluxo de compra completo', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/toy3d_sensory_store.html');
  });

  test('Adicionar produto abre o drawer e conta o badge', async ({ page }) => {
    await page.locator('button.add-cart').first().click();
    await expect(page.locator('#cartCount')).toHaveText('1');
  });

  test('Drawer abre com os itens corretos', async ({ page }) => {
    await page.locator('button.add-cart').first().click();
    await page.locator('.cart-btn').click();
    await expect(page.locator('.cart-drawer')).toHaveClass(/open/);
    await expect(page.locator('.drawer-item')).toHaveCount(1);
  });

  test('Botão checkout desabilitado com carrinho vazio', async ({ page }) => {
    await page.locator('.cart-btn').click();
    await expect(page.locator('#btnCheckout')).toBeDisabled();
  });

  test('Fluxo completo → checkout → WhatsApp URL', async ({ page }) => {
    // 1. Adiciona 2 produtos
    const addBtns = page.locator('button.add-cart');
    await addBtns.nth(0).click();
    await addBtns.nth(1).click();

    // 2. Abre drawer e inicia checkout
    await page.locator('.cart-btn').click();
    await page.locator('#btnCheckout').click();

    // 3. Verifica que wizard abriu no step 1
    await expect(page.locator('#wizardOverlay')).toHaveClass(/open/);
    await expect(page.locator('#sd1')).toHaveClass(/active/);

    // 4. Preenche dados pessoais
    await page.fill('#f_nome', 'Bruno Melo');
    await page.fill('#f_tel', '(61) 9 4319-6166');
    await page.fill('#f_email', 'bruno@email.com');
    await page.locator('.btn-wiz-next').click();

    // 5. Preenche endereço
    await expect(page.locator('#sd2')).toHaveClass(/active/);
    await page.fill('#f_cep', '70000-000');
    await page.locator('#cepBtn').click();
    await page.waitForTimeout(1200); // aguarda ViaCEP
    await page.fill('#f_numero', '123');
    await page.locator('.btn-wiz-next').click();

    // 6. Seleciona PIX
    await expect(page.locator('#sd3')).toHaveClass(/active/);
    await page.locator('.payment-opt').first().click(); // PIX
    await page.locator('.btn-wiz-next').click();

    // 7. Intercepta window.open para capturar a URL do WhatsApp
    await expect(page.locator('#sd4')).toHaveClass(/active/);
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#btnSend').click(),
    ]);
    const url = popup.url();

    // 8. Valida a URL gerada
    expect(url).toContain('wa.me/556194319166');
    expect(url).toContain('text=');
    const decoded = decodeURIComponent(url.split('text=')[1]);
    expect(decoded).toContain('Bruno Melo');
    expect(decoded).toContain('PIX');
    expect(decoded).toContain('Desconto PIX (5%)');
    expect(decoded).toContain('70000-000');
    expect(decoded).toMatch(/SP-[A-Z0-9]+/); // order ID
  });

  test('Validação bloqueia avanço com campos vazios', async ({ page }) => {
    const addBtn = page.locator('button.add-cart').first();
    await addBtn.click();
    await page.locator('.cart-btn').click();
    await page.locator('#btnCheckout').click();

    // Tenta avançar sem preencher nada
    await page.locator('.btn-wiz-next').click();

    // Wizard deve permanecer no step 1
    await expect(page.locator('#sd1')).toHaveClass(/active/);
    // Campo nome deve ter classe invalid
    await expect(page.locator('#f_nome')).toHaveClass(/invalid/);
  });

  test('Formulário de contato valida campos obrigatórios', async ({ page }) => {
    await page.goto('#contato');
    await page.locator('.btn-whatsapp').click();
    // Sem nome e sem mensagem deve mostrar erro
    await expect(page.locator('#ec_nome')).toBeVisible();
  });
});
*/

/* ═══════════════════════════════════════════
   RELATÓRIO FINAL (apenas para execução direta em Node.js)
═══════════════════════════════════════════ */
if (isNode) {
  const total = _pass + _fail;
  console.log(`\n${"═".repeat(50)}`);
  console.log(`  RESULTADO: ${_pass}/${total} testes passaram`);
  if (_fail > 0) {
    console.error(`  ❌ ${_fail} falha(s) — verifique acima`);
    process.exit(1);
  } else {
    console.log(`  ✅ Todos os testes passaram!`);
  }
  console.log("═".repeat(50));
}

// Exporta para Jest / Vitest
if (typeof module !== "undefined") {
  module.exports = { cartAdd, cartRemove, cartChangeQty, cartTotal, cartCount, validators, buildCheckoutPayload, genOrderId };
}
