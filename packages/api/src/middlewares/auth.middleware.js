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

  // Mapper les propriétés du token vers req.user
  req.user = {
    id: decoded.userId,
    groupId: decoded.groupId || decoded.familyId, // Support des deux pour la transition
    familyId: decoded.familyId || decoded.groupId, // Support des deux pour la transition
    role: decoded.role,
  };
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
 * Middleware pour vérifier le rôle parent ou enseignant (administrateurs de groupe)
 */
export function requireParentOrTeacher(req, res, next) {
  if (req.user.role !== 'parent' && req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Accès réservé aux parents et enseignants' });
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

/**
 * Middleware pour vérifier le rôle enfant ou élève (membres de groupe)
 */
export function requireChildOrStudent(req, res, next) {
  if (req.user.role !== 'child' && req.user.role !== 'student') {
    return res.status(403).json({ error: 'Accès réservé aux enfants et élèves' });
  }
  next();
}


