
// ========== Datos de ejemplo (reemplaza con tu backend cuando esté listo) ==========
const PRODUCTS = [
  { id: 1, name: "Mouse Inalámbrico Pro", price: 49.90, category: "Accesorios", img: "https://images.unsplash.com/photo-1587825140400-58147a8aacc7?q=80&w=1200&auto=format&fit=crop", desc: "Ergonómico, 2.4Ghz, batería de larga duración.", createdAt: "2025-08-01" },
  { id: 2, name: "Teclado Mecánico RGB", price: 189.00, category: "Accesorios", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop", desc: "Switches rojos, anti-ghosting, backlight.", createdAt: "2025-07-20" },
  { id: 3, name: "Laptop 14'' Ultraligera", price: 3299.00, category: "Computo", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop", desc: "Intel i5, 16GB RAM, 512GB SSD.", createdAt: "2025-06-12" },
  { id: 4, name: "Audífonos Bluetooth", price: 119.90, category: "Audio", img: "https://images.unsplash.com/photo-1518441902116-f8f7f8f9f4e0?q=80&w=1200&auto=format&fit=crop", desc: "Cancelación pasiva, 20h de batería.", createdAt: "2025-08-18" },
  { id: 5, name: "Monitor 27'' 144Hz", price: 1199.00, category: "Monitores", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop", desc: "IPS, 1ms, FreeSync.", createdAt: "2025-05-04" },
  { id: 6, name: "Impresora Wi‑Fi", price: 499.50, category: "Impresión", img: "https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=1200&auto=format&fit=crop", desc: "Multifunción, tinta continua.", createdAt: "2025-08-28" },
  { id: 7, name: "Memoria USB 128GB", price: 59.90, category: "Almacenamiento", img: "https://images.unsplash.com/photo-1558642084-fd07fae5282e?q=80&w=1200&auto=format&fit=crop", desc: "USB 3.2, metal, llavero.", createdAt: "2025-07-05" },
  { id: 8, name: "Disco SSD 1TB", price: 349.00, category: "Almacenamiento", img: "https://images.unsplash.com/photo-1549921296-3b4a2b089772?q=80&w=1200&auto=format&fit=crop", desc: "NVMe Gen4, 7000MB/s.", createdAt: "2025-06-28" }
];

// ========== Utilidades UI ==========
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const formatPrice = v => "S/ " + v.toFixed(2);

// ========== Estado ==========
let state = {
  q: "", cat: "", sort: "relevance", min: "", max: "",
  items: PRODUCTS
};

// ========== Inicialización ==========
document.addEventListener("DOMContentLoaded", () => {
  // Inputs
  $("#q").addEventListener("input", onChange);
  $("#cat").addEventListener("change", onChange);
  $("#sort").addEventListener("change", onChange);
  $("#min").addEventListener("input", onChange);
  $("#max").addEventListener("input", onChange);
  $("#clear").addEventListener("click", clearFilters);
  $("#btnCart").addEventListener("click", openCart);

  // Llenar categorías
  fillCategories();

  // Render inicial
  apply();
  updateCartBadge();
});

function onChange(e){
  const id = e.target.id;
  state[id] = e.target.value;
  apply();
}

function clearFilters(){
  state = { ...state, q:"", cat:"", sort:"relevance", min:"", max:"" };
  $("#q").value = "";
  $("#cat").value = "";
  $("#sort").value = "relevance";
  $("#min").value = "";
  $("#max").value = "";
  apply();
}

function fillCategories(){
  const cats = Array.from(new Set(PRODUCTS.map(p => p.category))).sort();
  const sel = $("#cat");
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c;
    sel.appendChild(opt);
  });
}

function apply(){
  let items = [...PRODUCTS];

  // Buscar
  const q = state.q.trim().toLowerCase();
  if(q){
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.desc||"").toLowerCase().includes(q)
    );
  }

  // Categoría
  if(state.cat){
    items = items.filter(p => p.category === state.cat);
  }

  // Rango de precio
  const min = parseFloat(state.min);
  const max = parseFloat(state.max);
  if(!isNaN(min)) items = items.filter(p => p.price >= min);
  if(!isNaN(max)) items = items.filter(p => p.price <= max);

  // Orden
  switch(state.sort){
    case "priceAsc": items.sort((a,b)=> a.price-b.price); break;
    case "priceDesc": items.sort((a,b)=> b.price-a.price); break;
    case "nameAsc": items.sort((a,b)=> a.name.localeCompare(b.name)); break;
    case "nameDesc": items.sort((a,b)=> b.name.localeCompare(a.name)); break;
    case "newest": items.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt)); break;
    default: /* relevance */ break;
  }

  state.items = items;
  $("#totalItems").textContent = `${items.length} producto${items.length!==1?'s':''}`;
  render(items);
}

function render(items){
  const grid = $("#grid");
  grid.innerHTML = "";
  $("#empty").style.display = items.length ? "none" : "block";

  for(const p of items){
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb-wrap">
        <img class="thumb" src="${p.img}" alt="${p.name}">
        <span class="badge-top">${p.category}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${p.name}</div>
        <div class="card-desc">${p.desc||""}</div>
        <div class="price-row">
          <div class="price">${formatPrice(p.price)}</div>
          <button class="add" data-id="${p.id}">Agregar</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  }

  // Bind botones Agregar
  $$("#grid .add").forEach(btn => btn.addEventListener("click", onAdd));
}

function onAdd(e){
  const id = Number(e.currentTarget.dataset.id);
  const product = PRODUCTS.find(p => p.id === id);
  if(!product) return;

  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if(existing) existing.qty += 1;
  else cart.push({ id, name: product.name, price: product.price, qty: 1 });

  setCart(cart);
  animateAdd(e.currentTarget);
  updateCartBadge();
}

function animateAdd(el){
  el.textContent = "✓ Agregado";
  el.style.borderColor = "rgba(34,197,94,.8)";
  el.style.color = "var(--ok)";
  setTimeout(()=>{
    el.textContent = "Agregar";
    el.style.borderColor = "rgba(255,255,255,.12)";
    el.style.color = "#eaf2ff";
  }, 900);
}

// ========== Carrito (localStorage) ==========
const CART_KEY = "sv_cart";

function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch{ return []; }
}
function setCart(v){
  localStorage.setItem(CART_KEY, JSON.stringify(v));
}
function countCart(){
  return getCart().reduce((a,i)=> a + i.qty, 0);
}
function updateCartBadge(){
  $("#cartCount").textContent = countCart();
}

function openCart(){
  const cart = getCart();
  if(!cart.length){
    alert("Tu carrito está vacío.");
    return;
  }
  const lines = cart.map(i => `• ${i.qty} × ${i.name} — ${formatPrice(i.price * i.qty)}`);
  const total = cart.reduce((a,i)=> a + i.price * i.qty, 0);
  alert(`Carrito:\n\n${lines.join("\n")}\n\nTotal: ${formatPrice(total)}\n\n(Integrar con tu página de checkout)`);
}
