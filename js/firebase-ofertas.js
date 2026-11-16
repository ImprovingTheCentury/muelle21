/* ════════════════════════════════════════════════════════
   MUELLE 21 — firebase-ofertas.js
   Lee de Firebase (Firestore) las ofertas que se cargan desde la app
   y se las pasa a iniciarOfertas() (js/ofertas.js).
   Solo se piden las ofertas con "Mostrar en la web" activado.
   La config de Firebase no es secreta: los datos los protegen las reglas.
════════════════════════════════════════════════════════ */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getFirestore, collection, query, where, getDocs }
  from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCVLu5c0En6PEW_MdFDa3jaTB973T_9E4c',
  authDomain: 'tienda-8304a.firebaseapp.com',
  projectId: 'tienda-8304a',
  storageBucket: 'tienda-8304a.firebasestorage.app',
  messagingSenderId: '435049240164',
  appId: '1:435049240164:web:f814496661724bbdfa7171',
};

const texto = v => (typeof v === 'string' ? v.trim() : '');

/* Documento de Firestore → forma que usa ofertas.js */
function aOferta(id, d) {
  const fotos = (Array.isArray(d.fotos) ? d.fotos : [])
    .filter(f => typeof f === 'string' && f)
    .map(f => (f.startsWith('data:') ? f : 'data:image/jpeg;base64,' + f));
  if (!fotos.length || !texto(d.titulo)) return null;

  const detalles = [];
  [['Categoría', d.categoria], ['Género', d.genero], ['Marca', d.marca],
   ['Color', d.color], ['Tela', d.tela], ['Corte', d.corte]]
    .forEach(([k, v]) => { if (texto(v)) detalles.push({ k, v: texto(v) }); });
  (Array.isArray(d.medidas) ? d.medidas : []).forEach(m => {
    if (m && texto(m.nombre) && Number(m.cm) > 0) detalles.push({ k: texto(m.nombre), v: Number(m.cm) + ' cm' });
  });

  const stock = (Array.isArray(d.stock) ? d.stock : [])
    .filter(s => s && (texto(s.talle) || texto(s.color)))
    .map(s => ({ talle: texto(s.talle), color: texto(s.color), cantidad: Number(s.cantidad) || 0 }));

  return {
    id,
    nombre: texto(d.titulo),
    precio: typeof d.precio === 'number' ? d.precio : undefined,   // undefined = "Consultar precio"
    precioAnterior: typeof d.precioAnterior === 'number' ? d.precioAnterior : undefined,
    fotos,
    descripcion: texto(d.descripcion),
    detalles,
    stock,
    _fecha: d.fecha && d.fecha.toMillis ? d.fecha.toMillis() : 0,
  };
}

/* Documento de Firestore (modelos3d) → forma que usa modelos3d.js */
function aModelo(id, d) {
  const fotos = (Array.isArray(d.fotos) ? d.fotos : [])
    .filter(f => typeof f === 'string' && f)
    .map(f => (f.startsWith('data:') ? f : 'data:image/jpeg;base64,' + f));
  if (!fotos.length || !texto(d.titulo)) return null;
  const archivos = (Array.isArray(d.enlaces) ? d.enlaces : [])
    .filter(e => e && /^https?:\/\//i.test(texto(e.url)))   // solo links http(s)
    .map(e => ({ etiqueta: texto(e.nombre) || 'archivo', url: texto(e.url) }));
  return {
    id,
    nombre: texto(d.titulo),
    descripcion: texto(d.descripcion),
    fotos,
    archivos,
    detalles: [],
    _fecha: d.fecha && d.fecha.toMillis ? d.fecha.toMillis() : 0,
  };
}

async function cargarModelos(db) {
  try {
    const snap = await getDocs(query(collection(db, 'modelos3d'), where('activo', '==', true)));
    const lista = snap.docs.map(x => aModelo(x.id, x.data())).filter(Boolean)
      .sort((a, b) => b._fecha - a._fecha);   // los más nuevos primero
    iniciarModelos3D(lista);
  } catch (e) {
    console.error('No se pudieron cargar los modelos 3D', e);
    iniciarModelos3D([]);   // sin conexión: la sección queda oculta
  }
}

async function cargar() {
  const db = getFirestore(initializeApp(firebaseConfig));
  cargarModelos(db);
  try {
    const snap = await getDocs(query(collection(db, 'ofertas'), where('activa', '==', true)));
    const lista = snap.docs.map(x => aOferta(x.id, x.data())).filter(Boolean)
      .sort((a, b) => b._fecha - a._fecha);   // las más nuevas primero
    iniciarOfertas(lista);
  } catch (e) {
    console.error('No se pudieron cargar las ofertas', e);
    iniciarOfertas([]);   // sin conexión: el banner queda oculto
  }
}

cargar();
