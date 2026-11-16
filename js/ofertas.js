/* ════════════════════════════════════════════════════════
   MUELLE 21 — ofertas.js
   Ofertas especiales: banner → lista → detalle del producto.
   Todo pasa dentro de la misma página (sin recargar), y el botón
   "atrás" del celular/navegador funciona: detalle → lista → página.

   IMPORTANTE: OFERTAS_EJEMPLO son datos de PRUEBA.
   Más adelante las ofertas van a venir de la app (Firebase) y se
   le pasan a iniciarOfertas(lista) con esta misma forma de datos.
════════════════════════════════════════════════════════ */

const WA_NUMERO = '5493564507659';

const OFERTAS_EJEMPLO = [
  {
    id: 'ej1',
    nombre: 'Remera básica algodón',
    precio: 4500,
    precioAnterior: 6000,
    fotos: ['assets/essentials.webp'],
    descripcion: 'Remera lisa de algodón, ideal para reventa. Oferta por bulto.',
    detalles: [
      { k: 'Medidas', v: 'Largo 68 cm · Ancho 50 cm (talle M)' },
      { k: 'Material', v: '100% algodón' },
      { k: 'Venta', v: 'Por bulto de 12 unidades' }
    ],
    stock: [
      { talle: 'S', color: 'Blanco', cantidad: 24 },
      { talle: 'M', color: 'Blanco', cantidad: 36 },
      { talle: 'L', color: 'Negro', cantidad: 12 },
      { talle: 'XL', color: 'Negro', cantidad: 0 }
    ]
  },
  {
    id: 'ej2',
    nombre: 'Jean denim clásico',
    precio: 14500,
    precioAnterior: 18000,
    fotos: ['assets/denim.jpg'],
    descripcion: 'Jean de corte recto. Últimas docenas con precio especial.',
    detalles: [
      { k: 'Medidas', v: 'Cintura 40 cm · Largo 100 cm (talle 42)' },
      { k: 'Material', v: 'Denim 98% algodón, 2% elastano' },
      { k: 'Venta', v: 'Por docena' }
    ],
    stock: [
      { talle: '40', color: 'Azul', cantidad: 6 },
      { talle: '42', color: 'Azul', cantidad: 3 },
      { talle: '44', color: 'Azul', cantidad: 8 }
    ]
  },
  {
    id: 'ej3',
    nombre: 'Conjunto deportivo',
    precio: 12000,
    fotos: ['assets/lineadeportiva.webp'],
    descripcion: 'Conjunto deportivo para entrenar o uso diario.',
    detalles: [
      { k: 'Material', v: 'Friza liviana' },
      { k: 'Venta', v: 'Por lote' }
    ],
    stock: [
      { talle: 'M', color: 'Gris', cantidad: 10 },
      { talle: 'L', color: 'Gris', cantidad: 4 }
    ]
  },
  {
    id: 'ej4',
    nombre: 'Camisa smart casual',
    precio: 9800,
    precioAnterior: 12500,
    fotos: ['assets/smartcasual.jpg'],
    descripcion: 'Camisa para uso informal o de oficina.',
    detalles: [
      { k: 'Medidas', v: 'Largo 74 cm · Ancho 54 cm (talle L)' },
      { k: 'Venta', v: 'Por lote' }
    ],
    stock: [
      { talle: 'M', color: 'Celeste', cantidad: 5 },
      { talle: 'L', color: 'Celeste', cantidad: 7 }
    ]
  }
];


/* ── Helpers ────────────────────────────────────────────
   Todo se arma con textContent (nunca innerHTML con datos),
   así lo que venga de la app no puede romper la página.
────────────────────────────────────────────────────────── */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatearPrecio(n) {
  return '$ ' + Number(n).toLocaleString('es-AR');
}

function linkWhatsApp(nombre) {
  const msg = 'Hola, me interesa la oferta: ' + nombre;
  return 'https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(msg);
}


