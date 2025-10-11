<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Delivery – Bodega Josdin</title>

  <!-- ================== Hojas de estilo globales ==================
       - Navbar.css: estilos del menú superior
       - Footer.css: estilos del pie de página
       - Delivery.css: estilos específicos de esta pantalla (formulario, ítems, etc.)
  -->
  <link rel="stylesheet" href="../CSS/Navbar.css"/>
  <link rel="stylesheet" href="../CSS/Footer.css"/>
  <link rel="stylesheet" href="../CSS/Delivery.css"/>

  <!-- ============= Fallback mínimo del navbar (opcional) =============
       Este bloque solo ayuda si por alguna razón no carga Navbar.css.
       No interfiere si el archivo externo se carga correctamente. -->
  <style>
    .sv-navbar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid rgba(31,41,55,.6);background:#0b1220}
    .sv-navbar .logo{font-weight:800;color:#e2e8f0}
    .sv-navbar .nav-links{list-style:none;display:flex;gap:12px;align-items:center;margin:0;padding:0}
    .sv-navbar .nav-link{display:inline-block;padding:8px 10px;border-radius:10px;color:#e2e8f0;text-decoration:none}
    .sv-navbar .nav-link:hover{background:#111827}
    .sv-navbar .btn{background:linear-gradient(135deg,#22d3ee,#06b6d4);color:#05202a;font-weight:800}
    .sv-navbar .has-sub{position:relative}
    .sv-navbar .has-sub>.sub{position:absolute;top:100%;left:0;min-width:220px;display:none;background:#0f172a;border:1px solid rgba(51,65,85,.5);border-radius:12px;padding:6px;margin-top:6px;z-index:10}
    .sv-navbar .has-sub:hover>.sub{display:block}
    .sv-navbar .sub li{list-style:none}
    .sv-navbar .sub .nav-link{display:block;padding:10px 12px;border-radius:8px}
    .sv-navbar .menu-toggle{display:none}
  </style>
</head>

<body>
  <!-- ================= NAVBAR =================
       Navegación principal del sistema. Incluye submenú de Productos
       y botón de salida a Main.html. -->
  <nav class="navbar sv-navbar">
    <div class="logo">Sistema · Bodega</div>
    <ul class="nav-links">
      <li><a class="nav-link" href="Bodeguero.html">Bodega</a></li>
      <li><a class="nav-link" href="Venta.html">Ventas</a></li>
      <li><a class="nav-link" href="Delivery.html">Delivery</a></li>
      <li><a class="nav-link" href="Gestion.html">Gestión</a></li>
      <!-- Submenú de productos -->
      <li class="has-sub">
        <a class="nav-link" href="#">Productos ▾</a>
        <ul class="sub">
          <li><a class="nav-link" href="Producto-Crear.html">Crear producto</a></li>
          <li><a class="nav-link" href="Producto-Editar.html">Editar producto</a></li>
        </ul>
      </li>
      <li><a class="nav-link" href="Metricas.html">Métricas</a></li>
      <li><a class="btn nav-link" href="Main.html">Salir</a></li>
    </ul>
    <!-- Botón para menú móvil (estilizado en CSS externo) -->
    <button class="menu-toggle" aria-label="Menú">☰</button>
  </nav>

  <!-- ================= HERO =================
       Encabezado visual de la sección Delivery. -->
  <header class="hero">
    <h1>Registro de Delivery</h1>
  </header>

  <!-- ========== ENCABEZADO RESUMEN DEL PEDIDO ==========
       Bloque informativo (no funcional) para imprimir en el comprobante.
       - Fecha: puedes actualizarla manualmente o con un backend.
       - N° Pedido: correlativo manual o desde backend si lo conectas. -->
  <section class="card-lite" style="text-align:center;margin:20px auto;max-width:600px;">
    <p style="font-size:1.05rem;color:#e2e8f0;">
      <strong>Fecha:</strong>
      <!-- Etiqueta <time> semántica: útil si luego lo procesa un backend -->
      <time datetime="2025-10-10" id="fecha-hoy">10/10/2025</time>
      &nbsp;·&nbsp;
      <strong>N° Pedido:</strong> <span>0001</span>
    </p>
  </section>

  <!-- ================= CONTENIDO PRINCIPAL =================
       Formulario del pedido: datos del cliente, ítems, totales y estado. -->
  <main class="wrapper">
    <section class="form card">
      <h2 class="section-title">Datos del Pedido</h2>

      <!-- Form principal. Autocomplete activado para mejorar UX. -->
      <form autocomplete="on">
        <!-- ===== Datos del cliente ===== -->
        <div class="grid-2">
          <!-- Cliente: obligatorio -->
          <div class="field">
            <input id="cliente" name="cliente" required placeholder=" "/>
            <label for="cliente">Cliente</label>
          </div>
          <!-- Teléfono: opcional; inputmode=tel ayuda en móviles -->
          <div class="field">
            <input id="telefono" name="telefono" inputmode="tel" placeholder=" "/>
            <label for="telefono">Teléfono</label>
          </div>
        </div>

        <!-- ===== Dirección y referencia ===== -->
        <div class="grid-2">
          <!-- Dirección de entrega: obligatoria -->
          <div class="field">
            <input id="direccion" name="direccion" required placeholder=" "/>
            <label for="direccion">Dirección</label>
          </div>
          <!-- Referencia: punto cercano, piso, puerta, etc. -->
          <div class="field">
            <input id="referencia" name="referencia" placeholder=" "/>
            <label for="referencia">Referencia</label>
          </div>
        </div>

        <!-- ===== Ítems del pedido =====
             Estructura en grilla: Descripción | Cant | Precio | Acciones.
             Las acciones (✏️/🗑️) funcionan sin JS con checkboxes ocultos
             y selectores CSS (ver Delivery.css). -->
        <div class="items card-lite">
          <div class="items-head">
            <h3>Ítems</h3>
            <p class="note"></p>
          </div>

          <!-- Encabezados de columnas -->
          <div class="items-header">
            <div>Descripción / producto</div>
            <div class="num">Cant.</div>
            <div class="num">Precio (S/)</div>
            <div class="center">Acciones</div>
          </div>

          <!-- Tres filas visibles por defecto -->
          <div class="items-grid">
            <!-- ===== Fila 1 ===== -->
            <div class="item-row">
              <!-- Toggles ocultos (activados por los labels con íconos) -->
              <input type="checkbox" id="e1" class="toggle edit-toggle" hidden>
              <input type="checkbox" id="r1" class="toggle remove-toggle" hidden name="remove_row_1">
              <!-- Campos de producto -->
              <input class="input" name="desc[]" placeholder="Ej: Gaseosa 500ml">
              <input class="input num" name="cant[]" inputmode="decimal" placeholder="0">
              <input class="input num" name="prec[]" inputmode="decimal" placeholder="0.00">
              <!-- Acciones de la fila -->
              <div class="item-actions">
                <label for="e1" class="icon-btn edit" title="Editar (resalta fila)">✏️</label>
                <label for="r1" class="icon-btn delete" title="Borrar (oculta fila)">🗑️</label>
              </div>
            </div>

            <!-- ===== Fila 2 ===== -->
            <div class="item-row">
              <input type="checkbox" id="e2" class="toggle edit-toggle" hidden>
              <input type="checkbox" id="r2" class="toggle remove-toggle" hidden name="remove_row_2">
              <input class="input" name="desc[]" placeholder="Ej: Pan molde">
              <input class="input num" name="cant[]" inputmode="decimal" placeholder="0">
              <input class="input num" name="prec[]" inputmode="decimal" placeholder="0.00">
              <div class="item-actions">
                <label for="e2" class="icon-btn edit" title="Editar (resalta fila)">✏️</label>
                <label for="r2" class="icon-btn delete" title="Borrar (oculta fila)">🗑️</label>
              </div>
            </div>

            <!-- ===== Fila 3 ===== -->
            <div class="item-row">
              <input type="checkbox" id="e3" class="toggle edit-toggle" hidden>
              <input type="checkbox" id="r3" class="toggle remove-toggle" hidden name="remove_row_3">
              <input class="input" name="desc[]" placeholder="Ej: Leche 1L">
              <input class="input num" name="cant[]" inputmode="decimal" placeholder="0">
              <input class="input num" name="prec[]" inputmode="decimal" placeholder="0.00">
              <div class="item-actions">
                <label for="e3" class="icon-btn edit" title="Editar (resalta fila)">✏️</label>
                <label for="r3" class="icon-btn delete" title="Borrar (oculta fila)">🗑️</label>
              </div>
            </div>
          </div>

          <!-- Más filas “prearmadas” sin JS (puedes duplicar si necesitas más) -->
          <details class="more">
            <summary class="btn add">➕ Agregar más productos</summary>
            <div class="items-grid">
              <!-- ===== Fila 4 ===== -->
              <div class="item-row">
                <input type="checkbox" id="e4" class="toggle edit-toggle" hidden>
                <input type="checkbox" id="r4" class="toggle remove-toggle" hidden name="remove_row_4">
                <input class="input" name="desc[]" placeholder="Producto adicional 1">
                <input class="input num" name="cant[]" inputmode="decimal" placeholder="0">
                <input class="input num" name="prec[]" inputmode="decimal" placeholder="0.00">
                <div class="item-actions">
                  <label for="e4" class="icon-btn edit" title="Editar (resalta fila)">✏️</label>
                  <label for="r4" class="icon-btn delete" title="Borrar (oculta fila)">🗑️</label>
                </div>
              </div>

              <!-- ===== Fila 5 ===== -->
              <div class="item-row">
                <input type="checkbox" id="e5" class="toggle edit-toggle" hidden>
                <input type="checkbox" id="r5" class="toggle remove-toggle" hidden name="remove_row_5">
                <input class="input" name="desc[]" placeholder="Producto adicional 2">
                <input class="input num" name="cant[]" inputmode="decimal" placeholder="0">
                <input class="input num" name="prec[]" inputmode="decimal" placeholder="0.00">
                <div class="item-actions">
                  <label for="e5" class="icon-btn edit" title="Editar (resalta fila)">✏️</label>
                  <label for="r5" class="icon-btn delete" title="Borrar (oculta fila)">🗑️</label>
                </div>
              </div>

              <!-- ===== Fila 6 ===== -->
              <div class="item-row">
                <input type="checkbox" id="e6" class="toggle edit-toggle" hidden>
                <input type="checkbox" id="r6" class="toggle remove-toggle" hidden name="remove_row_6">
                <input class="input" name="desc[]" placeholder="Producto adicional 3">
                <input class="input num" name="cant[]" inputmode="decimal" placeholder="0">
                <input class="input num" name="prec[]" inputmode="decimal" placeholder="0.00">
                <div class="item-actions">
                  <label for="e6" class="icon-btn edit" title="Editar (resalta fila)">✏️</label>
                  <label for="r6" class="icon-btn delete" title="Borrar (oculta fila)">🗑️</label>
                </div>
              </div>
            </div>
          </details>
        </div>

        <!-- ===== Totales (ingreso manual; sin JS) ===== -->
        <div class="grid-3 totales">
          <div class="field">
            <input id="subTotal" name="subTotal" inputmode="decimal" class="num" placeholder="0.00"/>
            <label for="subTotal">Subt. (S/)</label>
          </div>
          <div class="field">
            <input id="costoDelivery" name="costoDelivery" inputmode="decimal" class="num" placeholder="0.00"/>
            <label for="costoDelivery">Delivery (S/)</label>
          </div>
          <div class="field">
            <input id="total" name="total" inputmode="decimal" class="num" placeholder="0.00"/>
            <label for="total">Total (S/)</label>
          </div>
        </div>

        <!-- ===== Estado del pedido ===== -->
        <div class="grid-2 estado-delivery">
          <div class="field">
            <!-- Label fijo (no flotante) sobre el <select> -->
            <label for="estadoDelivery" class="label-select">Estado del delivery</label>
            <select id="estadoDelivery" name="estadoDelivery" class="select" required>
              <option value="" selected disabled>Seleccionar estado</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_CAMINO">En camino</option>
              <option value="ENTREGADO">Entregado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>

        <!-- ===== Botones finales =====
             - Imprimir/Guardar PDF: usa el diálogo de impresión del navegador.
             - Limpiar: resetea los campos del formulario. -->
        <div class="actions">
          <button class="btn primary" type="button" onclick="window.print()">Imprimir / Guardar PDF</button>
          <button class="btn" type="reset">Limpiar</button>
        </div>
      </form>
    </section>
  </main>

  <!-- ================= FOOTER ================= -->
  <footer id="footer">
    <p style="text-align:center;color:#9fb1c6;padding:18px 0">
      © 2025 Bodega Josdin · Sistema de Ventas
    </p>
  </footer>
</body>
</html>
