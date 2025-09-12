
/**
 * Simple HTML include loader
 * Usage in your pages:
 *   <div data-include="../HTML/Navbar.html"></div>
 *   <div data-include="../HTML/Footer.html"></div>
 * Make sure to add: <script defer src="../JS/includes.js"></script> in <head>.
 *
 * Tip: sirve con un servidor local (Live Server, `npx serve`, `python -m http.server`),
 * abrir archivos con file:// puede bloquear fetch por CORS.
 */
(function(){
  async function includeHTML(){
    const nodes = document.querySelectorAll("[data-include]");
    await Promise.all(Array.from(nodes).map(async el => {
      const url = el.getAttribute("data-include");
      try{
        const res = await fetch(url, { cache: "no-cache" });
        if(!res.ok) throw new Error(res.status + " " + res.statusText);
        const html = await res.text();
        el.innerHTML = html;
        // Ejecutar <script> dentro del fragmento
        executeScripts(el);
        // Marcar link activo en el navbar si aplica
        markActiveLinks(el);
      }catch(err){
        el.innerHTML = "<!-- include error: " + (err && err.message || err) + " -->";
        console.error("Include error for", url, err);
      }
    }));
  }

  function executeScripts(container){
    const scripts = container.querySelectorAll("script");
    scripts.forEach(old => {
      const s = document.createElement("script");
      if (old.src) s.src = old.src;
      s.textContent = old.textContent;
      // Copiar atributos
      for (const {name, value} of Array.from(old.attributes)) s.setAttribute(name, value);
      old.replaceWith(s);
    });
  }

  function markActiveLinks(root){
    const path = location.pathname.split("/").pop().toLowerCase();
    const anchors = root.querySelectorAll("a[href]");
    anchors.forEach(a => {
      const href = a.getAttribute("href");
      if(!href) return;
      const target = href.split("/").pop().toLowerCase();
      if (target && target === path){
        a.classList.add("active");
        a.setAttribute("aria-current","page");
      }
    });
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", includeHTML);
  } else {
    includeHTML();
  }
})();
