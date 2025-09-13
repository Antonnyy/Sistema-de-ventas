// ========== Base de imágenes locales ==========
const IMG_BASE = "../Imagenes/"; // desde Frontend/HTML/*.html hacia Frontend/Imagenes/

// ========== Datos de ejemplo (usando archivos reales de tu bodega) ==========
const PRODUCTS = [
  { id: 1, name: "Productos de aseo personal", price: 49.90,  category: "Aseo Personal",   img: "Aseo-Personal.jpg",      desc: "Ergonómico y garantizado para tu salud.", createdAt: "2025-08-01" },
  { id: 2, name: "Teclado Mecánico RGB",  price: 189.00, category: "Aseo de Limpieza",   img: "aseo.jpg",    desc: "Prodcuctos de aseos de limpieza domésticas.",    createdAt: "2025-07-20" },
  { id: 3, name: "Electrodomestico", price: 3299.00, category: "Electronicos",  img: "Electronicos.webp",     desc: "Productos eletrodomesticos.",               createdAt: "2025-06-12" },
  { id: 4, name: "Bebidas alcohólicas",   price: 119.90, category: "Bebidas",        img: "Bebidas.jpg",  desc: "Para citas y eventos.",         createdAt: "2025-08-18" },
  { id: 5, name: "Regalos para de todo tipo",    price: 1199.00, category: "Regalos",   img: "Regalos.jpg",    desc: "Super económico.",                         createdAt: "2025-05-04" },
  { id: 6, name: "Productos escolares",       price: 499.50, category: "Útiles Escolares",    img: "útiles-escolares.jpg",  desc: "Productos Escolares de todo tipo.",               createdAt: "2025-08-28" },
  { id: 7, name: "Fanta",     price: 59.90,  category: "Gaseosas", img: "Gaseosa.jpg",      desc: "Único y delicioso.",                    createdAt: "2025-07-05" },
  { id: 8, name: "Dulces Variados",         price: 349.00, category: "Dulces", img: "Dulces.png",      desc: "Todos los sabores.",                       createdAt: "2025-06-28" }
];

// ========== Utilidades UI ==========
const $  = s => document.querySelector(s);
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
    case "priceAsc":  items.sort((a,b)=> a.price-b.price); break;
    case "priceDesc": items.sort((a,b)=> b.price-a.price); break;
    case "nameAsc":   items.sort((a,b)=> a.name.localeCompare(b.name)); break;
    case "nameDesc":  items.sort((a,b)=> b.name.localeCompare(a.name)); break;
    case "newest":    items.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt)); break;
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
        <img class="thumb" alt="${p.name}">
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
    // Setear imagen local y fallback
    const img = card.querySelector(".thumb");
    img.src = IMG_BASE + p.img;
    img.onerror = () => { 
      img.onerror = null; 
      img.src = IMG_BASE + "placeholder.jpg"; // opcional: agrega un placeholder.jpg en tu carpeta
    };

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
  el.style.color = "#d1fae5"; // verde suave
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