/* ── Lógica principal ─────────────────────────────────── */
function iniciarOfertas(lista) {
  const banner   = document.getElementById('ofertas');
  const overlay  = document.getElementById('ofertas-view');
  const body     = document.getElementById('ov-body');
  const backBtn  = document.getElementById('ov-back');
  const backLbl  = document.getElementById('ov-back-label');
  const barTitle = document.getElementById('ov-bar-title');
  const openBtn  = document.getElementById('btn-ver-ofertas');
  if (!banner || !overlay || !body || !backBtn || !openBtn) return;

  // Sin ofertas → el banner no se muestra
  banner.hidden = lista.length === 0;

  let listScroll = 0;  // para volver a la misma altura de la lista

  /* ---------- Lista de ofertas ---------- */
  function showList() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    body.replaceChildren();
    backLbl.textContent = 'Volver';
    barTitle.textContent = 'Ofertas especiales';

    const wrap = el('div', 'ov-wrap');
    wrap.appendChild(el('h2', 'ov-title', 'Ofertas especiales'));
    wrap.appendChild(el('p', 'ov-sub', 'Tocá un producto para ver stock, medidas y detalles.'));

    const grid = el('div', 'ov-grid');
    lista.forEach(o => {
      const card = el('button', 'ov-card');
      card.type = 'button';

      const imgBox = el('div', 'ov-card-img');
      const img = el('img');
      img.src = o.fotos[0];
      img.alt = o.nombre;
      img.loading = 'lazy';
      imgBox.appendChild(img);
      imgBox.appendChild(el('span', 'ov-card-badge', 'Oferta'));

      const info = el('div', 'ov-card-info');
      info.appendChild(el('div', 'ov-card-name', o.nombre));
      const price = el('div', 'ov-price');
      if (o.precio !== undefined) {
        price.appendChild(el('span', 'ov-price-now', formatearPrecio(o.precio)));
        if (o.precioAnterior) price.appendChild(el('span', 'ov-price-old', formatearPrecio(o.precioAnterior)));
      } else {
        price.appendChild(el('span', 'ov-price-now', 'Consultar precio'));
      }
      info.appendChild(price);

      card.appendChild(imgBox);
      card.appendChild(info);
      card.addEventListener('click', () => {
        listScroll = overlay.scrollTop;
        history.pushState({ o: true }, '', '#oferta-' + encodeURIComponent(o.id));
        route();
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    body.appendChild(wrap);

    overlay.scrollTop = listScroll;
    backBtn.focus({ preventScroll: true });
  }

  /* ---------- Detalle de un producto ---------- */
  function showDetail(o) {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    body.replaceChildren();
    backLbl.textContent = 'Ofertas';
    barTitle.textContent = o.nombre;

    const wrap = el('div', 'ov-wrap ov-detail');

    // Fotos
    const gallery = el('div', 'ov-gallery');
    const main = el('div', 'ov-main-img');
    const mainImg = el('img');
    mainImg.src = o.fotos[0];
    mainImg.alt = o.nombre;
    main.appendChild(mainImg);
    gallery.appendChild(main);
    if (o.fotos.length > 1) {
      const thumbs = el('div', 'ov-thumbs');
      o.fotos.forEach((src, i) => {
        const t = el('button', 'ov-thumb' + (i === 0 ? ' active' : ''));
        t.type = 'button';
        t.setAttribute('aria-label', 'Ver foto ' + (i + 1));
        const ti = el('img');
        ti.src = src;
        ti.alt = '';
        t.appendChild(ti);
        t.addEventListener('click', () => {
          mainImg.src = src;
          thumbs.querySelectorAll('.ov-thumb').forEach(x => x.classList.remove('active'));
          t.classList.add('active');
        });
        thumbs.appendChild(t);
      });
      gallery.appendChild(thumbs);
    }

    // Información
    const info = el('div', 'ov-info');
    info.appendChild(el('span', 'oferta-tag', 'Oferta'));
    info.appendChild(el('h2', 'ov-name', o.nombre));

    const price = el('div', 'ov-price ov-price-big');
    if (o.precio !== undefined) {
      price.appendChild(el('span', 'ov-price-now', formatearPrecio(o.precio)));
      if (o.precioAnterior) price.appendChild(el('span', 'ov-price-old', formatearPrecio(o.precioAnterior)));
    } else {
      price.appendChild(el('span', 'ov-price-now', 'Consultar precio'));
    }
    info.appendChild(price);

    if (o.descripcion) info.appendChild(el('p', 'ov-desc', o.descripcion));

    // Stock
    if (o.stock && o.stock.length) {
      info.appendChild(el('div', 'label ov-section-label', 'Stock disponible'));
      const stock = el('div', 'ov-rows');
      o.stock.forEach(s => {
        const row = el('div', 'ov-row');
        const nombre = [s.talle ? 'Talle ' + s.talle : '', s.color || ''].filter(Boolean).join(' · ');
        row.appendChild(el('span', 'ov-row-k', nombre));
        const hay = Number(s.cantidad) > 0;
        row.appendChild(el('span', 'ov-row-v' + (hay ? '' : ' ov-agotado'), hay ? s.cantidad + ' u.' : 'Sin stock'));
        stock.appendChild(row);
      });
      info.appendChild(stock);
    }

    // Detalles (medidas, material, etc.)
    if (o.detalles && o.detalles.length) {
      info.appendChild(el('div', 'label ov-section-label', 'Detalles'));
      const det = el('div', 'ov-rows');
      o.detalles.forEach(d => {
        const row = el('div', 'ov-row');
        row.appendChild(el('span', 'ov-row-k', d.k));
        row.appendChild(el('span', 'ov-row-v', d.v));
        det.appendChild(row);
      });
      info.appendChild(det);
    }

    const cta = el('a', 'btn-wa ov-cta', 'Consultar por WhatsApp');
    cta.href = linkWhatsApp(o.nombre);
    cta.target = '_blank';
    cta.rel = 'noopener';
    info.appendChild(cta);

    wrap.appendChild(gallery);
    wrap.appendChild(info);
    body.appendChild(wrap);

    overlay.scrollTop = 0;
    backBtn.focus({ preventScroll: true });
  }

  function hideOverlay() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    listScroll = 0;
  }

  /* ---------- Navegación (la dirección # manda) ---------- */
  function route() {
    const h = location.hash;
    if (h === '#ofertas-especiales') {
      showList();
    } else if (h.indexOf('#oferta-') === 0) {
      const id = decodeURIComponent(h.slice('#oferta-'.length));
      const o = lista.find(x => x.id === id);
      if (o) showDetail(o); else showList();
    } else {
      hideOverlay();
    }
  }

  function goBack() {
    if (overlay.hidden) return;
    if (history.state && history.state.o) {
      history.back();                       // caso normal
    } else if (location.hash.indexOf('#oferta-') === 0) {
      history.replaceState(null, '', '#ofertas-especiales');  // entró directo al detalle
      route();
    } else {
      history.replaceState(null, '', location.pathname + location.search);
      route();
    }
  }

  openBtn.addEventListener('click', () => {
    history.pushState({ o: true }, '', '#ofertas-especiales');
    route();
  });
  backBtn.addEventListener('click', goBack);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') goBack(); });
  window.addEventListener('popstate', route);

  route();  // por si alguien abre un link directo a una oferta
}

/* Las ofertas reales las carga js/firebase-ofertas.js (desde la app).
   Para volver a ver las de prueba, usar: iniciarOfertas(OFERTAS_EJEMPLO) */
