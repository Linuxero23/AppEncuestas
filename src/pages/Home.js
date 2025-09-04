import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

const Home = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white p-6">
    <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-2">
      👋 Bienvenido a <span className="text-yellow-300">EncuestasApp</span>
    </h1>
    <p className="text-lg mb-8 text-center max-w-md">
      Crea, responde y analiza encuestas de manera <span className="font-semibold">fácil</span> y <span className="font-semibold">rápida</span>.
    </p>

    <div className="flex gap-4">
      <Link
        to="/surveys"
        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition duration-200"
      >
        📋 Ver encuestas
      </Link>

      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition duration-200"
      >
        🚪 Cerrar sesión
      </button>
    </div>
  </div>
);

};

export default Home;
