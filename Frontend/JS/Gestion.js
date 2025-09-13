/* ============================================================
   Gestión de Productos – CRUD simple con localStorage
   (aislado con clases .g- y sin romper otros módulos)
   ============================================================ */
(function () {
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // Elementos
  const tbody        = $("#tbodyProducts");
  const countBadge   = $("#countBadge");
  const searchInput  = $("#searchInput");
  const statusFilter = $("#statusFilter");
  const btnAdd       = $("#btnAdd");
  const btnExport    = $("#btnExport");
  const modal        = $("#productModal");
  const form         = $("#productForm");
  const modalTitle   = $("#modalTitle");
  const toast        = $("#toast");

  // Estado
  let products = [];
  let filtered = [];
  let editingIndex = null; // índice en "products" (no en "filtered")

  // Persistencia
  const save = () => localStorage.setItem("productos", JSON.stringify(products));
  const load = () => {
    try {
      const raw = localStorage.getItem("productos");
      if (raw) return JSON.parse(raw);
    } catch {}
    // Semillas de ejemplo
    return [
      { codigo:"P-0001", nombre:"Audífonos Pro", precio:89.90, stock:18, estado:"activo",   descripcion:"Bluetooth 5.3" },
      { codigo:"P-0002", nombre:"Mouse Gamer",   precio:59.00, stock:25, estado:"activo",   descripcion:"RGB, 7200 DPI" },
      { codigo:"P-0003", nombre:"Teclado Mec.",  precio:189.0, stock:8,  estado:"inactivo", descripcion:"Switch Blue" }
    ];
  };

  // Utilidades
  const currency = v => (Number(v||0)).toFixed(2);
  const showToast = (msg, ms=1700) => {
    toast.textContent = msg;
    toast.classList.remove("g-hidden");
    setTimeout(() => toast.classList.add("g-hidden"), ms);
  };
  const openModal = (title="Nuevo producto") => {
    modalTitle.textContent = title;
    modal.classList.remove("g-hidden");
    modal.setAttribute("aria-hidden","false");
  };
  const closeModal = () => {
    modal.classList.add("g-hidden");
    modal.setAttribute("aria-hidden","true");
    form.reset();
    form.__editIndex.value = "";
    editingIndex = null;
  };

  // Render
  const render = () => {
    const q  = searchInput.value.trim().toLowerCase();
    const st = statusFilter.value;

    filtered = products.filter(p => {
      const hit = p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q);
      const ok  = st === "todos" ? true : p.estado === st;
      return hit && ok;
    });

    tbody.innerHTML = filtered.map(p => `
      <tr data-code="${p.codigo}">
        <td>${p.codigo}</td>
        <td>${p.nombre}</td>
        <td>S/ ${currency(p.precio)}</td>
        <td>${p.stock}</td>
        <td><span class="g-status ${p.estado}">${p.estado === "activo" ? "Activo" : "Inactivo"}</span></td>
        <td class="g-center">
          <div class="g-row-actions">
            <button class="g-icon-btn" data-action="toggle" title="Activar/Inactivar">⟳</button>
            <button class="g-icon-btn" data-action="edit"   title="Editar">✎</button>
            <button class="g-icon-btn" data-action="del"    title="Eliminar">🗑</button>
          </div>
        </td>
      </tr>
    `).join("");

    countBadge.textContent = filtered.length;
  };

  // Buscar índice real en "products" usando el código (evita problemas con filtros)
  const getRealIndexByCode = (code) => products.findIndex(p => p.codigo === code);

  // Eventos UI
  searchInput.addEventListener("input", render);
  statusFilter.addEventListener("change", render);

  btnAdd.addEventListener("click", () => {
    form.reset();
    form.estado.value = "activo";
    openModal("Nuevo producto");
  });

  // Exportar JSON
  btnExport.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "productos.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Exportado como productos.json");
  });

  // Cerrar modal
  $$(".g-modal [data-close]").forEach(el => el.addEventListener("click", closeModal));
  modal.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // Guardar (crear/editar)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const item = {
      codigo: (fd.get("codigo") || "").trim(),
      nombre: (fd.get("nombre") || "").trim(),
      precio: Number(fd.get("precio") || 0),
      stock:  Number(fd.get("stock") || 0),
      estado: (fd.get("estado") || "activo"),
      descripcion: (fd.get("descripcion") || "").trim()
    };

    if (!item.codigo || !item.nombre) {
      showToast("Completa los campos obligatorios");
      return;
    }

    // Validar código único
    const existingIdx = products.findIndex(p => p.codigo === item.codigo);
    if (editingIndex === null && existingIdx !== -1) {
      showToast("Código existente. Usa uno diferente.");
      form.codigo.focus();
      return;
    }
    // Si está editando y cambió el código a uno de otro producto
    if (editingIndex !== null && existingIdx !== -1 && existingIdx !== editingIndex) {
      showToast("Ese código ya pertenece a otro producto");
      form.codigo.focus();
      return;
    }

    if (editingIndex === null) {
      products.push(item);
      showToast("Producto creado");
    } else {
      products[editingIndex] = item;
      showToast("Producto actualizado");
    }
    save();
    render();
    closeModal();
  });

  // Acciones en tabla (delegación)
  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const tr   = e.target.closest("tr");
    const code = tr?.getAttribute("data-code");
    const realIndex = getRealIndexByCode(code);
    if (realIndex === -1) return;

    const action = btn.getAttribute("data-action");
    const prod = products[realIndex];

    if (action === "toggle") {
      prod.estado = prod.estado === "activo" ? "inactivo" : "activo";
      save(); render();
      showToast(`Estado cambiado a ${prod.estado}`);
    }

    if (action === "edit") {
      // Cargar datos en el formulario
      form.codigo.value = prod.codigo;
      form.nombre.value = prod.nombre;
      form.precio.value = prod.precio;
      form.stock.value  = prod.stock;
      form.estado.value = prod.estado;
      form.descripcion.value = prod.descripcion || "";
      editingIndex = realIndex;
      form.__editIndex.value = String(realIndex);
      openModal("Editar producto");
    }

    if (action === "del") {
      const ok = confirm(`¿Eliminar "${prod.nombre}" (${prod.codigo})?`);
      if (!ok) return;
      products.splice(realIndex, 1);
      save(); render();
      showToast("Producto eliminado");
    }
  });

  // Init
  products = load();
  render();
})();
