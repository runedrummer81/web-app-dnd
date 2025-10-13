import { Routes, Route } from "react-router";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NewCampaign from "./pages/NewCampaign";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newcampaign"
            element={
              <ProtectedRoute>
                <NewCampaign />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}
