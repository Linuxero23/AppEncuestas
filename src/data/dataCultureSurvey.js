import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function DataCultureSurvey() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const questions = [
    "¿Tu empresa usa reportes básicos (Excel, tablas manuales)?",
    "¿Se aplican análisis de datos más avanzados?",
    "¿Tienen dashboards automáticos (ej. Power BI, Tableau)?",
    "¿La dirección toma decisiones basadas en datos?",
    "¿Usan analítica predictiva o inteligencia artificial?"
  ];

  const handleChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: parseInt(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Calcular puntaje total
    const score = Object.values(answers).reduce((a, b) => a + b, 0);

    const { data, error } = await supabase.from("survey_responses").insert([
      {
        answers,
        score,
      },
    ]);

    if (error) {
      console.error("Error al guardar:", error.message);
    } else {
      console.log("Guardado:", data);
      setSubmitted(true);
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">✅ ¡Gracias por completar la encuesta!</h2>
        <p>Tus respuestas fueron guardadas en la base de datos.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Encuesta: Cultura de Datos</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="p-4 border rounded">
            <p className="mb-2">{q}</p>
            <select
              onChange={(e) => handleChange(i, e.target.value)}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="1">1 - Nunca</option>
              <option value="2">2 - A veces</option>
              <option value="3">3 - Frecuentemente</option>
              <option value="4">4 - Siempre</option>
            </select>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Guardando..." : "Enviar respuestas"}
        </button>
      </form>
    </div>
  );
}
