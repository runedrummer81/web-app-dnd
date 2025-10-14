import { Routes, Route } from "react-router";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NewCampaign from "./pages/NewCampaign";
import ProtectedRoute from "./components/ProtectedRoute";
import Session from "./pages/Session";
import SessionEdit from "./pages/SessionEdit";
import LoadPage from "./pages/LoadPage";

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
            path="/info"
            element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/continue"
            element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/load"
            element={
              <ProtectedRoute>
                <LoadPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/encounters"
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
              </ProtectedRoute>}
              />

              <Route
            path="/session"
            element={
              <ProtectedRoute>
                <Session/>
              </ProtectedRoute>
            }
          />
          <Route  path="/session-edit"
            element={
              <ProtectedRoute>
                <SessionEdit />
              </ProtectedRoute>
            } />
        </Routes>
      </main>
    </>
  );
}
