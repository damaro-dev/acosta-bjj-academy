// middleware/auth.js — Protege rutas que requieren login
function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'No autorizado. Por favor iniciá sesión.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'No autorizado.' });
  }
  if (!req.session.esAdmin) {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
  }
  next();
}

module.exports = { requireLogin, requireAdmin };
