import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Results() {
  const { id } = useParams(); // id de la encuesta
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("survey_responses")
        .select("id, answers, created_at, user_id")
        .eq("survey_id", id);

      if (error) {
        console.error("Error al traer respuestas:", error.message);
      } else {
        setResponses(data);
      }

      setLoading(false);
    };

    fetchResponses();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Cargando resultados...
        </p>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          📊 Resultados de la Encuesta
        </h1>
        <p className="text-gray-600 mb-8">
          Aquí puedes ver un resumen de todas las respuestas enviadas por los
          participantes.
        </p>
        <p className="text-gray-500 text-lg">No hay respuestas aún.</p>
        <div className="mt-10">
          <Link
            to="/"
            className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
          >
            ⬅ Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // ---- Procesar respuestas JSON ----
  let counts = {};

  responses.forEach((r) => {
    const ans = r.answers; // JSONB
    if (ans) {
      Object.values(ans).forEach((value) => {
        counts[value] = (counts[value] || 0) + 1;
      });
    }
  });

  const chartData = Object.keys(counts).map((key) => ({
    name: key,
    value: counts[key],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        📊 Resultados de la Encuesta
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        Aquí puedes ver un resumen de todas las respuestas enviadas por los
        participantes.
      </p>

      {/* Gráfico de pastel */}
      <div className="w-full max-w-xl h-96">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-10">
        <Link
          to="/"
          className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
           Volver al inicio
        </Link>
      </div>
    </div>
  );
}
