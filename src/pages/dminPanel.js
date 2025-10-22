import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/"); // si no es admin, redirige al inicio
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        🧭 Panel de Administración
      </h1>
      <p className="text-gray-600 mb-8">
        Bienvenido, <span className="font-semibold">Administrador</span>.
      </p>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver al inicio
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("isAdmin");
            navigate("/");
          }}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Cerrar sesión de administrador
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
