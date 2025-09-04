import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Auth = () => {
  const [mode, setMode] = useState("login"); // login | register | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Login con Supabase
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigate("/"); // dirigirse a pestaña home
    }
  };

// Registro con Supabase
const handleRegister = async (e) => {
  e.preventDefault();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(error.message); // Errores reales como contraseña debil
    return;
  }

  // Si no hay user, significa que el correo ya está en uso
  if (!data.user) {
    alert("Este correo ya está en uso. Intenta iniciar sesión.");
    return;
  }

  alert("¡Registro exitoso! Revisa tu correo.");
  setMode("login");
};


  // Recuperar contraseña
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      alert(error.message);
    } else {
      alert("Te hemos enviado un correo para restablecer tu contraseña.");
      setMode("login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {mode === "login" && "Iniciar Sesión"}
          {mode === "register" && "Registrarme"}
          {mode === "reset" && "Recuperar Contraseña"}
        </h1>

        <form
          onSubmit={
            mode === "login"
              ? handleLogin
              : mode === "register"
              ? handleRegister
              : handleForgotPassword
          }
        >
          {/* Input correo */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />

          {/* Input contraseña solo en login y registro */}
          {mode !== "reset" && (
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-6 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          )}

          {/* Botón de acción principal */}
          <button
            type="submit"
            className="w-full mb-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            {mode === "login" && "Iniciar Sesión"}
            {mode === "register" && "Registrarme"}
            {mode === "reset" && "Enviar correo de recuperación"}
          </button>
        </form>

        {/* Enlaces de cambio de modo */}
        <div className="text-center text-sm mt-4 space-y-2">
          {mode === "login" && (
            <>
              <p>
                ¿No tienes cuenta?{" "}
                <span
                  onClick={() => setMode("register")}
                  className="text-blue-500 cursor-pointer hover:underline"
                >
                  Regístrate aquí
                </span>
              </p>
              <p>
                <span
                  onClick={() => setMode("reset")}
                  className="text-gray-500 cursor-pointer hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </span>
              </p>
            </>
          )}

          {mode === "register" && (
            <p>
              ¿Ya tienes cuenta?{" "}
              <span
                onClick={() => setMode("login")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Inicia sesión
              </span>
            </p>
          )}

          {mode === "reset" && (
            <p>
              <span
                onClick={() => setMode("login")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Volver al login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
