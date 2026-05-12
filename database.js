// database.js — Base de datos JSON (sin compilación nativa)
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'tatami.db.json');

function crearBD() {
  return { usuarios: [], videos: [], progreso: [], _counters: { usuarios: 0, videos: 0, progreso: 0 } };
}

function cargar() {
  if (fs.existsSync(DB_PATH)) {
    try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
    catch (e) { console.error('Error leyendo BD, creando nueva...'); }
  }
  return crearBD();
}

function guardar(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

let bd = cargar();

// Datos iniciales
if (bd.usuarios.length === 0) {
  bd.usuarios.push({ id: ++bd._counters.usuarios, nombre: 'Administrador', username: 'admin', password: bcrypt.hashSync('admin123', 10), nivel: 3, estado: 'activo', notas: '', progreso: 0, ultimo_video: '—', es_admin: true, creado_en: new Date().toISOString() });
  bd.usuarios.push({ id: ++bd._counters.usuarios, nombre: 'Marcos Rodríguez', username: 'marcos_r', password: bcrypt.hashSync('alumno123', 10), nivel: 1, estado: 'activo', notas: '', progreso: 0, ultimo_video: '—', es_admin: false, creado_en: new Date().toISOString() });
  console.log('✓ Usuarios creados → admin/admin123 | marcos_r/alumno123');
}

if (bd.videos.length === 0) {
  const vids = [
    ['01','Caída Técnica y Rodada','Base de toda defensa en el suelo. Técnica de caída sin golpe y rodada de escape.',1,'8 min',null,''],
    ['02','Posición de Guardia Cerrada','Control desde abajo. Cómo mantener al rival dentro y preparar el ataque.',1,'10 min',3,'Cómo Pasar la Guardia'],
    ['03','Cómo Pasar la Guardia','Técnicas de apertura y pasaje. Correlativo al video 02.',1,'11 min',2,'Posición de Guardia Cerrada'],
    ['04','Llave de Brazo — Juji Gatame','Ejecución desde guardia. Control de caderas y finalización.',1,'12 min',5,'Escapar del Juji Gatame'],
    ['05','Escapar del Juji Gatame','Defensa y salida del juji. El escape más importante del nivel 1.',1,'9 min',4,'Llave de Brazo — Juji Gatame'],
    ['06','Triángulo desde Guardia','Ataque con piernas al cuello. Setup y finalización.',1,'13 min',7,'Defensa del Triángulo'],
    ['07','Defensa del Triángulo','Cómo salir del triángulo antes y después de que cierren.',1,'10 min',6,'Triángulo desde Guardia'],
  ];
  vids.forEach(([num,title,descripcion,nivel,duracion,pair_id,pair_label]) => {
    bd.videos.push({ id: ++bd._counters.videos, num, title, descripcion, nivel, duracion, vimeo_id: '', pair_id, pair_label, estado: 'publicado', creado_en: new Date().toISOString() });
  });
  console.log('✓ Videos iniciales cargados');
}

guardar(bd);

const db = {
  getUsuario: (username) => bd.usuarios.find(u => u.username === username),
  getUsuarioPorId: (id) => bd.usuarios.find(u => u.id === id),
  getAlumnos: () => bd.usuarios.filter(u => !u.es_admin),
  crearUsuario: (data) => {
    if (bd.usuarios.find(u => u.username === data.username)) return null;
    const user = { id: ++bd._counters.usuarios, ...data, progreso: 0, ultimo_video: '—', creado_en: new Date().toISOString() };
    bd.usuarios.push(user); guardar(bd); return user;
  },
  actualizarUsuario: (id, data) => {
    const idx = bd.usuarios.findIndex(u => u.id === id);
    if (idx === -1) return null;
    bd.usuarios[idx] = { ...bd.usuarios[idx], ...data }; guardar(bd); return bd.usuarios[idx];
  },
  eliminarUsuario: (id) => { bd.usuarios = bd.usuarios.filter(u => u.id !== id); guardar(bd); },

  getVideos: (soloPublicados = true) => {
    const lista = soloPublicados ? bd.videos.filter(v => v.estado === 'publicado') : bd.videos;
    return lista.sort((a, b) => parseInt(a.num) - parseInt(b.num));
  },
  getVideoPorId: (id) => bd.videos.find(v => v.id === id),
  crearVideo: (data) => {
    if (!data.num) { const max = bd.videos.reduce((m, v) => Math.max(m, parseInt(v.num)||0), 0); data.num = String(max+1).padStart(2,'0'); }
    const video = { id: ++bd._counters.videos, ...data, creado_en: new Date().toISOString() };
    bd.videos.push(video); guardar(bd); return video;
  },
  actualizarVideo: (id, data) => {
    const idx = bd.videos.findIndex(v => v.id === id);
    if (idx === -1) return null;
    bd.videos[idx] = { ...bd.videos[idx], ...data }; guardar(bd); return bd.videos[idx];
  },
  eliminarVideo: (id) => { bd.videos = bd.videos.filter(v => v.id !== id); guardar(bd); },

  getProgreso: (usuarioId) => bd.progreso.filter(p => p.usuario_id === usuarioId),
  marcarCompletado: (usuarioId, videoId) => {
    const existe = bd.progreso.find(p => p.usuario_id === usuarioId && p.video_id === videoId);
    if (existe) { existe.completado = true; existe.visto_en = new Date().toISOString(); }
    else { bd.progreso.push({ id: ++bd._counters.progreso, usuario_id: usuarioId, video_id: videoId, completado: true, visto_en: new Date().toISOString() }); }
    guardar(bd);
  },
};

module.exports = db;
