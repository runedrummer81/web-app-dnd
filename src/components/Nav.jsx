// Nav.jsx
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function Nav() {
  const { user } = useAuth(); // read auth state from Firebase
  const navigate = useNavigate();

  // Only show Nav if a user is logged in
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true }); // ✅ Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="flex justify-between min-w-screen fixed z-40 items-center text-white p-20 pointer-events-none">
      <div className="font-bold text-xl pointer-events-auto">
        Dungeon Master Tools
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition-all pointer-events-auto"
      >
        Logout
      </button>
    </nav>
  );
}
