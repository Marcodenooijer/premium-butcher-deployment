import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import App from './App';

function AuthenticatedApp() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[oklch(0.35_0.12_15)] to-[oklch(0.25_0.08_15)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login />;
  }

  // Show profile page if authenticated
  return <App />;
}

export default AuthenticatedApp;
