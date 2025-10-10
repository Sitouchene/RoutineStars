import { verifyToken } from '../config/jwt.js';

/**
 * Middleware d'authentification
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }

  req.user = decoded;
  next();
}

/**
 * Middleware pour vérifier le rôle parent
 */
export function requireParent(req, res, next) {
  if (req.user.role !== 'parent') {
    return res.status(403).json({ error: 'Accès réservé aux parents' });
  }
  next();
}

/**
 * Middleware pour vérifier le rôle enfant
 */
export function requireChild(req, res, next) {
  if (req.user.role !== 'child') {
    return res.status(403).json({ error: 'Accès réservé aux enfants' });
  }
  next();
}


