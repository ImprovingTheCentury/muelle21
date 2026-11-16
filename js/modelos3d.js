/* ════════════════════════════════════════════════════════
   MUELLE 21 — modelos3d.js
   Archivos 3D: banner → lista (con fotos) → detalle con descargas.
   Funciona igual que las ofertas: todo dentro de la misma página
   y con el botón "atrás" funcionando.

   IMPORTANTE: MODELOS_EJEMPLO son datos de PRUEBA (los archivos
   no existen todavía). Para agregar un modelo real:
     1. Poné los archivos (.stl / .3mf) y la foto en la carpeta /modelos
     2. Copiá un bloque de la lista de abajo y cambiá los datos
════════════════════════════════════════════════════════ */
(function () {

  const MODELOS_EJEMPLO = [
    {
      id: 'ej-organizador',
      nombre: 'Organizador de escritorio',
      descripcion: 'Organizador para lápices y accesorios. Se imprime sin soportes.',
      fotos: [],   // ej: ['modelos/organizador.jpg']
      archivos: [
        { etiqueta: 'STL', url: 'modelos/ejemplo-organizador.stl' },
        { etiqueta: '3MF', url: 'modelos/ejemplo-organizador.3mf' }
      ],
      detalles: [
        { k: 'Material', v: 'PLA' },
        { k: 'Tiempo aproximado', v: '3 horas' },
        { k: 'Soportes', v: 'No necesita' }
      ]
    },
    {
      id: 'ej-percha',
      nombre: 'Percha para exhibir ropa',
      descripcion: 'Percha para exhibir prendas en el local.',
      fotos: [],
      archivos: [
        { etiqueta: 'STL', url: 'modelos/ejemplo-percha.stl' }
      ],
      detalles: [
        { k: 'Material', v: 'PETG o PLA' },
        { k: 'Tiempo aproximado', v: '1 hora 30 min' }
      ]
    }
  ];

  /* Todo se arma con textContent (nunca innerHTML con datos). */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function foto(src, alt, className) {
    const box = el('div', className);
    if (src) {
      const img = el('img');
      img.src = src;
      img.alt = alt;
      img.loading = 'lazy';
      box.appendChild(img);
    } else {
      box.classList.add('ov-ph');
      box.appendChild(el('span', 'ov-ph-text', '3D'));
    }
    return box;
  }

  function iniciar(lista) {
    const banner   = document.getElementById('archivos-3d');
    const overlay  = document.getElementById('modelos-view');
    const body     = document.getElementById('m-body');
    const backBtn  = document.getElementById('m-back');
    const backLbl  = document.getElementById('m-back-label');
    const barTitle = document.getElementById('m-bar-title');
    const openBtn  = document.getElementById('btn-ver-modelos');
    if (!banner || !overlay || !body || !backBtn || !openBtn) return;

    banner.hidden = lista.length === 0;
    let listScroll = 0;

    function showList() {
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      body.replaceChildren();
      backLbl.textContent = 'Volver';
      barTitle.textContent = 'Archivos 3D';

      const wrap = el('div', 'ov-wrap');
      wrap.appendChild(el('h2', 'ov-title', 'Archivos 3D'));
      wrap.appendChild(el('p', 'ov-sub', 'Tocá un modelo para ver más fotos y descargar los archivos.'));

      const grid = el('div', 'ov-grid');
      lista.forEach(m => {
        const card = el('button', 'ov-card');
        card.type = 'button';

        const imgBox = foto(m.fotos && m.fotos[0], m.nombre, 'ov-card-img');
        imgBox.appendChild(el('span', 'ov-card-badge', '3D'));

        const info = el('div', 'ov-card-info');
        info.appendChild(el('div', 'ov-card-name', m.nombre));
        if (m.archivos && m.archivos.length) {
          info.appendChild(el('div', 'ov-card-formats', m.archivos.map(a => a.etiqueta).join(' · ')));
        }

        card.appendChild(imgBox);
        card.appendChild(info);
        card.addEventListener('click', () => {
          listScroll = overlay.scrollTop;
          history.pushState({ m: true }, '', '#modelo-' + encodeURIComponent(m.id));
          route();
        });
        grid.appendChild(card);
      });
      wrap.appendChild(grid);
      body.appendChild(wrap);

      overlay.scrollTop = listScroll;
      backBtn.focus({ preventScroll: true });
    }

    function showDetail(m) {
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      body.replaceChildren();
      backLbl.textContent = 'Archivos 3D';
      barTitle.textContent = m.nombre;

      const wrap = el('div', 'ov-wrap ov-detail');

      // Fotos
      const gallery = el('div', 'ov-gallery');
      const fotos = m.fotos || [];
      const main = foto(fotos[0], m.nombre, 'ov-main-img');
      gallery.appendChild(main);
      if (fotos.length > 1) {
        const mainImg = main.querySelector('img');
        const thumbs = el('div', 'ov-thumbs');
        fotos.forEach((src, i) => {
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
      info.appendChild(el('span', 'oferta-tag', 'Archivo 3D'));
      info.appendChild(el('h2', 'ov-name', m.nombre));
      if (m.descripcion) info.appendChild(el('p', 'ov-desc', m.descripcion));

      if (m.detalles && m.detalles.length) {
        info.appendChild(el('div', 'label ov-section-label', 'Detalles'));
        const det = el('div', 'ov-rows');
        m.detalles.forEach(d => {
          const row = el('div', 'ov-row');
          row.appendChild(el('span', 'ov-row-k', d.k));
          row.appendChild(el('span', 'ov-row-v', d.v));
          det.appendChild(row);
        });
        info.appendChild(det);
      }

      if (m.archivos && m.archivos.length) {
        info.appendChild(el('div', 'label ov-section-label', 'Descargas'));
        const dl = el('div', 'ov-downloads');
        m.archivos.forEach(a => {
          const link = el('a', 'ov-download', 'Descargar ' + a.etiqueta + ' ↓');
          link.href = a.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          dl.appendChild(link);
        });
        info.appendChild(dl);
      }

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

    function route() {
      const h = location.hash;
      if (h === '#modelos-3d') {
        showList();
      } else if (h.indexOf('#modelo-') === 0) {
        const id = decodeURIComponent(h.slice('#modelo-'.length));
        const m = lista.find(x => x.id === id);
        if (m) showDetail(m); else showList();
      } else {
        hideOverlay();
      }
    }

    function goBack() {
      if (overlay.hidden) return;
      if (history.state && history.state.m) {
        history.back();
      } else if (location.hash.indexOf('#modelo-') === 0) {
        history.replaceState(null, '', '#modelos-3d');
        route();
      } else {
        history.replaceState(null, '', location.pathname + location.search);
        route();
      }
    }

    openBtn.addEventListener('click', () => {
      history.pushState({ m: true }, '', '#modelos-3d');
      route();
    });
    backBtn.addEventListener('click', goBack);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') goBack(); });
    window.addEventListener('popstate', route);

    route();
  }

  // Los modelos reales los carga js/firebase-ofertas.js (desde la app).
  // Para ver los de prueba: iniciarModelos3D(MODELOS_EJEMPLO) desde esta misma función.
  window.iniciarModelos3D = iniciar;
})();
