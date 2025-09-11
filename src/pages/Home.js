import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Home = () => {
  const [profile, setProfile] = useState(null); // aquí guardamos el nombre desde "usuarios"
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        // Buscar el nombre en la tabla "usuarios" usando el correo logueado
        const { data: perfil, error } = await supabase
          .from("usuarios")
          .select("nombre")
          .eq("email", data.user.email) // filtra por el correo logueado
          .single();

        if (!error && perfil) {
          setProfile(perfil);
        }
      }
    };
    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Sidebar (menú hamburguesa) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-8" />
            <span className="font-bold text-gray-700">EncuestasApp</span>
          </div>
          {/* Botón para cerrar menú */}
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <p className="font-semibold text-gray-600 mb-6">
            👋 Bienvenido{" "}
            {profile?.nombre ? profile.nombre : ""}
          </p>
          <nav className="flex flex-col gap-3">
            <Link
              to="/surveys"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              📋 Ver encuestas
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              🚪 Cerrar sesión
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header con botón hamburguesa */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ☰
          </button>
          <h1 className="text-lg font-bold text-gray-700">EncuestasApp</h1>
          <div />
        </header>

        {/* Scroll page */}
        <main className="flex-1 overflow-y-auto p-6 space-y-16">
          {/* Sección bienvenida */}
          <section className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
              Bienvenido a <span className="text-blue-600">EncuestasApp</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Responde y analiza encuestas de manera{" "}
              <span className="font-semibold">fácil</span> y{" "}
              <span className="font-semibold">rápida</span>.
            </p>
          </section>

          {/* Sección ejemplos */}
          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Ejemplos de contenido
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <img
                  src="https://via.placeholder.com/300x200"
                  alt="Ejemplo 1"
                  className="rounded-lg mb-4"
                />
                <h4 className="font-semibold text-gray-700 mb-2">
                  Ejemplo1
                </h4>
                <p className="text-sm text-gray-500">
                  Ejemplo1.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <img
                  src="https://via.placeholder.com/300x200"
                  alt="Ejemplo 2"
                  className="rounded-lg mb-4"
                />
                <h4 className="font-semibold text-gray-700 mb-2">
                  Ejemplo2
                </h4>
                <p className="text-sm text-gray-500">
                  Ejemplo2
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <img
                  src="https://via.placeholder.com/300x200"
                  alt="Ejemplo 3"
                  className="rounded-lg mb-4"
                />
                <h4 className="font-semibold text-gray-700 mb-2">
                  Ejemplo3
                </h4>
                <p className="text-sm text-gray-500">
                  Ejemplo3
                </p>
              </div>
            </div>
          </section>

          {/* Sección CTA */}
          <section className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ¡Empieza hoy!
            </h3>
            <p className="text-gray-600 mb-6">
              Únete y comienza a crear tus propias encuestas en segundos.
            </p>
            <Link
              to="/surveys"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition duration-200"
            >
              🚀 Responder encuestas
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
