import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While Firebase is checking the auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // If no user is logged in, redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the protected content
  return children;
}
