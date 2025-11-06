// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// Páginas principales
import Home from "./pages/Home";
import Surveys from "./pages/Surveys";
import SurveyBuilder from "./pages/SurveyBuilder";
import DataCultureSurvey from "./data/dataCultureSurvey";
import SurveyDetail from "./pages/SurveyDetail";
import Results from "./pages/Results";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import Confirmacion from "./pages/Confirmacion";
import AdminResults from "./pages/AdminResults";

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndRole = async () => {
      setLoading(true);

      // 🔹 Obtener sesión activa de Supabase
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      setSession(currentSession);

      // 🔹 Si hay usuario logeado → obtener rol desde tabla usuarios
      if (currentSession?.user?.email) {
        const { data: perfil, error } = await supabase
          .from("usuarios")
          .select("rol")
          .eq("email", currentSession.user.email)
          .single();

        if (!error && perfil) {
          setUserRole(perfil.rol);
        } else {
          setUserRole("user"); // valor por defecto si no hay rol
        }
      } else {
        setUserRole(null);
      }

      setLoading(false);
    };

    getSessionAndRole();

    // 🔹 Escuchar cambios de sesión en Supabase
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setUserRole(null);
      } else {
        getSessionAndRole();
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Cargando...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* 🔒 Si no hay sesión → ir al login */}
        {!session ? (
          <>
            <Route path="/auth" element={<Auth />} />
            <Route path="/confirmacion" element={<Confirmacion />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        ) : (
          <>
            {/* 👑 Rutas de administrador */}
            {userRole === "admin" ? (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/adminResults" element={<AdminResults />} />
                <Route path="*" element={<Navigate to="/adminResults" />} />
              </>
            ) : (
              <>
                {/* 👤 Rutas de usuario normal */}
                <Route path="/" element={<Home />} />
                <Route path="/surveys" element={<Surveys />} />
                <Route path="/builder" element={<SurveyBuilder />} />
                <Route path="/survey/:id" element={<SurveyDetail />} />
                <Route path="/results/:id" element={<Results />} />
                <Route path="/data-culture" element={<DataCultureSurvey />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
