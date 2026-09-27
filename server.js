// NovaMarket - TODO EN UNO
// Contiene el frontend y un servidor Express en un solo archivo.
// Para Render: usa `npm start`.

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const INDEX_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NovaMarket · Compras por WhatsApp</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      background: #080b14;
      color: white;
    }

    header {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #252b3d;
    }

    .logo {
      font-size: 24px;
      font-weight: bold;
    }

    .logo span {
      color: #6c63ff;
    }

    .badge {
      background: #151b2b;
      padding: 8px 14px;
      border-radius: 20px;
      color: #aab3c8;
      font-size: 13px;
    }

    .container {
      max-width: 1100px;
      margin: auto;
      padding: 30px 20px;
    }

    .hero {
      padding: 60px 0 40px;
    }

    .hero small {
      color: #22d3ee;
      font-weight: bold;
      text-transform: uppercase;
    }

    .hero h1 {
      font-size: clamp(40px, 8vw, 72px);
      margin: 15px 0;
    }

    .hero p {
      color: #9ba5ba;
      font-size: 18px;
      max-width: 650px;
      line-height: 1.6;
    }

    .tools {
      display: flex;
      gap: 10px;
      margin-bottom: 25px;
      flex-wrap: wrap;
    }

    input,
    select {
      background: #111726;
      color: white;
      border: 1px solid #293146;
      border-radius: 12px;
      padding: 14px;
    }

    input {
      flex: 1;
      min-width: 220px;
    }

    .notice {
      background: #102226;
      border: 1px solid #245052;
      color: #bce8e5;
      padding: 15px;
      border-radius: 12px;
      margin-bottom: 25px;
      font-size: 14px;
    }

    .products {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }

    .card {
      background: #111726;
      border: 1px solid #272f43;
      border-radius: 18px;
      padding: 20px;
    }

    .icon {
      font-size: 32px;
    }

    .tag {
      display: inline-block;
      margin-top: 15px;
      padding: 5px 10px;
      border-radius: 20px;
      background: #29264f;
      color: #c2c0ff;
      font-size: 11px;
    }

    .card h3 {
      margin: 13px 0 8px;
    }

    .description {
      color: #98a2b8;
      font-size: 14px;
      line-height: 1.5;
      min-height: 45px;
    }

    .price {
      font-size: 26px;
      font-weight: bold;
      margin: 18px 0;
    }

    .buy {
      width: 100%;
      border: none;
      border-radius: 11px;
      padding: 13px;
      background: linear-gradient(90deg, #6c63ff, #8b5cf6);
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    .buy:hover {
      opacity: .9;
    }

    footer {
      text-align: center;
      color: #68738a;
      padding: 50px 0 20px;
    }

    .modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.75);
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal.active {
      display: flex;
    }

    .modal-box {
      width: 100%;
      max-width: 420px;
      background: #111726;
      border: 1px solid #293146;
      border-radius: 18px;
      padding: 25px;
    }

    .close {
      float: right;
      border: none;
      background: none;
      color: #aaa;
      font-size: 25px;
      cursor: pointer;
    }

    .modal-box input {
      width: 100%;
      margin: 15px 0;
    }

    .confirm {
      width: 100%;
      padding: 13px;
      border: none;
      border-radius: 10px;
      background: #34d399;
      font-weight: bold;
      cursor: pointer;
    }

    @media (max-width: 800px) {
      .products {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 550px) {
      .products {
        grid-template-columns: 1fr;
      }
    }
  </style>

<!--
  En tu listener de Firebase Auth, después de obtener \`user\`, llama:
  enableBrayanAdminPanel(user);
  La cuenta autorizada es brayanytu19@gmail.com.
  Para autorización real, conserva además el custom claim admin:true.
-->
</head>

<body>

<header>
  <div class="logo">Nova<span>Market</span></div>
  <div class="badge">🔒 Tienda digital</div>
</header>

<div class="container">

  <section class="hero">
    <small>Marketplace digital</small>
    <h1>Servicios digitales.</h1>
    <p>
      Compra productos digitales y consulta números virtuales ficticios
      desde una interfaz sencilla y moderna.
    </p>
  </section>

  <div class="tools">
    <input
      id="search"
      type="text"
      placeholder="Buscar producto..."
    >

    <select id="category">
      <option value="all">Todas las categorías</option>
      <option value="numbers">Números</option>
      <option value="sms">SMS</option>
      <option value="digital">Digital</option>
    </select>
  </div>

  <div class="notice">
    ℹ️ Los números mostrados son ficticios y no tienen servicio telefónico ni SMS.
    El botón Comprar abre WhatsApp para consultar el producto.
  </div>

  <section id="products" class="products"></section>

  <footer>
    © 2026 NovaMarket · Términos · Privacidad · Soporte
  </footer>

</div>

<!-- Ventana de compra -->

<div id="modal" class="modal">

  <div class="modal-box">

    <button class="close" onclick="closeModal()">×</button>

    <h2 id="productName">Comprar</h2>

    <p id="productPrice"></p>

    <p style="color:#9ba5ba; margin:15px 0; line-height:1.5;">
      Pago por saldo en pesos cubanos (CUP). Al continuar se abrirá WhatsApp
      para coordinar la compra.
    </p>

    <button class="confirm" onclick="purchase()">
      Comprar por WhatsApp
    </button>

  </div>

</div>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCg2P0wLfDcv9wt9XRF5v_fWm3RJhkE1jo",
    authDomain: "project-e2a4b.firebaseapp.com",
    projectId: "project-e2a4b",
    storageBucket: "project-e2a4b.firebasestorage.app",
    messagingSenderId: "576822787141",
    appId: "1:576822787141:web:34f650ccb82c6c5751b72c"
  };

  const auth = getAuth(initializeApp(firebaseConfig));
  const provider = new GoogleAuthProvider();
  const ADMIN_EMAIL = "brayanytu19@gmail.com";
  const ADMIN_NAME = "Brayan admin";
  const panel = document.getElementById("adminPanel");
  const login = document.getElementById("adminLogin");
  const status = document.getElementById("adminStatus");
  let autoTimer = null;
  let generated = [];

  async function refreshAdmin(user) {
    if (!user) {
      panel.style.display = "none";
      login.style.display = "block";
      status.textContent = "Inicia sesión para comprobar el acceso.";
      return;
    }
    try {
      const token = await user.getIdTokenResult(true);
      const allowed = user.email === ADMIN_EMAIL && token.claims.admin === true;
      if (allowed) {
        panel.style.display = "block";
        login.style.display = "none";
        status.textContent = "Sesión de administrador activa · " + ADMIN_NAME;
      } else {
        panel.style.display = "none";
        login.style.display = "block";
        status.textContent = "Esta cuenta no tiene el permiso de administrador.";
      }
    } catch (error) {
      panel.style.display = "none";
      login.style.display = "block";
      status.textContent = "No se pudo comprobar el permiso.";
    }
  }

  document.getElementById("adminLoginBtn").addEventListener("click", async () => {
    try {
      status.textContent = "Comprobando cuenta...";
      await signInWithPopup(auth, provider);
    } catch (e) {
      status.textContent = "No se pudo iniciar sesión.";
    }
  });

  document.getElementById("adminLogout").addEventListener("click", async () => {
    stopAuto();
    await signOut(auth);
  });
  onAuthStateChanged(auth, refreshAdmin);

  const patterns = {
    US: () => \`+1 555 01\${String(Math.floor(Math.random()*100)).padStart(2,"0")} \${String(Math.floor(Math.random()*10000)).padStart(4,"0")}\`,
    GB: () => \`+44 7700 900\${String(Math.floor(Math.random()*1000)).padStart(3,"0")}\`,
    ES: () => \`+34 000 \${String(Math.floor(Math.random()*1000000)).padStart(6,"0")}\`
  };

  function makeFakeNumber() {
    return patterns[document.getElementById("fakeCountry").value]();
  }

  function renderHistory() {
    const h = document.getElementById("fakeHistory");
    if (!generated.length) {
      h.innerHTML = '<span style="opacity:.65">Todavía no hay números generados.</span>';
      return;
    }
    h.innerHTML = generated.map((item, i) =>
      \`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid #222a3b">
        <span><b>\${i+1}.</b> \${item}</span>
        <button data-copy="\${item}" style="padding:5px 9px;border:0;border-radius:7px;cursor:pointer">Copiar</button>
      </div>\`
    ).join("");
    h.querySelectorAll("[data-copy]").forEach(btn => btn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = "Copiado";
      setTimeout(() => btn.textContent = "Copiar", 900);
    }));
  }

  function generateFake() {
    const value = makeFakeNumber();
    document.getElementById("fakeOutput").innerHTML = \`\${value} <span style="font-size:12px;opacity:.65">· FICTICIO</span>\`;
    generated.unshift(value);
    generated = generated.slice(0, 20);
    document.getElementById("fakeCount").textContent = generated.length;
    renderHistory();
  }

  function startAuto() {
    stopAuto();
    const seconds = Number(document.getElementById("fakeSpeed").value);
    generateFake();
    autoTimer = setInterval(generateFake, seconds * 1000);
    document.getElementById("toggleAuto").textContent = "⏹ Detener";
    document.getElementById("autoState").textContent = "Activo";
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
    const btn = document.getElementById("toggleAuto");
    if (btn) btn.textContent = "▶ Automático";
    const state = document.getElementById("autoState");
    if (state) state.textContent = "Pausado";
  }

  document.getElementById("generateFake").addEventListener("click", generateFake);
  document.getElementById("toggleAuto").addEventListener("click", () => autoTimer ? stopAuto() : startAuto());
  document.getElementById("clearHistory").addEventListener("click", () => {
    generated = [];
    document.getElementById("fakeOutput").textContent = "Listo para generar";
    document.getElementById("fakeCount").textContent = "0";
    renderHistory();
  });
</script>

<script>

const products = [

  {
    name: "Número virtual +1",
    category: "numbers",
    icon: "🇺🇸",
    price: "250 CUP",
    description:
      "Número ficticio de catálogo; no recibe llamadas ni SMS."
  },

  {
    name: "Número virtual +44",
    category: "numbers",
    icon: "🇬🇧",
    price: "200 CUP",
    description:
      "Número ficticio de catálogo; no recibe llamadas ni SMS."
  },

  {
    name: "Número virtual +34",
    category: "numbers",
    icon: "🇪🇸",
    price: "200 CUP",
    description:
      "Número ficticio de catálogo; no recibe llamadas ni SMS."
  },

  {
    name: "SMS temporal",
    category: "sms",
    icon: "💬",
    price: "100 CUP",
    description:
      "Servicio ficticio de catálogo; no recibe SMS reales."
  },

  {
    name: "Paquete SMS x5",
    category: "sms",
    icon: "📩",
    price: "300 CUP",
    description:
      "Paquete ficticio de catálogo; no recibe SMS reales."
  },

  {
    name: "Servicio digital",
    category: "digital",
    icon: "✨",
    price: "400 CUP",
    description:
      "Producto digital autorizado."
  }

];

let selectedProduct = null;

function renderProducts() {

  const search =
    document
      .getElementById("search")
      .value
      .toLowerCase();

  const category =
    document
      .getElementById("category")
      .value;

  const container =
    document.getElementById("products");

  container.innerHTML = "";

  products
    .filter(product => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        category === "all" ||
        product.category === category;

      return matchesSearch && matchesCategory;

    })
    .forEach((product, index) => {

      container.innerHTML += \`

        <article class="card">

          <div class="icon">
            \${product.icon}
          </div>

          <span class="tag">
            \${product.category}
          </span>

          <h3>
            \${product.name}
          </h3>

          <div class="description">
            \${product.description}
          </div>

          <div class="price">
            \${product.price}
          </div>

          <button
            class="buy"
            onclick="openModal(\${index})"
          >
            Comprar
          </button>

        </article>

      \`;

    });

}

function openModal(index) {

  selectedProduct = products[index];

  document.getElementById(
    "productName"
  ).textContent =
    selectedProduct.name;

  document.getElementById(
    "productPrice"
  ).textContent =
    selectedProduct.price;

  document
    .getElementById("modal")
    .classList.add("active");

}

function closeModal() {

  document
    .getElementById("modal")
    .classList.remove("active");

}

function purchase() {

  if (!selectedProduct) return;

  const phone = "5350039261";

  const message =
    "Hola, quiero comprar:%0A%0A" +
    "Producto: " + encodeURIComponent(selectedProduct.name) + "%0A" +
    "Precio: " + encodeURIComponent(selectedProduct.price) + "%0A" +
    "Forma de pago: saldo en CUP" + "%0A" +
    "Nota: el número mostrado es ficticio.";

  const whatsappUrl =
    "https://wa.me/" + phone + "?text=" + message;

  window.location.href = whatsappUrl;

}

document
  .getElementById("search")
  .addEventListener(
    "input",
    renderProducts
  );

document
  .getElementById("category")
  .addEventListener(
    "change",
    renderProducts
  );

renderProducts();

</script>

  <section id="adminPanel" style="display:none;margin:30px auto;max-width:1100px;padding:24px;border:1px solid #31384d;border-radius:18px;background:#101522;color:#fff">
    <div style="display:flex;justify-content:space-between;gap:15px;align-items:center;flex-wrap:wrap">
      <div>
        <div style="color:#22d3ee;font-size:12px;font-weight:700;text-transform:uppercase">Panel privado · Brayan admin</div>
        <h2 style="margin-top:6px">🤖 Bot de números ficticios</h2>
        <p style="color:#9ba5ba;margin-top:7px">Generador local de datos de prueba. No está conectado a telefonía, SMS ni WhatsApp.</p>
      </div>
      <button id="adminLogout" style="padding:10px 14px;border:0;border-radius:10px;cursor:pointer">Cerrar sesión</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:20px">
      <div style="padding:14px;border-radius:12px;background:#0b0f18"><div style="color:#8d98ae;font-size:12px">Generados</div><strong id="fakeCount" style="font-size:25px">0</strong></div>
      <div style="padding:14px;border-radius:12px;background:#0b0f18"><div style="color:#8d98ae;font-size:12px">Estado</div><strong id="autoState">Pausado</strong></div>
      <div style="padding:14px;border-radius:12px;background:#0b0f18"><div style="color:#8d98ae;font-size:12px">Modo</div><strong>Ficticio</strong></div>
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">
      <select id="fakeCountry" style="padding:10px;border-radius:10px;border:1px solid #3a4257;background:#0b0f18;color:#fff">
        <option value="US">🇺🇸 Estados Unidos</option>
        <option value="GB">🇬🇧 Reino Unido</option>
        <option value="ES">🇪🇸 España</option>
      </select>
      <select id="fakeSpeed" style="padding:10px;border-radius:10px;border:1px solid #3a4257;background:#0b0f18;color:#fff">
        <option value="1">Cada 1 segundo</option>
        <option value="3" selected>Cada 3 segundos</option>
        <option value="5">Cada 5 segundos</option>
        <option value="10">Cada 10 segundos</option>
      </select>
      <button id="generateFake" style="padding:10px 16px;border:0;border-radius:10px;cursor:pointer">⚡ Generar</button>
      <button id="toggleAuto" style="padding:10px 16px;border:0;border-radius:10px;cursor:pointer">▶ Automático</button>
      <button id="clearHistory" style="padding:10px 16px;border:0;border-radius:10px;cursor:pointer">🗑 Limpiar</button>
    </div>

    <div id="fakeOutput" style="margin-top:22px;padding:20px;border-radius:14px;background:#0b0f18;font-size:28px;font-weight:800;text-align:center">Listo para generar</div>
    <div style="margin-top:18px;color:#9ba5ba"><b>Historial reciente</b></div>
    <div id="fakeHistory" style="margin-top:8px;color:#dbe1ee;line-height:1.7"><span style="opacity:.65">Todavía no hay números generados.</span></div>
    <p style="margin-top:18px;color:#778198;font-size:13px">Todos los valores son ficticios y están diseñados únicamente para pruebas y demostraciones.</p>
  </section>

  <section id="adminLogin" style="margin:30px auto;max-width:1100px;padding:20px;border:1px solid #252b3d;border-radius:18px;background:#0d121e;color:#fff">
    <button id="adminLoginBtn" style="padding:10px 16px;border:0;border-radius:10px;cursor:pointer">🔐 Acceso administrador</button>
    <span id="adminStatus" style="margin-left:10px;color:#9ba5ba">Inicia sesión para comprobar el acceso.</span>
  </section>


<script>
/*
  Acceso rápido de administrador:
  - Si Firebase Authentication detecta que la cuenta es brayanytu19@gmail.com,
    muestra automáticamente el panel.
  - Para seguridad real, el backend/Firebase Rules debe seguir comprobando
    el custom claim admin:true.
*/
(function () {
  const ADMIN_EMAIL = "brayanytu19@gmail.com";

  function showAdminForGoogleAccount(user) {
    if (!user || !user.email) return false;
    if (user.email.toLowerCase() !== ADMIN_EMAIL) return false;

    document.documentElement.dataset.adminEmail = ADMIN_EMAIL;

    // Compatibilidad con paneles que usan estos nombres habituales.
    ["adminPanel", "admin-panel", "fake-number-bot", "adminSection"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = "";
        el.removeAttribute("aria-hidden");
      }
    });

    return true;
  }

  // Exponer una función para integrarla con onAuthStateChanged
  // si el archivo ya inicializa Firebase.
  window.enableBrayanAdminPanel = showAdminForGoogleAccount;
})();
</script>

</body>
</html>`;

app.get("/", (req,res) => res.type("html").send(INDEX_HTML));
app.get("/api/health", (req,res) => res.json({ok:true, service:"NovaMarket"}));

app.listen(PORT,"0.0.0.0",()=>console.log(`NovaMarket funcionando en el puerto ${PORT}`));
