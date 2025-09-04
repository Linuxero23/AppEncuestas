import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    // logica para el registro en el supabase ;)
    console.log("Registrarse con:", email, password);
    navigate("/register"); // redirige a página de registro
  };

  const handleLogin = () => {
    // logica para el login en el supabase
    console.log("Iniciar sesión con:", email, password);
    navigate("/login"); // direccion para la pagina de login
  };

  const handleForgotPassword = () => {
    console.log("Recuperar contraseña");
    navigate("/forgot-password"); // direccion para la pagina de recuperacion de la contra
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Bienvenido a EncuestasApp
        </h1>

        {/* Input correo */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />

        {/* Input contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />

        {/* Botón registrarse */}
        <button
          onClick={handleRegister}
          className="w-full mb-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          Registrarme
        </button>

        {/* Botón iniciar sesión */}
        <button
          onClick={handleLogin}
          className="w-full mb-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          Ya tengo cuenta, iniciar sesión
        </button>

        {/* Botón olvidar contraseña */}
        <button
          onClick={handleForgotPassword}
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
        >
          Olvidé mi contraseña
        </button>

        {/* Ejemplo de volver al Home */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Volver al inicio?{" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Ir a Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
