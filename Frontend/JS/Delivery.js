/* ================== Storage helpers ================== */
const STORAGE_KEY = "delivery_pedidos";
const readAll = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const writeAll = (rows) => localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));

/* ================== Utils ================== */
const fmt = (n) => (Number(n||0)).toFixed(2);
const nowISO = () => new Date().toISOString();
const toLocalDateTime = (iso) => {
  const d = new Date(iso);
  const dd = d.toLocaleDateString(); const hh = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  return `${dd} ${hh}`;
};
const uuid = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();

/* ================== DOM refs ================== */
const form = document.getElementById("form-delivery");
const itemsContainer = document.getElementById("items-container");
const btnAddItem = document.getElementById("btn-add-item");
const subTotalEl = document.getElementById("subTotal");
const dlvEl = document.getElementById("dlv");
const totalEl = document.getElementById("total");
const costoDeliveryInput = document.getElementById("costoDelivery");
const tbody = document.getElementById("tbody-historial");

/* filtros */
const filtroTexto = document.getElementById("filtroTexto");
const filtroEstado = document.getElementById("filtroEstado");
const fDesde = document.getElementById("fDesde");
const fHasta = document.getElementById("fHasta");
const btnExport = document.getElementById("btn-export");

/* ================== Items dinámicos ================== */
function addItemRow(data={ descripcion:"", cantidad:"1", precio:"0.00" }){
  const row = document.createElement("div");
  row.className = "item-row";

  row.innerHTML = `
    <input class="input" name="desc" placeholder="Descripción / producto" value="${data.descripcion}">
    <input class="input" name="cant" inputmode="decimal" value="${data.cantidad}">
    <input class="input" name="prec" inputmode="decimal" value="${data.precio}">
    <button type="button" class="item-remove" title="Quitar">✖</button>
  `;

  row.querySelectorAll("input").forEach(inp=>{
    inp.addEventListener("input", recalcTotals);
  });

  row.querySelector(".item-remove").addEventListener("click", ()=>{
    row.remove(); recalcTotals();
  });

  itemsContainer.appendChild(row);
}
btnAddItem?.addEventListener("click", ()=> addItemRow());

/* ================== Cálculo de totales ================== */
function recalcTotals(){
  let subtotal = 0;
  itemsContainer.querySelectorAll(".item-row").forEach(r=>{
    const q = parseFloat(r.querySelector('[name="cant"]').value || 0);
    const p = parseFloat(r.querySelector('[name="prec"]').value || 0);
    subtotal += (q * p);
  });
  const dlv = parseFloat(costoDeliveryInput.value || 0);
  subTotalEl.textContent = fmt(subtotal);
  dlvEl.textContent = fmt(dlv);
  totalEl.textContent = fmt(subtotal + dlv);
}
costoDeliveryInput?.addEventListener("input", recalcTotals);

/* ================== Guardar pedido ================== */
form?.addEventListener("submit", (e)=>{
  e.preventDefault();
  const data = new FormData(form);

  const items = [];
  itemsContainer.querySelectorAll(".item-row").forEach(r=>{
    const descripcion = r.querySelector('[name="desc"]').value.trim();
    const cantidad = parseFloat(r.querySelector('[name="cant"]').value || 0);
    const precio = parseFloat(r.querySelector('[name="prec"]').value || 0);
    if(descripcion && cantidad>0){
      items.push({ descripcion, cantidad, precio, total: +(cantidad*precio).toFixed(2) });
    }
  });

  if(items.length === 0){
    alert("Agrega al menos un ítem.");
    return;
  }

  const pedido = {
    id: uuid(),
    fecha: nowISO(),
    cliente: data.get("cliente")?.trim(),
    telefono: data.get("telefono")?.trim(),
    direccion: data.get("direccion")?.trim(),
    referencia: data.get("referencia")?.trim(),
    metodoPago: data.get("metodoPago")?.trim(),
    repartidor: data.get("repartidor")?.trim(),
    costoDelivery: +(data.get("costoDelivery") || 0),
    estado: document.getElementById("estado").value,
    items,
    subTotal: +subTotalEl.textContent,
    total: +(subTotalEl.textContent) + +(data.get("costoDelivery") || 0)
  };

  const all = readAll();
  all.unshift(pedido); // al inicio
  writeAll(all);
  renderTable();
  form.reset();
  itemsContainer.innerHTML = "";
  addItemRow(); recalcTotals();
});

/* ================== Tabla / Historial ================== */
function renderTable(){
  const rows = applyFilters(readAll());

  tbody.innerHTML = rows.map(p=>{
    const itemsTxt = p.items.map(i=> `${i.cantidad}× ${i.descripcion}`).join(", ");
    const badge = p.estado === "PENDIENTE"  ? "badge pend"
                : p.estado === "EN_CAMINO"  ? "badge camino"
                : p.estado === "ENTREGADO"  ? "badge ok"
                : "badge cancel";

    return `
      <tr data-id="${p.id}">
        <td>${toLocalDateTime(p.fecha)}</td>
        <td><strong>${escapeHtml(p.cliente||"-")}</strong><br><small>${escapeHtml(p.telefono||"")}</small></td>
        <td>${escapeHtml(p.direccion||"-")}<br><small>${escapeHtml(p.referencia||"")}</small></td>
        <td>${escapeHtml(itemsTxt)}</td>
        <td>S/ ${fmt(p.total)}</td>
        <td><span class="${badge}">${p.estado.replace("_"," ")}</span></td>
        <td>${escapeHtml(p.repartidor||"-")}</td>
        <td>
          <span class="action-link" data-action="estado">Cambiar estado</span> · 
          <span class="action-link" data-action="eliminar">Eliminar</span>
        </td>
      </tr>
    `;
  }).join("");

  // acciones
  tbody.querySelectorAll(".action-link").forEach(a=>{
    a.addEventListener("click", (e)=>{
      const tr = e.target.closest("tr");
      const id = tr.dataset.id;
      const action = e.target.getAttribute("data-action");
      if(action === "eliminar"){
        if(confirm("¿Eliminar pedido?")){
          const all = readAll().filter(x=> x.id !== id);
          writeAll(all); renderTable();
        }
      }else if(action === "estado"){
        changeEstado(id);
      }
    });
  });
}

