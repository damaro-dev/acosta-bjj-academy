// routes/videos.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireLogin, requireAdmin } = require('../middleware/auth');

// Alumno — ver videos de su nivel
router.get('/', requireLogin, (req, res) => {
  const nivelUsuario = req.session.nivel;
  const progreso = db.getProgreso(req.session.userId);
  const videos = db.getVideos(true).map(v => ({
    ...v,
    completado: progreso.some(p => p.video_id === v.id && p.completado),
    locked: v.nivel > nivelUsuario,
    vimeo_id: v.nivel > nivelUsuario ? '' : v.vimeo_id,
  }));
  res.json(videos);
});

// Alumno — marcar completado
router.post('/:id/completar', requireLogin, (req, res) => {
  const videoId = parseInt(req.params.id);
  db.marcarCompletado(req.session.userId, videoId);

  const video = db.getVideoPorId(videoId);
  if (video) db.actualizarUsuario(req.session.userId, { ultimo_video: video.title });

  const total = db.getVideos(true).filter(v => v.nivel <= req.session.nivel).length;
  const completados = db.getProgreso(req.session.userId).filter(p => p.completado).length;
  const progreso = total > 0 ? Math.round((completados / total) * 100) : 0;
  db.actualizarUsuario(req.session.userId, { progreso });

  res.json({ ok: true, progreso });
});

// Admin — todos los videos
router.get('/admin/todos', requireAdmin, (req, res) => {
  res.json(db.getVideos(false));
});

// Admin — crear video
router.post('/', requireAdmin, (req, res) => {
  const { title, descripcion, nivel, duracion, vimeo_id, pair_id, pair_label, estado } = req.body;
  if (!title) return res.status(400).json({ error: 'El título es obligatorio.' });
  const video = db.crearVideo({ title, descripcion: descripcion||'', nivel: nivel||1, duracion: duracion||'', vimeo_id: vimeo_id||'', pair_id: pair_id||null, pair_label: pair_label||'', estado: estado||'publicado' });
  res.json({ ok: true, id: video.id });
});

// Admin — editar video
router.put('/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const { title, descripcion, nivel, duracion, vimeo_id, pair_id, pair_label, estado } = req.body;
  const result = db.actualizarVideo(id, { title, descripcion, nivel, duracion, vimeo_id, pair_id: pair_id||null, pair_label: pair_label||'', estado });
  if (!result) return res.status(404).json({ error: 'Video no encontrado.' });
  res.json({ ok: true });
});

// Admin — eliminar video
router.delete('/:id', requireAdmin, (req, res) => {
  db.eliminarVideo(parseInt(req.params.id));
  res.json({ ok: true });
});

module.exports = router;
