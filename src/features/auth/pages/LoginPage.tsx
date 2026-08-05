import { signInWithGoogle } from "../../../services/firebase/auth";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) return <Navigate to="/dashboard" replace />;
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="px-6 py-3 rounded-lg bg-green-600 text-white"
      >
        Login with Google
      </button>
    </div>
  );
}

export default LoginPage;
