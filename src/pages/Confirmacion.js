import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import logo from "../assets/logo.png";

const Confirmacion = () => {
  useEffect(() => {
    const verificarSesion = async () => {
      // Esto hace que Supabase confirme el token del correo
      const { data, error } = await supabase.auth.getSession();
      console.log("Sesión tras verificación:", data, error);
    };
    verificarSesion();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <img src={logo} alt="Logo" className="h-16 mb-6" />

      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          ✅ ¡Correo verificado con éxito!
        </h1>
        <p className="text-gray-600 mb-6">
          Tu cuenta ha sido confirmada correctamente.  
          Ya puedes cerrar esta ventana o volver a la aplicación.
        </p>
        <a
          href="http://localhost:5173"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default Confirmacion;
