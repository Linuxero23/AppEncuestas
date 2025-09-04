import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getSurveyById, submitSurveyResponse } from "../services/SurveyService";

const SurveyDetail = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const surveyData = await getSurveyById(id);
        
        surveyData.questions =
          typeof surveyData.questions === "string"
            ? JSON.parse(surveyData.questions)
            : surveyData.questions;

        setSurvey(surveyData);

        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (err) {
        console.error("Error cargando encuesta o usuario:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  // Enviar respuestas
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Debes iniciar sesión para responder.");
      return;
    }

    try {
      await submitSurveyResponse(id, user.id, answers);
      setSubmitted(true);
    } catch (err) {
      console.error("Error guardando respuestas:", err);
      alert("Error al guardar tus respuestas.");
    }
  };

  if (!survey) return <p className="text-center text-white">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          {survey.title}
        </h2>
        <p className="text-gray-600 text-center mb-8">{survey.description}</p>

        {submitted ? (
          <div className="text-center">
            <p className="mb-4 text-lg font-medium text-green-600">
              ¡Gracias por responder!
            </p>
            <div className="flex justify-center gap-4">
              <Link to={`/results/${id}`}>
                <button className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition">
                  Ver resultados
                </button>
              </Link>
              <Link
                to="/"
                className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {survey.questions.map((q) => (
              <div
                key={q.id}
                className="mb-6 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <p className="font-semibold text-gray-800 mb-3">{q.text}</p>
                <div className="flex flex-wrap gap-4">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        required
                        className="form-radio text-indigo-600"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-8">
              <Link
                to="/"
                className="px-5 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition"
              >
                 Volver
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition"
              >
                Enviar respuestas
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SurveyDetail;
