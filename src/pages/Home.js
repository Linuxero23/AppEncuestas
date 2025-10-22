import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import videobanner from "../assets/videobanner.mp4";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { CheckCircle, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "react-circular-progressbar/dist/styles.css";

// Importar Google Fonts directamente
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [surveysRespondidas, setSurveysRespondidas] = useState([]);
  const [progreso, setProgreso] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const { data: perfil } = await supabase
          .from("usuarios")
          .select("nombre, empresa")
          .eq("email", data.user.email)
          .single();

        if (perfil) {
          setProfile(perfil);

          const { data: encuestas } = await supabase
            .from("surveys")
            .select("*")
            .eq("empresaid", perfil.empresa);

          const { data: respuestas } = await supabase
            .from("survey_responses")
            .select("survey_id")
            .eq("user_id", data.user.id);

          const respondedIds = respuestas.map((r) => r.survey_id);
          setSurveysRespondidas(
            encuestas.filter((e) => respondedIds.includes(e.id))
          );
          setSurveys(encuestas.filter((e) => !respondedIds.includes(e.id)));

          const progressCalc = encuestas.length
            ? Math.round((respondedIds.length / encuestas.length) * 100)
            : 0;
          setProgreso(progressCalc);
        }
      }
      setLoading(false);
    };
    getProfile();
  }, []);

  // 🔹 Función de cierre de sesión con confirmación y redirección automática
  const handleLogout = async () => {
    const confirmLogout = window.confirm("¿Seguro que deseas cerrar sesión?");
    if (!confirmLogout) return;

    await supabase.auth.signOut();

    // Detectar entorno y redirigir
    if (window.location.hostname === "localhost") {
      // Entorno de desarrollo (npm start)
      window.location.href = "/auth";
    } else {
      // Entorno de producción (servidor)
      window.location.href = "https://www.dicihub.org/culturadato/index.html";
    }
  };

  if (loading) {
    return (
      <div
        style={{ fontFamily: "Montserrat, sans-serif" }}
        className="flex items-center justify-center min-h-screen text-gray-700 text-xl"
      >
        Cargando...
      </div>
    );
  }

  const data = [
    { name: "Contestadas", count: surveysRespondidas.length },
    { name: "Pendientes", count: surveys.length },
  ];

  return (
    <div
      style={{ fontFamily: "Montserrat, sans-serif" }}
      className="flex flex-col min-h-screen bg-blue-50"
    >
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10" />
            <span className="font-bold text-gray-700 text-lg">
              EncuestasApp
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <p className="font-semibold text-gray-600 mb-6">
            👋 Bienvenido {profile?.nombre || ""}
          </p>
          <nav className="flex flex-col gap-3">
            <Link
              to="/surveys"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition transform hover:scale-105"
              onClick={() => setMenuOpen(false)}
            >
              📋 Ver encuestas
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition transform hover:scale-105"
            >
              🚪 Cerrar sesión
            </button>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10" />
          <h1 className="text-xl font-bold text-gray-700">EncuestasApp</h1>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition transform hover:scale-105"
        >
          ☰
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-16">
        {/* Banner con video */}
        <section className="relative h-64 rounded-xl overflow-hidden shadow-lg">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={videobanner}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
            <h2 className="text-4xl font-extrabold text-white text-center px-4">
              Bienvenido a{" "}
              <span className="bg-white/30 px-2 rounded">EncuestasApp</span>
            </h2>
          </div>
        </section>

        {/* Estado de encuestas */}
        <section>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Estado de tus encuestas
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Progreso general */}
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl shadow-lg flex flex-col items-center hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-32 h-32 mb-4">
                <CircularProgressbar
                  value={progreso}
                  text={`${progreso}%`}
                  styles={buildStyles({
                    pathTransitionDuration: 1,
                    pathColor: "#16a34a",
                    textColor: "#1f2937",
                    trailColor: "#d1d5db",
                  })}
                />
              </div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Progreso general
              </h4>
              <p className="text-sm text-gray-500 text-center">
                Porcentaje de encuestas completadas.
              </p>
            </div>

            {/* Mini gráfico de barras */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <h4 className="font-semibold text-gray-700 mb-4 text-center">
                Encuestas en gráfico
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Encuestas pendientes */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <h4 className="font-semibold text-gray-700 mb-4 text-center">
                Encuestas pendientes
              </h4>
              {surveys.length === 0 ? (
                <p className="text-gray-600 text-center">
                  No tienes encuestas pendientes.
                </p>
              ) : (
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {surveys.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center gap-2 bg-gray-50 p-2 rounded-md shadow-sm hover:bg-yellow-50 transition"
                    >
                      <Clock className="text-yellow-500" /> {s.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Encuestas contestadas */}
        <section>
          <h4 className="font-semibold text-gray-700 mb-4 text-center">
            Encuestas contestadas
          </h4>
          {surveysRespondidas.length === 0 ? (
            <p className="text-gray-600 text-center mb-4">
              Aún no has contestado ninguna encuesta.
            </p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {surveysRespondidas.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-2 bg-gray-50 p-2 rounded-md shadow-sm hover:bg-green-50 transition"
                >
                  <CheckCircle className="text-green-500" /> {s.title}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Botón principal */}
        <section className="text-center mt-12">
          <Link
            to="/surveys"
            className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition duration-200 animate-pulse"
          >
            🚀 Responder encuestas
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
