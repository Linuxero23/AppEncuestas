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

import Auth from "./pages/Auth";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        {!session ? (
          <>
            {/* Si no hay sesión, mandar siempre a Auth */}
            <Route path="/" element={<Navigate to="/auth" />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/builder" element={<SurveyBuilder />} />
            <Route path="/survey/:id" element={<SurveyDetail />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/data-culture" element={<DataCultureSurvey />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
