// server.js — Servidor principal TATAMI
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARES ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones (en producción usar connect-sqlite3 o similar)
app.use(session({
  secret: 'tatami-jitsu-secret-2024-cambiar-en-produccion',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       // En producción con HTTPS: true
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 días
  }
}));

// Archivos estáticos (HTML, CSS, JS del frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ── RUTAS API ─────────────────────────────────────────────────
app.use('/api', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/usuarios', require('./routes/usuarios'));

// ── RUTAS DE PÁGINAS ──────────────────────────────────────────
// Todas las rutas del frontend las maneja el HTML estático
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/clases', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clases.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/seminarios', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'seminarios.html'));
});

app.get('/mestre', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mestre.html'));
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// ── INICIAR SERVIDOR ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║      TATAMI — Servidor iniciado        ║');
  console.log(`║   http://localhost:${PORT}               ║`);
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log('Páginas disponibles:');
  console.log(`  → Inicio:  http://localhost:${PORT}/`);
  console.log(`  → Clases:  http://localhost:${PORT}/clases`);
  console.log(`  → Admin:   http://localhost:${PORT}/admin`);
  console.log('');
});