function escapeHtml(s){ return (s||"").replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m])); }

/* ================== Filtros ================== */
function applyFilters(data){
  let out = data.slice();
  const q = (filtroTexto.value||"").toLowerCase().trim();
  const est = (filtroEstado.value||"").trim();
  const d1 = fDesde.value ? new Date(fDesde.value + "T00:00:00") : null;
  const d2 = fHasta.value ? new Date(fHasta.value + "T23:59:59") : null;

  if(q){
    out = out.filter(p=>{
      const hay = [p.cliente,p.direccion,p.referencia].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }
  if(est){ out = out.filter(p=> p.estado === est); }
  if(d1){ out = out.filter(p=> new Date(p.fecha) >= d1); }
  if(d2){ out = out.filter(p=> new Date(p.fecha) <= d2); }
  return out;
}
[filtroTexto, filtroEstado, fDesde, fHasta].forEach(el=> el?.addEventListener("input", renderTable));

/* ================== Cambiar estado ================== */
function changeEstado(id){
  const all = readAll();
  const i = all.findIndex(x=> x.id === id);
  if(i === -1) return;
  const actual = all[i].estado;
  const nuevo = prompt(`Estado actual: ${actual}\n\nEscribe uno de:\nPENDIENTE, EN_CAMINO, ENTREGADO, CANCELADO`, actual);
  const val = (nuevo||"").trim().toUpperCase();
  if(!val) return;
  if(!["PENDIENTE","EN_CAMINO","ENTREGADO","CANCELADO"].includes(val)){
    alert("Estado no válido."); return;
  }
  all[i].estado = val;
  writeAll(all); renderTable();
}

/* ================== Export CSV ================== */
btnExport?.addEventListener("click", ()=>{
  const rows = applyFilters(readAll());
  const header = ["fecha","cliente","telefono","direccion","referencia","metodoPago","repartidor","estado","items","subTotal","costoDelivery","total"];
  const csvRows = [header.join(",")];

  rows.forEach(p=>{
    const itemsFlat = p.items.map(i=> `${i.cantidad}x ${i.descripcion} (S/${fmt(i.total)})`).join(" | ");
    const vals = [
      toLocalDateTime(p.fecha),
      p.cliente||"",
      p.telefono||"",
      p.direccion||"",
      p.referencia||"",
      p.metodoPago||"",
      p.repartidor||"",
      p.estado||"",
      itemsFlat,
      fmt(p.subTotal),
      fmt(p.costoDelivery),
      fmt(p.total)
    ].map(v => `"${String(v).replace(/"/g,'""')}"`);
    csvRows.push(vals.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `delivery_historial_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
});

/* ================== Init ================== */
(function init(){
  // fila inicial de ítem y totales
  addItemRow(); recalcTotals();
  renderTable();

  // limpiar
  document.getElementById("btn-reset")?.addEventListener("click", ()=>{
    itemsContainer.innerHTML = ""; addItemRow(); recalcTotals();
  });
})();

/* ================== Integración opcional con tu POS ==================
Sin modificar tu POS, si este dispara un CustomEvent 'pos:venta-confirmada'
en window con detalle {cliente, telefono, direccion, referencia, metodoPago, items:[{descripcion,cantidad,precio}], costoDelivery, repartidor}
este módulo creará automáticamente un pedido en historial.
Ejemplo para tu POS (no lo pongas aquí; es referencia):

window.dispatchEvent(new CustomEvent('pos:venta-confirmada', {
  detail:{
    cliente:'Juan', telefono:'900000000', direccion:'Av X 123',
    referencia:'Tienda azul', metodoPago:'EFECTIVO',
    items:[{descripcion:'Gaseosa 500ml', cantidad:2, precio:3.5}],
    costoDelivery: 2.5, repartidor:'Pedro'
  }
}));

*/
window.addEventListener("pos:venta-confirmada", (ev)=>{
  try{
    const d = ev.detail || {};
    const items = (d.items||[]).map(i=>({
      descripcion: i.descripcion, cantidad:+i.cantidad, precio:+i.precio, total: +(i.cantidad*i.precio).toFixed(2)
    })).filter(i=> i.descripcion && i.cantidad>0);

    if(items.length===0) return;

    const sub = items.reduce((s,i)=> s + i.total, 0);
    const pedido = {
      id: uuid(), fecha: nowISO(),
      cliente: d.cliente||"", telefono: d.telefono||"",
      direccion: d.direccion||"", referencia: d.referencia||"",
      metodoPago: d.metodoPago||"EFECTIVO", repartidor: d.repartidor||"",
      costoDelivery: +(d.costoDelivery||0), estado: "PENDIENTE",
      items, subTotal: +sub, total: +(sub + +(d.costoDelivery||0)).toFixed(2)
    };
    const all = readAll(); all.unshift(pedido); writeAll(all); renderTable();
  }catch(e){ console.error("No se pudo registrar delivery desde POS:", e); }
});
