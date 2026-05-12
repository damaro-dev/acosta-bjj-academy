// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../database');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos.' });

  const user = db.getUsuario(username.trim().toLowerCase());
  if (!user || user.estado !== 'activo') return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
  if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });

  req.session.userId   = user.id;
  req.session.username = user.username;
  req.session.nombre   = user.nombre;
  req.session.nivel    = user.nivel;
  req.session.esAdmin  = user.es_admin === true;

  res.json({ ok: true, esAdmin: user.es_admin === true, nombre: user.nombre, nivel: user.nivel });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
  if (!req.session || !req.session.userId) return res.status(401).json({ logueado: false });
  res.json({ logueado: true, nombre: req.session.nombre, nivel: req.session.nivel, esAdmin: req.session.esAdmin });
});

module.exports = router;
