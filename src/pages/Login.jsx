import { useState } from "react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden p-4">
      {/* Ember particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <EmberAnimation count={30} />
      </div>
      <div >
        <img
          src="../images/corners.svg"
          alt="eye-logo"
          className="w-50 h-50 flex mb-4 mx-auto"
        />

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
<img src="../images/ornament.svg" alt="text ornament" className=" stroke-[var(--secondary)] w-8 h-auto -scale-x-100 "/>
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
<img src="../images/ornament.svg" alt="text ornament" className=" color-[var(--secondary)] w-8 h-auto " />
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
    </div>
  );
}
