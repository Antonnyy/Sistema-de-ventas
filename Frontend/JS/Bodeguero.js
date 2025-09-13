
// ===== Auth guard: requiere login =====
(function(){
  if (!sessionStorage.getItem("logueado")){
    const ret = encodeURIComponent("./Bodeguero.html");
    location.href = `./Login.html?returnTo=${ret}`;
  }
})();

// ===== Data (demo): reemplazar con backend =====
let STOCK = [
  { sku: "MOU-001", name: "Mouse Inalámbrico Pro", cat: "Accesorios", stock: 18, min: 5 },
  { sku: "TEC-002", name: "Teclado Mecánico RGB", cat: "Accesorios", stock: 7, min: 6 },
  { sku: "LAP-014", name: "Laptop 14'' Ultraligera", cat: "Cómputo", stock: 3, min: 3 },
  { sku: "AUD-020", name: "Audífonos Bluetooth", cat: "Audio", stock: 12, min: 5 },
  { sku: "MON-027", name: "Monitor 27'' 144Hz", cat: "Monitores", stock: 5, min: 4 },
  { sku: "SSD-101", name: "Disco SSD 1TB", cat: "Almacenamiento", stock: 10, min: 6 },
];
let MOVS = [
  // {type:'entrada'|'salida', sku, qty, ref, ts}
];
let DELIVERY = [
  // {id, cliente, items, estado:'pendiente'|'en_ruta'|'entregado', ts}
];
let VENTAS = [
  // {id, hora, items, total, metodo}
];

// ===== Helpers =====
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const money = v => "S/ " + Number(v||0).toFixed(2);
const now = () => new Date().toISOString();

function saveLS(){
  localStorage.setItem("sv_stock", JSON.stringify(STOCK));
  localStorage.setItem("sv_movs", JSON.stringify(MOVS));
  localStorage.setItem("sv_delivery", JSON.stringify(DELIVERY));
  localStorage.setItem("sv_ventas", JSON.stringify(VENTAS));
}
function loadLS(){
  try{
    STOCK = JSON.parse(localStorage.getItem("sv_stock")) || STOCK;
    MOVS = JSON.parse(localStorage.getItem("sv_movs")) || MOVS;
    DELIVERY = JSON.parse(localStorage.getItem("sv_delivery")) || DELIVERY;
    VENTAS = JSON.parse(localStorage.getItem("sv_ventas")) || VENTAS;
  }catch{}
}

// ===== UI Init =====
document.addEventListener("DOMContentLoaded", () => {
  loadLS();

  // Tabs
  $$(".tab").forEach(b => b.addEventListener("click", () => {
    $$(".tab").forEach(t => t.classList.remove("active"));
    b.classList.add("active");
    const id = b.dataset.tab;
    $$(".section").forEach(s => s.classList.remove("active"));
    $("#tab-"+id).classList.add("active");
  }));

  // Fill categories
  const cats = [...new Set(STOCK.map(p => p.cat))].sort();
  const fcat = $("#fcat");
  cats.forEach(c => {
    const o = document.createElement("option"); o.value = c; o.textContent = c; fcat.appendChild(o);
  });

  // Events
  $("#q").addEventListener("input", renderStock);
  $("#fcat").addEventListener("change", renderStock);
  $("#btnExport").addEventListener("click", exportCSV);
  $("#btnEntrada").addEventListener("click", () => openModal("#modalEntrada"));
  $("#btnSalida").addEventListener("click", () => openModal("#modalSalida"));
  $('[data-close="#modalEntrada"]').addEventListener("click", () => closeModal("#modalEntrada"));
  $('[data-close="#modalSalida"]').addEventListener("click", () => closeModal("#modalSalida"));
  $("#saveEntrada").addEventListener("click", saveEntrada);
  $("#saveSalida").addEventListener("click", saveSalida);

  // Initial render
  renderAll();
});

function renderAll(){
  renderStock();
  renderMovs();
  renderDelivery();
  renderVentas();
  renderKpis();
  saveLS();
}

function renderKpis(){
  $("#kpiProductos").textContent = STOCK.length;
  const low = STOCK.filter(p => p.stock <= p.min).length;
  $("#kpiBajoStock").textContent = low;
  $("#kpiDelivery").textContent = DELIVERY.filter(d => d.estado !== "entregado").length;
  const totalHoy = VENTAS
    .filter(v => new Date(v.hora).toDateString() === new Date().toDateString())
    .reduce((a,b)=> a + b.total, 0);
  $("#kpiVentas").textContent = money(totalHoy);
}

