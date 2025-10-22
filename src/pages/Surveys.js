import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [empresaNombre, setEmpresaNombre] = useState(null);
  const [progreso, setProgreso] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Obtener usuario logueado
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // 2️⃣ Buscar empresa asociada
        const { data: perfil, error: perfilError } = await supabase
          .from("usuarios")
          .select("empresa")
          .eq("email", user.email)
          .single();
        if (perfilError) throw perfilError;

        const empresaId = perfil.empresa;

        // 3️⃣ Obtener nombre de la empresa
        const { data: empresa, error: empresaError } = await supabase
          .from("empresas")
          .select("nombre")
          .eq("id", empresaId)
          .single();
        if (empresaError) throw empresaError;

        setEmpresaNombre(empresa.nombre);

        // 4️⃣ Obtener todas las encuestas de esa empresa
        const { data: encuestas, error: encuestasError } = await supabase
          .from("surveys")
          .select("*")
          .eq("empresaid", empresaId);
        if (encuestasError) throw encuestasError;

        // 5️⃣ Obtener encuestas ya respondidas por el usuario
        const { data: respuestas, error: respuestasError } = await supabase
          .from("survey_responses")
          .select("survey_id")
          .eq("user_id", user.id);
        if (respuestasError) throw respuestasError;

        const encuestasRespondidas = respuestas.map((r) => r.survey_id);

        // 6️⃣ Filtrar encuestas disponibles
        const encuestasDisponibles = encuestas.filter(
          (e) => !encuestasRespondidas.includes(e.id)
        );

        setSurveys(encuestasDisponibles);

        // 7️⃣ Calcular progreso
        const progresoCalculado = Math.round(
          (encuestasRespondidas.length / encuestas.length) * 100
        );
        setProgreso(progresoCalculado);
      } catch (err) {
        console.error("Error cargando encuestas:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-blue-900 text-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-800 shadow-2xl transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col items-center border-b relative">
          <img
            src={logo}
            alt="Logo"
            className="w-24 h-24 mb-3 rounded-full object-contain"
          />
          <p className="font-semibold text-gray-700">
            👋 Bienvenido {empresaNombre || ""}
          </p>
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mt-6 flex flex-col gap-4 px-6">
          <Link
            to="/home"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            🏠 Inicio
          </Link>
          <Link
            to="/surveys"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            📋 Encuestas
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="text-left text-gray-700 hover:text-red-500 font-medium"
          >
            Volver al inicio
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6 overflow-y-auto">
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 bg-white text-indigo-600 rounded-lg shadow-lg hover:bg-gray-100 transition mb-6"
        >
          <Menu size={24} />
        </button>

        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-5xl mx-auto text-gray-800">
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
            Encuestas disponibles {empresaNombre && `para ${empresaNombre}`}
          </h2>

          {/* 🔵 Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-700"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-700 font-semibold mb-6">
            Progreso: {progreso}%
          </p>

          {/* 🎉 Mensaje de completado */}
          {progreso === 100 && (
            <p className="text-green-600 text-center text-lg font-semibold mt-4">
              🎉 ¡Has completado todas las encuestas!
            </p>
          )}

          {/* 📋 Lista de encuestas disponibles */}
          {surveys.length === 0 ? (
            <p className="text-center text-gray-600 mb-6">
              No hay encuestas disponibles para{" "}
              <span className="font-semibold">
                {empresaNombre || "tu empresa"}
              </span>
              .
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {surveys.map((s) => (
                <li
                  key={s.id}
                  className="bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{s.description}</p>
                  <Link
                    to={`/survey/${s.id}`}
                    className="inline-block px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
                  >
                    Responder encuesta
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Surveys;
