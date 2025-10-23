import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import HomePage from "./HomePage";
import { useAuth } from "../hooks/useAuth";
import { HiEye, HiEyeOff } from "react-icons/hi";
import EmberAnimation from "../components/EmberAnimation";
import { useState, useEffect } from "react";

// Friendly Firebase error messages
function formatError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/wrong-password":
      return "Incorrect password. Try again.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function Login() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 40;
      const y = (e.clientY - innerHeight / 2) / 40;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");

    if (password.length < 6 && isSignup) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(formatError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setResetMessage("");
    if (!email) {
      setError("Please enter your email to reset your magical key.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("A mystical reset scroll has been sent to your inbox!");
    } catch (err) {
      setError(formatError(err.code));
    }
  };

  if (user) return <HomePage />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--dark-muted-bg)] relative overflow-hidden p-4">
      {/* Ember particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <EmberAnimation count={30} />
      </div>
      <div className="z-10">
        <div
          className="relative w-60 mb-10 mx-auto transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 335 386.78">
            <>
              <g
                style={{
                  transform: `translate(${offset.x * 0.8}px, ${
                    offset.y * 0.8
                  }px)`,
                  transition: "transform 0.2s ease-out",
                }}
              >
                <circle
                  cx="167.5"
                  cy="200"
                  r="120"
                  className="fill-[var(--dark-muted-bg)] "
                />
                <path
                  d="M335,290.09c-19.51-11.27-29.29-39.09-34.01-63.32-1.07-12.2,4.41-25.9,21.03-33.37-16.72-7.52-22.18-21.34-21.02-33.6h0c4.73-24.19,14.52-51.89,33.97-63.13-19.52,11.28-48.51,5.83-71.86-2.22-11.09-5.18-20.2-16.77-18.36-34.89-14.85,10.7-29.52,8.54-39.55,1.44-18.6-16.19-37.73-38.53-37.73-61,0,22.5-19.17,44.86-37.79,61.06-10.03,7.05-24.66,9.17-39.46-1.5,1.85,18.24-7.39,29.87-18.59,35h0c-23.31,8-52.19,13.39-71.64,2.16,19.5,11.26,29.28,39.08,33.99,63.32,1.06,12.2-4.43,25.88-21.03,33.35,16.72,7.52,22.18,21.34,21.02,33.6h0c-4.73,24.19-14.51,51.89-33.97,63.12,19.52-11.26,48.52-5.81,71.87,2.23,11.09,5.18,20.19,16.77,18.35,34.88,14.85-10.71,29.53-8.54,39.57-1.43,18.59,16.19,37.71,38.52,37.71,60.99,0-22.52,19.22-44.9,37.86-61.1,10.03-7.02,24.63-9.11,39.4,1.54-1.84-18.19,7.35-29.81,18.51-34.96,23.33-8.02,52.26-13.44,71.74-2.18ZM274.01,223.62c-10.21-3.14-21.23,2.01-28.14,15.03-7.82,12.5-6.77,24.62,1.05,31.89h0c-9.66,6.83-23.51,6.13-37.05-3.63,1.68,16.56-4.6,28.88-15.29,33.86,0,0,0,0,0,0-2.38-10.41-12.36-17.38-27.09-16.86-14.73-.52-24.71,6.45-27.09,16.86h0c-10.75-4.95-17.06-17.3-15.38-33.9-13.5,9.73-27.31,10.46-36.97,3.69,0,0,0,0,0,0,7.83-7.27,8.87-19.39,1.05-31.89-6.92-13.02-17.94-18.17-28.14-15.03h0c-1.09-11.78,6.45-23.43,21.67-30.27-15.18-6.83-22.71-18.42-21.68-30.17,0,0,0,0,0,0,10.21,3.14,21.23-2.01,28.14-15.03,7.82-12.5,6.77-24.62-1.05-31.89h0c9.66-6.83,23.51-6.13,37.05,3.63-1.68-16.56,4.6-28.88,15.29-33.86h0c2.38,10.42,12.36,17.38,27.09,16.86,14.73.52,24.71-6.45,27.09-16.86h0c10.75,4.95,17.06,17.3,15.38,33.91,13.5-9.73,27.31-10.46,36.97-3.69,0,0,0,0,0,0-7.83,7.27-8.87,19.39-1.05,31.89,6.92,13.02,17.94,18.17,28.14,15.03h0c1.08,11.78-6.45,23.43-21.67,30.27,15.18,6.83,22.71,18.42,21.68,30.17,0,0,0,0,0,0Z"
                  className="fill-[var(--secondary)]"
                />
              </g>
              <path
                d="M158.46,193.39c0,33.4,9.03,60.47,9.03,60.47,0,0,9.03-27.07,9.03-60.47s-9.03-60.47-9.03-60.47c0,0-9.03,27.07-9.03,60.47Z"
                style={{
                  transform: `translate(${offset.x * 2}px, ${
                    offset.y * 1.2
                  }px)`,
                  transition: "transform 0.2s ease-out",
                }}
                className="fill-[var(--primary)]"
              />
            </>
          </svg>

          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-53.24 -51.82 200.02 178.06"
          >
            <g
              style={{
                transform: `translate(${offset.x * 0.8}px, ${
                  offset.y * 0.8
                }px)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <path
                d="M136.78,74.41c0-5.38-.48-10.5-1.44-15.34l8.09-9.27-14.54-25.19-11.28,2.22c-3.53-3.14-7.49-5.82-11.88-8.04-4.55-2.3-9.51-4.06-14.85-5.28l-4.62-13.51h-29.08l-4.61,13.48c-10.43,2.37-19.36,6.84-26.69,13.36l-11.34-2.23L0,49.8l8.06,9.23c-.94,4.82-1.42,9.95-1.42,15.38s.48,10.56,1.42,15.39L0,99.03l14.54,25.19,11.34-2.23c7.33,6.52,16.26,10.99,26.69,13.36l4.61,13.48h29.08l4.62-13.51c10.38-2.39,19.29-6.84,26.61-13.35l11.4,2.25,14.54-25.19-8.07-9.25c.93-4.82,1.42-9.94,1.42-15.37ZM114.88,116.24c-10.5,10.05-25.05,15.14-43.24,15.14s-32.7-5.1-43.16-15.15c-10.51-10.09-15.84-24.16-15.84-41.82s5.33-31.75,15.83-41.82c10.47-10.06,25-15.15,43.17-15.15,12.03,0,22.59,2.25,31.39,6.7,8.91,4.5,15.85,11.17,20.63,19.84,4.73,8.55,7.12,18.79,7.12,30.43,0,17.66-5.35,31.74-15.9,41.83Z"
                className="fill-[var(--secondary)]"
              />
              <path
                d="M121.04,45.43c-4.5-8.16-10.96-14.37-19.36-18.61-8.42-4.25-18.44-6.38-30.04-6.38-17.45,0-31.14,4.76-41.09,14.31-9.94,9.53-14.91,22.75-14.91,39.66s4.97,30.11,14.91,39.66c9.95,9.55,23.64,14.31,41.09,14.31s31.19-4.76,41.17-14.31c9.98-9.55,14.97-22.77,14.97-39.66,0-11.17-2.24-20.83-6.74-28.98ZM91.02,108.67c-4.65,8.19-11.07,12.3-19.3,12.3s-14.67-4.11-19.3-12.3c-4.64-8.21-6.95-19.62-6.95-34.25s2.31-26.05,6.95-34.26c4.63-8.19,11.07-12.3,19.3-12.3s14.65,4.11,19.3,12.3c4.63,8.21,6.95,19.62,6.95,34.26s-2.32,26.04-6.95,34.25Z"
                className="fill-[var(--primary)]"
              />
            </g>

            <polygon
              points="76.1 74.41 71.72 46.1 67.34 74.41 71.72 102.73 76.1 74.41"
              style={{
                transform: `translate(${offset.x * 1.2}px, ${
                  offset.y * 1.2
                }px)`,
                transition: "transform 0.2s ease-out",
              }}
              className="fill-[var(--primary)]"
            />
          </svg> */}
        </div>

        <form
          onSubmit={handleSubmit}
          aria-label={isSignup ? "Sign Up Form" : "Login Form"}
        >
          {error && (
            <p
              className="text-red-400 mb-4 text-center font-medium drop-shadow-md"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </p>
          )}

          {resetMessage && (
            <p
              className="text-green-400 mb-4 text-center font-medium drop-shadow-md"
              role="status"
              aria-live="polite"
            >
              {resetMessage}
            </p>
          )}

          {/* Email input */}
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Adventurer's Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 text-[var(--primary)] placeholder-[var(--secondary)] border border-[var(--primary)] rounded focus:outline-none focus:ring-2 transition shadow-inner"
            required
          />

          {/* Password input */}
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="relative mb-4">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Secret Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded text-[var(--primary)] placeholder-[var(--secondary)] border border-[var(--primary)] rounded focus:outline-none focus:ring-2  focus:ring-offset-1 transition shadow-inner "
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>

          {/* Submit button */}
          <div className="flex ">
            <img
              src="images/ornament.svg"
              alt="text ornament"
              className=" stroke-[var(--secondary)] w-8 h-auto -scale-x-100 "
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full cursor-pointer p-3 rounded text-[var(--primary)] text-lg font-bold  ${
                loading ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? "Loading..."
                : isSignup
                ? "Forge Account"
                : "Enter Realm"}
            </button>
            <img
              src="images/ornament.svg"
              alt="text ornament"
              className=" color-[var(--secondary)] w-8 h-auto "
            />
          </div>
          {/* Forgot password */}
          {!isSignup && (
            <p
              className="text-[var(--primary)] mt-2 text-right cursor-pointer hover:underline text-sm select-none"
              onClick={handlePasswordReset}
            >
              Lost your magical key?
            </p>
          )}

          {/* Toggle login/signup */}
          <p className="text-[var(--secondary)] mt-6 text-center text-sm">
            {isSignup ? "Already have an account?" : "New to the realm?"}{" "}
            <span
              className="text-[var(--primary)] cursor-pointer hover:underline"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Enter the Realm" : "Forge Account"}
            </span>
          </p>
        </form>
      </div>
      <div className="absolute flex justify-between w-full bottom-4 pointer-events-none  inset-0">
        <div className="relative w-full h-full">
          <img
            src="/images/login.jpg"
            alt="Test"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `
          linear-gradient(to left, transparent 30%, var(--dark-muted-bg) 100%),
          linear-gradient(to right, transparent 20%, var(--dark-muted-bg) 100%),
          linear-gradient(to bottom, transparent 40%, var(--dark-muted-bg) 100%),
          linear-gradient(to top, transparent 75%, var(--dark-muted-bg) 100%)
        `,
            }}
          />
        </div>
      </div>
    </div>
  );
}
