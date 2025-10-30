import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--dark-muted-bg)] text-[var(--primary)] font-serif p-8 text-center">
      <motion.h1
        className="text-9xl font-extrabold mb-6"
        animate={{ rotate: [0, -5, 5, -5, 0] }}
        transition={{ duration: 1 }}
      >
        404
      </motion.h1>
      <motion.p
        className="text-2xl mb-8 text-[var(--secondary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        Oops! The page you are looking for does not exist
      </motion.p>
      <motion.button
        onClick={() => navigate("/home")}
        className="px-6 py-3 uppercase font-bold text-[var(--dark-muted-bg)] bg-[var(--secondary)] hover:bg-[var(--primary)] hover:shadow-[0_0_15px_rgba(191,136,60,0.6)] transition-all"
        whileHover={{ scale: 1.05, boxShadow: "0 0 8px #bf883c" }}
        whileTap={{ scale: 0.95 }}
      >
        Return to Frontpage
      </motion.button>
    </div>
  );
}




