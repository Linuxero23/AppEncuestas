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

        // Validar formato del JSON
        surveyData.questions =
          typeof surveyData.questions === "string"
            ? JSON.parse(surveyData.questions)
            : Array.isArray(surveyData.questions)
            ? surveyData.questions
            : [];

        setSurvey(surveyData);

        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (err) {
        console.error("Error cargando encuesta o usuario:", err);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Manejo de respuestas (soporta radio y checkbox)
  const handleChange = (qIndex, value, isMultiSelect) => {
    setAnswers((prev) => {
      const prevAnswer = prev[qIndex] || [];

      if (isMultiSelect) {
        // Si ya estaba seleccionada, la quitamos; si no, la agregamos
        if (prevAnswer.includes(value)) {
          return { ...prev, [qIndex]: prevAnswer.filter((v) => v !== value) };
        } else {
          return { ...prev, [qIndex]: [...prevAnswer, value] };
        }
      } else {
        // Radio → solo una opción
        return { ...prev, [qIndex]: [value] };
      }
    });
  };

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
      console.error("🔥 Error detallado al guardar respuestas:", err);
      alert("Error al guardar tus respuestas: " + (err.message || JSON.stringify(err)));
    }
  };

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <p className="text-white text-lg font-semibold">Cargando encuesta...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-blue-100 items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          {survey.title}
        </h2>
        <p className="text-gray-600 text-center mb-8">{survey.description}</p>

        {submitted ? (
          <div className="text-center">
            <p className="mb-6 text-lg font-medium text-green-600">
              🎉 ¡Gracias por responder esta encuesta!
            </p>
            <Link
              to="/"
              className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {survey.questions && survey.questions.length > 0 ? (
              survey.questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <p className="font-semibold text-gray-800 mb-4 text-lg">
                    {q.text}
                  </p>
                  <div className="flex flex-col gap-3">
                    {q.options?.map((opt, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-3 cursor-pointer hover:text-indigo-700"
                      >
                        <input
                          type={q.multi_select ? "checkbox" : "radio"}
                          name={`q-${idx}`}
                          value={opt.text}
                          checked={answers[idx]?.includes(opt.text) || false}
                          onChange={() =>
                            handleChange(idx, opt.text, q.multi_select)
                          }
                          className="accent-indigo-600 w-5 h-5"
                        />
                        <span className="text-gray-700">{opt.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No hay preguntas disponibles en esta encuesta.
              </p>
            )}

            <div className="flex justify-between items-center mt-8">
              <Link
                to="/"
                className="px-5 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                Volver
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
              >
                🚀 Enviar respuestas
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SurveyDetail;
