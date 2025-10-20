import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function Nav() {
  const { user } = useAuth(); // read auth state from Firebase
  const navigate = useNavigate();
  const [logoutMenuOpen, setLogoutMenuOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      setLogoutMenuOpen(false); // 👈 Close the dropdown immediately
      await signOut(auth);
      navigate("/login", { replace: true }); // ✅ Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="flex gap-5 justify-between fixed z-40 items-center text-white right-0 m-20">
      {/* Button 1 */}
      <button className="transition-all w-8 fill-[var(--secondary)] hover:fill-[var(--primary)] hover:scale-110">
        <svg
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 57 54.87"
        >
          <path d="M53.58,12.7c-2.29-4.14-5.57-7.3-9.84-9.45-4.28-2.17-9.37-3.25-15.27-3.25C19.59,0,12.64,2.42,7.58,7.28,2.53,12.12,0,18.84,0,27.44s2.53,15.3,7.58,20.16c5.06,4.85,12.01,7.27,20.89,7.27s15.85-2.42,20.92-7.27c5.08-4.86,7.61-11.58,7.61-20.16,0-5.68-1.13-10.59-3.42-14.74ZM31.87,38.41c-1.15,1.19-2.5,2.24-4.06,3.15-1.57.92-2.9,1.37-4.02,1.37-.77,0-1.47-.29-2.09-.88-.62-.59-.92-1.19-.92-1.81,0-.37.07-.72.23-1.07l3.43-8.12,1.16-2.87c.06-.16,0-.23-.18-.23-.28,0-.62.1-1.02.3-.41.2-.76.38-1.05.55-.29.17-.53.32-.72.44-.25.16-.48.24-.69.24-.38,0-.56-.22-.56-.65,0-.4.56-1.09,1.67-2.04,1.11-.96,2.38-1.91,3.8-2.86,1.43-.94,2.51-1.54,3.25-1.79.25-.06.45-.09.61-.09.58,0,1.14.21,1.67.63.52.42.79.87.79,1.37l-.1.37-5.1,12.71c-.06.13-.09.31-.09.56,0,.22.07.32.23.32.31,0,1-.36,2.09-1.09,1.08-.72,1.93-1.39,2.55-2.01.09-.1.15-.14.18-.14.19,0,.34.07.47.23.12.15.18.32.18.51,0,.74-.57,1.71-1.71,2.9ZM35.02,17.78c-.8.81-1.76,1.21-2.88,1.21-.71,0-1.32-.28-1.83-.84-.51-.55-.76-1.2-.76-1.94,0-1.15.4-2.15,1.2-3,.81-.85,1.8-1.27,2.97-1.27.74,0,1.35.31,1.81.92.47.62.7,1.32.7,2.09,0,1.09-.4,2.03-1.21,2.83Z" />
        </svg>
      </button>

      {/* Button 2 */}
      <button className="transition-all w-8 fill-[var(--secondary)] hover:fill-[var(--primary)] hover:scale-110">
        <svg
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 52.71 54.87"
        >
          <path d="M46.63,27.43c0-1.36-.1-2.65-.28-3.89l6.36-5.32-5.19-9-7.56,2.76c-.85-.66-1.76-1.25-2.76-1.75-1.27-.65-2.65-1.15-4.12-1.52l-1.53-8.71h-10.39l-1.52,8.69c-2.63.67-4.92,1.76-6.88,3.29l-7.56-2.76L0,18.22l6.36,5.32c-.18,1.24-.28,2.53-.28,3.89s.1,2.66.28,3.9l-6.36,5.32,5.2,9,7.56-2.76c1.96,1.52,4.25,2.62,6.88,3.29l1.52,8.69h10.39l1.53-8.71c2.62-.66,4.9-1.76,6.85-3.28l7.59,2.77,5.19-9-6.36-5.33c.18-1.23.28-2.52.28-3.89ZM31.58,32.47c-1.27,1.22-3.01,1.82-5.23,1.82s-3.96-.6-5.22-1.82c-1.27-1.21-1.9-2.89-1.9-5.04s.63-3.82,1.9-5.04c1.26-1.21,3-1.81,5.22-1.81,1.47,0,2.75.27,3.82.81,1.06.54,1.88,1.33,2.46,2.36.57,1.04.85,2.27.85,3.68,0,2.15-.63,3.83-1.9,5.04Z" />
        </svg>
      </button>

      {/* Logout dropdown */}
      <div className="relative">
        {/* Logout icon */}
        <button
          onClick={() => setLogoutMenuOpen((prev) => !prev)}
          className="transition-all w-8 fill-[var(--secondary)] hover:fill-[var(--primary)] hover:scale-110"
        >
          <svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 49 54.87"
          >
            <path d="M36.21,5.93c-1.07-1.94-2.6-3.41-4.6-4.42-2-1.01-4.38-1.52-7.13-1.52-4.14,0-7.39,1.13-9.76,3.4-2.36,2.26-3.54,5.4-3.54,9.42s1.18,7.15,3.54,9.42c2.36,2.27,5.61,3.4,9.76,3.4s7.4-1.13,9.77-3.4c2.37-2.27,3.55-5.41,3.55-9.42,0-2.65-.53-4.94-1.6-6.88Z" />
            <path d="M49,54.87c0-4.88-.98-9.1-2.95-12.66s-4.79-6.28-8.46-8.13c-3.68-1.86-8.06-2.79-13.12-2.79-7.63,0-13.61,2.08-17.95,6.25C2.17,41.7,0,47.48,0,54.87h49Z" />
          </svg>
        </button>

        {/* Slide-down menu */}
        <div
          className={`absolute right-0 mt-2 bg-[var(--bg-dark)] border border-[var(--primary)] rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 origin-top ${
            logoutMenuOpen
              ? "opacity-100 scale-y-100"
              : "opacity-0 scale-y-0 pointer-events-none"
          }`}
        >
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--primary)] hover:text-black transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
