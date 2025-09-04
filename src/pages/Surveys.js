import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSurveys } from "../services/SurveyService";

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSurveys()
      .then(setSurveys)
      .catch((err) => console.error("Error cargando encuestas:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Encuestas disponibles
        </h2>

        {surveys.length === 0 ? (
          <p className="text-center text-gray-600 mb-6">
            No hay encuestas disponibles.
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
                  className="inline-block px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition"
                >
                  Responder encuesta
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Botón volver abajo */}
        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-block px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition"
          >
             Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default Surveys;
