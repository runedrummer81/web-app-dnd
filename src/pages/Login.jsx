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

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-gray-800/90 backdrop-blur-md border-4 border-yellow-700 rounded-xl p-8 shadow-2xl w-full max-w-md"
        aria-label={isSignup ? "Sign Up Form" : "Login Form"}
      >
        <h2 className="text-4xl text-yellow-400 font-extrabold mb-6 text-center drop-shadow-lg animate-pulse">
          {isSignup ? "Forge Your Account" : "Enter the Realm"}
        </h2>

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
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 transition shadow-inner"
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
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 transition shadow-inner"
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
        <button
          type="submit"
          disabled={loading}
          className={`w-full cursor-pointer p-3 rounded text-white text-lg font-bold bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-500 hover:to-red-500 shadow-lg transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : isSignup ? "Forge Account" : "Enter Realm"}
        </button>

        {/* Forgot password */}
        {!isSignup && (
          <p
            className="text-yellow-300 mt-2 text-right cursor-pointer hover:underline text-sm select-none"
            onClick={handlePasswordReset}
          >
            Lost your magical key?
          </p>
        )}

        {/* Toggle login/signup */}
        <p className="text-gray-400 mt-6 text-center text-sm">
          {isSignup ? "Already have an account?" : "New to the realm?"}{" "}
          <span
            className="text-yellow-400 cursor-pointer hover:underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Enter the Realm" : "Forge Account"}
          </span>
        </p>
      </form>
    </div>
  );
}
