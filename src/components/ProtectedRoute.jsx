import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-red-400">
        Please login to access this page.
      </p>
    );
  }

  return children;
}
