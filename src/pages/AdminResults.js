import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const AdminResults = () => {
  const [responses, setResponses] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  // 🔹 Cargar datos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔍 Cargando datos de Supabase...");

        const { data: responsesData, error: resError } = await supabase
          .from("survey_responses")
          .select("*");

        if (resError) throw resError;

        const { data: rankingData, error: rankError } = await supabase
          .from("ranking_empresas")
          .select("*");

        if (rankError) throw rankError;

        setResponses(responsesData || []);
        setRanking(rankingData || []);
      } catch (err) {
        console.error("❌ Error al obtener datos:", err.message);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("isAdmin");
    navigate("/auth");
  };

  // 🔹 Estados de carga / error
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">Cargando datos...</p>
      </div>
    );

  if (errorMsg)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-red-600 text-lg font-semibold mb-4">
          Error: {errorMsg}
        </p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Volver al inicio
        </button>
      </div>
    );

  // 🔹 Vista principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 bg-white shadow-md rounded-xl px-6 py-4">
        <h1 className="text-2xl font-bold text-indigo-700">
          Panel de Resultados – Administrador
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Contenedor principal */}
      <main className="max-w-6xl mx-auto space-y-10">
        {/* Sección Ranking */}
        <section className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            🏆 Ranking de Empresas
          </h2>

          {ranking.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay datos de ranking disponibles.
            </p>
          ) : (
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-indigo-100 text-gray-800">
                  <th className="border p-2 text-left">Empresa</th>
                  <th className="border p-2 text-left">Puntaje</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((r, i) => (
                  <tr
                    key={i}
                    className="hover:bg-indigo-50 transition duration-200"
                  >
                    <td className="border p-2">{r.nombre_empresa}</td>
                    <td className="border p-2 font-semibold">{r.puntaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Sección Respuestas */}
        <section className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            📋 Respuestas de Encuestas
          </h2>

          {responses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay respuestas registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-indigo-100 text-gray-800">
                    <th className="border p-2 text-left">ID</th>
                    <th className="border p-2 text-left">Usuario</th>
                    <th className="border p-2 text-left">Respuestas</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((res) => (
                    <tr
                      key={res.id}
                      className="hover:bg-indigo-50 transition duration-200"
                    >
                      <td className="border p-2">{res.id}</td>
                      <td className="border p-2">{res.user_id}</td>
                      <td className="border p-2 text-sm text-gray-700">
                        <pre className="whitespace-pre-wrap break-words">
                          {JSON.stringify(res.answers, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminResults;