function renderStock(){
  const q = $("#q").value.trim().toLowerCase();
  const cat = $("#fcat").value;
  const tbody = $("#tblStock tbody");
  tbody.innerHTML = "";

  let rows = STOCK.filter(p =>
    (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
    (!cat || p.cat === cat)
  );

  for(const p of rows){
    const tr = document.createElement("tr");
    const estado = p.stock <= p.min ? '<span class="badge danger">Bajo</span>' : '<span class="badge ok">OK</span>';
    tr.innerHTML = `
      <td>${p.sku}</td>
      <td>${p.name}</td>
      <td>${p.cat}</td>
      <td>${p.stock}</td>
      <td>${p.min}</td>
      <td>${estado}</td>
      <td style="text-align:right;">
        <button class="btn outline" data-act="entrada" data-sku="${p.sku}">+ Entrada</button>
        <button class="btn outline" data-act="salida" data-sku="${p.sku}">- Salida</button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  // quick actions
  $$('#tblStock [data-act="entrada"]').forEach(b => b.addEventListener("click", () => {
    $("#eSku").value = b.dataset.sku;
    openModal("#modalEntrada");
  }));
  $$('#tblStock [data-act="salida"]').forEach(b => b.addEventListener("click", () => {
    $("#sSku").value = b.dataset.sku;
    openModal("#modalSalida");
  }));
}

function renderMovs(){
  const box = $("#timeline");
  box.innerHTML = "";
  const sorted = [...MOVS].sort((a,b)=> new Date(b.ts) - new Date(a.ts));
  for(const m of sorted){
    const el = document.createElement("div");
    el.className = "move";
    el.innerHTML = `
      <div class="date">${new Date(m.ts).toLocaleString()}</div>
      <div><span class="type ${m.type}">${m.type.toUpperCase()}</span> – ${m.sku} × ${m.qty} <span class="note">(${m.ref||"—"})</span></div>
      <div class="pill">${m.user||"bodega"}</div>
    `;
    box.appendChild(el);
  }
}

function renderDelivery(){
  const tbody = $("#tblDelivery tbody");
  tbody.innerHTML = "";
  for(const d of DELIVERY){
    const estado = d.estado.replace("_"," ");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.id}</td>
      <td>${d.cliente}</td>
      <td>${d.items.length}</td>
      <td>${estado}</td>
      <td>${new Date(d.ts).toLocaleString()}</td>
      <td style="text-align:right;">
        <button class="btn outline" data-op="preparar" data-id="${d.id}">Preparar</button>
        <button class="btn" data-op="enviar" data-id="${d.id}">Enviar a delivery</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
  // actions
  $$('#tblDelivery [data-op="preparar"]').forEach(b => b.addEventListener("click", () => {
    alert("Simulación: marcando como preparado #" + b.dataset.id);
  }));
  $$('#tblDelivery [data-op="enviar"]').forEach(b => b.addEventListener("click", () => {
    alert("Simulación: pedido #" + b.dataset.id + " enviado a interfaz de Delivery");
  }));
}

function renderVentas(){
  const tbody = $("#tblVentas tbody");
  tbody.innerHTML = "";
  for(const v of VENTAS){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.id}</td>
      <td>${new Date(v.hora).toLocaleTimeString()}</td>
      <td>${v.items.length}</td>
      <td>${money(v.total)}</td>
      <td>${v.metodo}</td>
    `;
    tbody.appendChild(tr);
  }
}

// ===== Modal helpers =====
function openModal(sel){ document.querySelector(sel).classList.add("open"); }
function closeModal(sel){ document.querySelector(sel).classList.remove("open"); }

function saveEntrada(){
  const sku = $("#eSku").value.trim();
  const qty = Math.max(1, Number($("#eQty").value||1));
  const ref = $("#eRef").value.trim();
  const p = STOCK.find(x => x.sku === sku);
  if(!p){ alert("SKU no encontrado"); return; }
  p.stock += qty;
  MOVS.push({ type:"entrada", sku, qty, ref, ts: now() });
  closeModal("#modalEntrada");
  renderAll();
}
function saveSalida(){
  const sku = $("#sSku").value.trim();
  const qty = Math.max(1, Number($("#sQty").value||1));
  const ref = $("#sRef").value.trim();
  const p = STOCK.find(x => x.sku === sku);
  if(!p){ alert("SKU no encontrado"); return; }
  if(p.stock - qty < 0){ alert("Stock insuficiente"); return; }
  p.stock -= qty;
  MOVS.push({ type:"salida", sku, qty, ref, ts: now() });
  closeModal("#modalSalida");
  renderAll();
}

// ===== Export CSV =====
function exportCSV(){
  const rows = [["SKU","Producto","Categoría","Stock","Mínimo"]]
    .concat(STOCK.map(p => [p.sku, p.name, p.cat, p.stock, p.min]));
  const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(",")).join("\\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "stock.csv"; a.click();
  URL.revokeObjectURL(url);
}
