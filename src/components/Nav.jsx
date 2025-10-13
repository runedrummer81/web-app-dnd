// Nav.jsx
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../hooks/useAuth";

export default function Nav() {
  const { user } = useAuth(); // read auth state from Firebase

  // Only show Nav if a user is logged in
  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
    // no need to update local state — useAuth() will re-render Nav automatically
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div className="font-bold text-xl">Dungeon Master Tools</div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
      >
        Logout
      </button>
    </nav>
  );
}
