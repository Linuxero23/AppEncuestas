import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AdminDashboard = () => {
  const [responses, setResponses] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: surveyData, error: surveyError } = await supabase
        .from("survey_responses")
        .select("*");

      const { data: rankingData, error: rankingError } = await supabase
        .from("ranking_empresas")
        .select("*");

      if (!surveyError) setResponses(surveyData);
      if (!rankingError) setRanking(rankingData);
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Panel del Administrador
      </h1>

      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Respuestas de Encuestas</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Usuario</th>
              <th className="border px-4 py-2">Encuesta</th>
              <th className="border px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {responses.length > 0 ? (
              responses.map((r) => (
                <tr key={r.id}>
                  <td className="border px-4 py-2">{r.id}</td>
                  <td className="border px-4 py-2">{r.user_id}</td>
                  <td className="border px-4 py-2">{r.survey_id}</td>
                  <td className="border px-4 py-2">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No hay respuestas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Ranking de Empresas</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Empresa</th>
              <th className="border px-4 py-2">Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {ranking.length > 0 ? (
              ranking.map((emp) => (
                <tr key={emp.id}>
                  <td className="border px-4 py-2">{emp.nombre}</td>
                  <td className="border px-4 py-2">{emp.puntaje}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center py-4">
                  No hay datos de ranking disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
