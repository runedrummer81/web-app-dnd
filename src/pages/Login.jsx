import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import HomePage from "./HomePage";
import { useAuth } from "../hooks/useAuth";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useState, useEffect } from "react";
import MistVideo from "../components/Mist";
import { motion, useMotionValue, animate } from "framer-motion";
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
  const scaleY = useMotionValue(1);

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let mounted = true;

    const blink = async () => {
      while (mounted) {
        await new Promise((r) => setTimeout(r, 100)); // every 10s
        await animate(scaleY, 0.1, { duration: 0.12 }); // close
        await animate(scaleY, 1, { duration: 0.25 }); // open
      }
    };

    blink();
    return () => {
      mounted = false;
    };
  }, [scaleY]);

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
      <MistVideo />

      <div className="z-10">
        <div
          className="relative w-full h-full mb-10 mx-auto transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 335 386.78">
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
                className="fill-[var(--dark-muted-bg)] opacity-70"
              />
              <path
                d="M335,290.09c-19.51-11.27-29.29-39.09-34.01-63.32-1.07-12.2,4.41-25.9,21.03-33.37-16.72-7.52-22.18-21.34-21.02-33.6h0c4.73-24.19,14.52-51.89,33.97-63.13-19.52,11.28-48.51,5.83-71.86-2.22-11.09-5.18-20.2-16.77-18.36-34.89-14.85,10.7-29.52,8.54-39.55,1.44-18.6-16.19-37.73-38.53-37.73-61,0,22.5-19.17,44.86-37.79,61.06-10.03,7.05-24.66,9.17-39.46-1.5,1.85,18.24-7.39,29.87-18.59,35h0c-23.31,8-52.19,13.39-71.64,2.16,19.5,11.26,29.28,39.08,33.99,63.32,1.06,12.2-4.43,25.88-21.03,33.35,16.72,7.52,22.18,21.34,21.02,33.6h0c-4.73,24.19-14.51,51.89-33.97,63.12,19.52-11.26,48.52-5.81,71.87,2.23,11.09,5.18,20.19,16.77,18.35,34.88,14.85-10.71,29.53-8.54,39.57-1.43,18.59,16.19,37.71,38.52,37.71,60.99,0-22.52,19.22-44.9,37.86-61.1,10.03-7.02,24.63-9.11,39.4,1.54-1.84-18.19,7.35-29.81,18.51-34.96,23.33-8.02,52.26-13.44,71.74-2.18ZM274.01,223.62c-10.21-3.14-21.23,2.01-28.14,15.03-7.82,12.5-6.77,24.62,1.05,31.89h0c-9.66,6.83-23.51,6.13-37.05-3.63,1.68,16.56-4.6,28.88-15.29,33.86,0,0,0,0,0,0-2.38-10.41-12.36-17.38-27.09-16.86-14.73-.52-24.71,6.45-27.09,16.86h0c-10.75-4.95-17.06-17.3-15.38-33.9-13.5,9.73-27.31,10.46-36.97,3.69,0,0,0,0,0,0,7.83-7.27,8.87-19.39,1.05-31.89-6.92-13.02-17.94-18.17-28.14-15.03h0c-1.09-11.78,6.45-23.43,21.67-30.27-15.18-6.83-22.71-18.42-21.68-30.17,0,0,0,0,0,0,10.21,3.14,21.23-2.01,28.14-15.03,7.82-12.5,6.77-24.62-1.05-31.89h0c9.66-6.83,23.51-6.13,37.05,3.63-1.68-16.56,4.6-28.88,15.29-33.86h0c2.38,10.42,12.36,17.38,27.09,16.86,14.73.52,24.71-6.45,27.09-16.86h0c10.75,4.95,17.06,17.3,15.38,33.91,13.5-9.73,27.31-10.46,36.97-3.69,0,0,0,0,0,0-7.83,7.27-8.87,19.39-1.05,31.89,6.92,13.02,17.94,18.17,28.14,15.03h0c1.08,11.78-6.45,23.43-21.67,30.27,15.18,6.83,22.71,18.42,21.68,30.17,0,0,0,0,0,0Z"
                className="fill-[var(--secondary)] "
              />
            </g>

            <path
              d="M158.46,193.39c0,33.4,9.03,60.47,9.03,60.47,0,0,9.03-27.07,9.03-60.47s-9.03-60.47-9.03-60.47c0,0-9.03,27.07-9.03,60.47Z"
              style={{
                transform: `translate(${offset.x * 2}px, ${offset.y * 1.2}px)`,
                transition: "transform 0.2s ease-out",
              }}
              className="fill-[var(--primary)]"
            />
          </svg> */}

          <div
            className="relative w-full h-full mx-auto"
            style={{
              width: "auto",
              height: "200px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 87.06 86.11"
              className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out"
              style={{
                transform: `translate(${offset.x * 0.5}px, ${
                  offset.y * 0.2
                }px)`,
              }}
            >
              <path
                className="fill-[var(--dark-muted-bg)]"
                d="M29.56,74.66l-2.49-7.96-.25-.08c-4.24-1.33-8.22-3.63-11.51-6.67l-.19-.18-8.16,1.83L.62,50.63l5.66-6.14-.06-.26c-.49-2.2-.74-4.44-.74-6.65s.25-4.46.74-6.65l.06-.26L.62,24.53l6.34-10.97,8.16,1.83.19-.18c3.29-3.03,7.28-5.34,11.51-6.67l.25-.08L29.56.5h12.67l2.49,7.96.25.08c4.24,1.33,8.22,3.63,11.51,6.67l.19.18,8.16-1.83,6.34,10.97-5.66,6.14.06.26c.49,2.2.74,4.44.74,6.65s-.25,4.46-.74,6.65l-.06.26,5.66,6.14-6.34,10.98-8.16-1.83-.19.18c-3.3,3.03-7.28,5.34-11.51,6.67l-.25.08-2.49,7.96h-12.67Z"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 87.06 86.11"
              className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out"
              style={{
                transform: `translate(${offset.x * 0.5}px, ${
                  offset.y * 0.2
                }px)`,
              }}
            >
              <path
                className="fill-[var(--secondary)]"
                d="M41.86,1l2.3,7.36.16.5.5.16c4.17,1.31,8.08,3.57,11.32,6.56l.39.35.51-.11,7.55-1.69,5.97,10.34-5.23,5.68-.35.39.11.51c.48,2.16.73,4.36.73,6.55s-.25,4.38-.73,6.55l-.11.51.35.39,5.23,5.68-5.97,10.34-7.55-1.7-.51-.11-.39.35c-3.24,2.98-7.16,5.25-11.32,6.56l-.5.16-.16.5-2.3,7.36h-11.94l-2.3-7.36-.16-.5-.5-.16c-4.17-1.31-8.08-3.57-11.32-6.56l-.39-.35-.51.11-7.55,1.7-5.97-10.34,5.23-5.68.35-.39-.11-.51c-.48-2.16-.73-4.36-.73-6.55s.25-4.38.73-6.54l.11-.51-.35-.39-5.23-5.68,5.97-10.34,7.55,1.69.51.11.39-.35c3.24-2.98,7.16-5.25,11.32-6.56l.5-.16.16-.5,2.3-7.36h11.94M42.6,0h-13.41l-2.52,8.06c-4.4,1.38-8.39,3.72-11.7,6.78l-8.27-1.86L0,24.6l5.73,6.22c-.49,2.18-.75,4.44-.75,6.76s.27,4.59.75,6.76l-5.73,6.22,6.7,11.61,8.27-1.86c3.32,3.05,7.3,5.4,11.7,6.78l2.52,8.06h13.41l2.52-8.06c4.4-1.38,8.39-3.72,11.7-6.78l8.27,1.86,6.7-11.61-5.73-6.22c.49-2.18.75-4.44.75-6.76s-.27-4.59-.75-6.76l5.73-6.22-6.7-11.61-8.27,1.86c-3.32-3.05-7.3-5.4-11.7-6.78l-2.52-8.06h0Z"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 87.06 86.11"
              className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out"
              style={{
                transform: `translate(${offset.x * 0.5}px, ${
                  offset.y * 0.2
                }px)`,
              }}
            >
              <path
                className="fill-[var(--primary)]"
                d="M35.9,63.85c-14.48,0-26.27-11.78-26.27-26.27s11.78-26.27,26.27-26.27,26.27,11.78,26.27,26.27-11.78,26.27-26.27,26.27Z"
              />
            </svg>

            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 87.06 86.11"
              className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out"
              style={{
                transformOrigin: "center center",
              }}
              styleMotion={{ scaleY }} // 👈 this keeps scaleY alive
              transformTemplate={({ scaleY: sY = 1 }) =>
                `translate(${offset.x * 1.2}px, ${
                  offset.y * 0.2
                }px) scaleY(${sY})`
              }
            >
              <path
                className="fill-[var(--dark-muted-bg)]"
                d="M48.91,37.58c0,7.26-1.15,12.91-3.45,16.99-2.31,4.06-5.49,6.1-9.57,6.1s-7.27-2.04-9.57-6.1c-2.3-4.07-3.45-9.73-3.45-16.99s1.15-12.91,3.45-16.99c2.3-4.06,5.49-6.1,9.57-6.1s7.27,2.04,9.57,6.1c2.3,4.07,3.45,9.73,3.45,16.99Z"
              />
            </motion.svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 87.06 86.11"
              className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out"
              style={{
                transform: `translate(${offset.x * 1.5}px, ${
                  offset.y * 1.5
                }px)`,
              }}
            >
              <polygon
                className="fill-[var(--primary)]"
                points="38.07 37.58 35.9 23.54 33.72 37.58 35.9 51.62 38.07 37.58"
              />
            </svg>
          </div>
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
          <section className="border p-2 border-[var(--secondary)] mb-4 transition-colors duration-200 ">
            <input
              id="email"
              type="email"
              placeholder="Adventurer's Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
      w-full p-3 text-[var(--primary)] 
      placeholder-[var(--secondary)] 
      bg-transparent
      focus:outline-none 
      focus:bg-[var(--primary)]
      focus:placeholder-[var(--dark-muted-bg)]
      focus:text-[var(--dark-muted-bg)]
      transition duration-200
    "
              required
            />
          </section>

          {/* Password input */}
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="border p-2 border-[var(--secondary)] mb-4 relative transition-colors duration-200">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Secret Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
      w-full p-3 text-[var(--primary)] 
      placeholder-[var(--secondary)] 
      bg-transparent
      focus:outline-none 
      focus:bg-[var(--primary)]
      focus:placeholder-[var(--dark-muted-bg)]
      focus:text-[var(--dark-muted-bg)]
      transition duration-200
    "
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--secondary)] hover:text-[var(--dark-muted-bg)] focus:outline-none transition duration-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>

          <div className="flex justify-between">
            {/* Toggle login/signup */}
            <p className="text-[var(--secondary)] text-center text-1xl">
              {isSignup ? "Already have an account?" : "New to the realm?"}{" "}
              <span
                className="text-[var(--primary)] cursor-pointer hover:underline"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Enter the Realm" : "Forge Account"}
              </span>
            </p>

            {/* Forgot password */}
            {!isSignup && (
              <p
                className="text-[var(--primary)] text-center cursor-pointer hover:underline text-1xl select-none"
                onClick={handlePasswordReset}
              >
                Lost your magical key?
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className=" mt-7">
            <div className="border-t border-[var(--secondary)] my-4"></div>

            <div className="flex transition hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 257.6 130.8"
                className="fill-[var(--secondary)] w-8 h-auto -scale-x-100"
              >
                <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
              </svg>
              <button
                type="submit"
                disabled={loading}
                className={`uppercase w-full cursor-pointer p-3 text-[var(--primary)] text-5xl font-bold transition hover:scale-105 hover:drop-shadow-2xl${
                  loading ? " cursor-not-allowed" : ""
                }`}
              >
                {loading
                  ? "Loading..."
                  : isSignup
                  ? "Forge Account"
                  : "Enter Realm"}
              </button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 257.6 130.8"
                className="fill-[var(--secondary)] w-8 h-auto "
              >
                <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
              </svg>
            </div>
          </div>
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
