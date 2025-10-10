/**
 * Middleware de gestion des erreurs
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Erreur Prisma
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      error: 'Erreur de base de données',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Erreur de validation Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: err.errors,
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur interne',
  });
}


