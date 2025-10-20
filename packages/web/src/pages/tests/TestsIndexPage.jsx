import { Link } from 'react-router-dom';

/**
 * Page d'index pour toutes les pages de test
 * Accessible via /tests
 */
export default function TestsIndexPage() {
  const testPages = [
    {
      path: '/tests/onboarding',
      title: 'Onboarding V1 (Original)',
      description: 'Carousel d\'introduction avec layout superposé',
      icon: '🦉',
      status: '✅ Prêt'
    },
    {
      path: '/tests/onboarding-v2',
      title: 'Onboarding V2 (Layout Adaptatif)',
      description: 'Layout tablette/PC côte à côte, mobile empilé',
      icon: '📱',
      status: '✅ Prêt'
    },
    // Ajouter d'autres pages de test ici
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🧪</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Pages de Test mOOtify</h1>
          <p className="text-lg text-gray-600">
            Collection de composants et fonctionnalités en cours de développement
          </p>
        </div>

        {/* Navigation retour */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <span>←</span>
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        {/* Liste des pages de test */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testPages.map((page, index) => (
            <Link
              key={index}
              to={page.path}
              className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-gray-100"
            >
              <div className="text-center space-y-4">
                <div className="text-4xl">{page.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800">{page.title}</h3>
                <p className="text-gray-600 text-sm">{page.description}</p>
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {page.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-12 p-6 bg-white/50 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ℹ️ Informations</h3>
          <div className="space-y-2 text-gray-600">
            <p>• Ces pages sont destinées au développement et aux tests</p>
            <p>• Elles ne sont pas accessibles en production</p>
            <p>• Utilisez-les pour tester les nouveaux composants</p>
            <p>• N'hésitez pas à ajouter de nouvelles pages de test</p>
          </div>
        </div>
      </div>
    </div>
  );
}
