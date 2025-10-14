import { useState } from 'react';
import { useNavigationStore } from '../stores/navigationStore';
import { useAuthStore } from '../stores/authStore';

export default function NavigationTest() {
  const navigationStore = useNavigationStore();
  const authStore = useAuthStore();
  const [testResults, setTestResults] = useState([]);

  const runTests = () => {
    const results = [];
    
    // Test 1: Navigation Store
    results.push({
      test: 'Navigation Store - Language Selection',
      status: navigationStore.selectedLanguage ? '✅ PASS' : '❌ FAIL',
      details: `Language: ${navigationStore.selectedLanguage}`
    });

    results.push({
      test: 'Navigation Store - Mode Selection',
      status: navigationStore.selectedMode ? '✅ PASS' : '❌ FAIL',
      details: `Mode: ${navigationStore.selectedMode?.type || 'None'}`
    });

    results.push({
      test: 'Navigation Store - Role Selection',
      status: navigationStore.selectedRole ? '✅ PASS' : '❌ FAIL',
      details: `Role: ${navigationStore.selectedRole?.type || 'None'}`
    });

    // Test 2: Auth Store
    results.push({
      test: 'Auth Store - User State',
      status: authStore.user ? '✅ PASS' : '❌ FAIL',
      details: `User: ${authStore.user?.name || 'None'}`
    });

    results.push({
      test: 'Auth Store - Authentication',
      status: authStore.isAuthenticated ? '✅ PASS' : '❌ FAIL',
      details: `Authenticated: ${authStore.isAuthenticated}`
    });

    results.push({
      test: 'Auth Store - Group Info',
      status: authStore.group ? '✅ PASS' : '❌ FAIL',
      details: `Group: ${authStore.group?.name || 'None'}`
    });

    // Test 3: Context Methods
    const context = navigationStore.getCurrentContext();
    results.push({
      test: 'Navigation Store - Context',
      status: context ? '✅ PASS' : '❌ FAIL',
      details: `Context: ${JSON.stringify(context)}`
    });

    setTestResults(results);
  };

  const resetAll = () => {
    navigationStore.resetNavigation();
    authStore.logout();
    setTestResults([]);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Navigation Test Suite</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Navigation Store State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📱 Navigation Store</h2>
            <div className="space-y-2">
              <p><strong>Language:</strong> {navigationStore.selectedLanguage || 'None'}</p>
              <p><strong>Mode:</strong> {navigationStore.selectedMode?.type || 'None'}</p>
              <p><strong>Role:</strong> {navigationStore.selectedRole?.type || 'None'}</p>
              <p><strong>Can Proceed to Role:</strong> {navigationStore.canProceedToRoleSelection() ? '✅' : '❌'}</p>
              <p><strong>Can Proceed to Auth:</strong> {navigationStore.canProceedToAuth() ? '✅' : '❌'}</p>
            </div>
          </div>

          {/* Auth Store State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🔐 Auth Store</h2>
            <div className="space-y-2">
              <p><strong>Authenticated:</strong> {authStore.isAuthenticated ? '✅' : '❌'}</p>
              <p><strong>User:</strong> {authStore.user?.name || 'None'}</p>
              <p><strong>Role:</strong> {authStore.getCurrentRole() || 'None'}</p>
              <p><strong>Mode:</strong> {authStore.getCurrentMode()}</p>
              <p><strong>Group:</strong> {authStore.group?.name || 'None'}</p>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">🎮 Test Controls</h2>
          <div className="flex gap-4">
            <button
              onClick={runTests}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Run Tests
            </button>
            <button
              onClick={resetAll}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Reset All
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Test Results</h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{result.test}</span>
                    <span className="text-sm">{result.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">📋 Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Navigate to the welcome screen (/)</li>
            <li>Select a language (🇫🇷 Français)</li>
            <li>Select a mode (🏠 Maison or 🎓 École)</li>
            <li>Go to role selection screen</li>
            <li>Select a role (Parent/Child or Teacher/Student)</li>
            <li>Try authentication (use test data)</li>
            <li>Run tests to verify state</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
