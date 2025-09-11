import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import logo from "../assets/logo.png"; // 👈 importa tu imagen aquí

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [empresas, setEmpresas] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpresas = async () => {
      const { data, error } = await supabase.from("empresas").select("*");
      if (!error) setEmpresas(data);
    };
    fetchEmpresas();
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showMessage(error.message, "error");
    } else {
      navigate("/");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, empresa_id: empresaId },
        emailRedirectTo: "http://localhost:5173/confirmacion",
      },
    });

    if (error) {
      showMessage(error.message, "error");
      return;
    }
    if (!data.user) {
      showMessage("Este correo ya está en uso. Intenta iniciar sesión.", "error");
      return;
    }

    await supabase.from("usuarios").insert([
      { user_id: data.user.id, nombre: username, email, empresa_id: empresaId },
    ]);

    showMessage("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.", "success");
    setMode("login");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      showMessage(error.message, "error");
    } else {
      showMessage("Te enviamos un correo para restablecer tu contraseña.", "success");
      setMode("login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md relative">
        
        {/* Logo arriba a la izquierda */}
        <div className="absolute top-4 left-4">
          <img src={logo} alt="Logo" className="h-10" />
        </div>

        {/* Mensaje bonito */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

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
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />

          {mode !== "reset" && (
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          )}
 
          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />

              <select
                value={empresaId}
                onChange={(e) => setEmpresaId(e.target.value)}
                className="w-full px-4 py-2 mb-6 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="">Selecciona una empresa</option>
                {empresas.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre}
                  </option>
                ))}
              </select>
            </>
          )}

          <button
            type="submit"
            className="w-full mb-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {mode === "login" && "Iniciar Sesión"}
            {mode === "register" && "Registrarme"}
            {mode === "reset" && "Enviar correo de recuperación"}
          </button>
        </form>

        <div className="text-center text-sm mt-4 space-y-2">
          {mode === "login" && (
            <>
              <p>
                ¿No tienes cuenta?{" "}
                <span
                  onClick={() => setMode("register")}
                  className="text-blue-600 cursor-pointer hover:underline"
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
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Inicia sesión
              </span>
            </p>
          )}

          {mode === "reset" && (
            <p>
              <span
                onClick={() => setMode("login")}
                className="text-blue-600 cursor-pointer hover:underline"
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