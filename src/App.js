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

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getSessionAndRole = async () => {
      // 🔹 Verificar si hay sesión activa de Supabase
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      setSession(currentSession);

      // 🔹 Si hay sesión, intentar obtener el rol desde la BD
      if (currentSession?.user?.email) {
        const { data: perfil, error } = await supabase
          .from("usuarios")
          .select("rol")
          .eq("email", currentSession.user.email)
          .single();

        if (!error && perfil) {
          setUserRole(perfil.rol);
        }
      }

      // 🔹 Verificar si es el admin manual (guardado en localStorage)
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin) {
        setUserRole("admin");
      }
    };

    getSessionAndRole();

    // Escuchar cambios en la sesión de Supabase
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && !localStorage.getItem("isAdmin")) {
        setUserRole(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* 🔒 Si no hay sesión ni admin → ir al login */}
        {!session && !localStorage.getItem("isAdmin") ? (
          <>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        ) : (
          <>
            {/* 👑 Si es administrador */}
            {userRole === "admin" ? (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/admin" />} />
              </>
            ) : (
              <>
                {/* 👤 Usuario normal */}
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
