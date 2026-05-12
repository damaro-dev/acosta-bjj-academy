// routes/usuarios.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../database');
const { requireAdmin } = require('../middleware/auth');

router.get('/', requireAdmin, (req, res) => {
  const alumnos = db.getAlumnos().map(({ password, ...u }) => u);
  res.json(alumnos);
});

router.post('/', requireAdmin, (req, res) => {
  const { nombre, username, password, nivel, estado, notas } = req.body;
  if (!nombre || !username || !password) return res.status(400).json({ error: 'Nombre, usuario y contraseña son obligatorios.' });

  const user = db.crearUsuario({
    nombre: nombre.trim(),
    username: username.trim().toLowerCase(),
    password: bcrypt.hashSync(password, 10),
    nivel: nivel || 1,
    estado: estado || 'activo',
    notas: notas || '',
    es_admin: false,
  });

  if (!user) return res.status(409).json({ error: 'Ese nombre de usuario ya existe.' });
  res.json({ ok: true, id: user.id });
});

router.put('/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, username, password, nivel, estado, notas } = req.body;
  const updates = { nombre, username: username.trim().toLowerCase(), nivel, estado, notas };
  if (password && password.length >= 6) updates.password = bcrypt.hashSync(password, 10);
  const result = db.actualizarUsuario(id, updates);
  if (!result) return res.status(404).json({ error: 'Alumno no encontrado.' });
  res.json({ ok: true });
});

router.patch('/:id/toggle', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const user = db.getUsuarioPorId(id);
  if (!user || user.es_admin) return res.status(404).json({ error: 'Alumno no encontrado.' });
  const nuevoEstado = user.estado === 'activo' ? 'inactivo' : 'activo';
  db.actualizarUsuario(id, { estado: nuevoEstado });
  res.json({ ok: true, estado: nuevoEstado });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const user = db.getUsuarioPorId(parseInt(req.params.id));
  if (!user || user.es_admin) return res.status(403).json({ error: 'No se puede eliminar.' });
  db.eliminarUsuario(parseInt(req.params.id));
  res.json({ ok: true });
});

module.exports = router;
