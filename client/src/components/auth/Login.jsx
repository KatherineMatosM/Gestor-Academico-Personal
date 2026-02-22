import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { colors as C } from "../../styles/colors";
import { styles } from "../../styles/styles";
import { validateEmail, validateRequired } from "../../utils/validators";
import * as authService from "../../services/authService";

export default function Login({ onAuth, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!validateRequired(form.email) || !validateRequired(form.password)) {
      setError("Completa todos los campos.");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Email inválido.");
      return;
    }
    setLoading(true);
    try {
      const result = await authService.login({ email: form.email, password: form.password });
      onAuth(result);
    } catch (err) {
      setError(err.response?.data?.message || "Credenciales inválidas.");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4, textAlign: "center" }}>
        Bienvenido de vuelta
      </h3>
      <p style={{ fontSize: 13, color: C.textLight, marginBottom: 24, textAlign: "center" }}>
        Ingresa tus credenciales para continuar
      </p>

      <label style={{ ...styles.label, alignSelf: "flex-start" }}>Correo electrónico</label>
      <div style={{ position: "relative", marginBottom: 14, width: "100%" }}>
        <Mail size={16} color={C.grayMid} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <input
          style={{ ...styles.input, paddingLeft: 34 }}
          placeholder="tu@correo.com"
          type="email"
          value={form.email}
          onKeyDown={handleKeyDown}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <label style={{ ...styles.label, alignSelf: "flex-start" }}>Contraseña</label>
      <div style={{ position: "relative", marginBottom: 14, width: "100%" }}>
        <Lock size={16} color={C.grayMid} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <input
          style={{ ...styles.input, paddingLeft: 34, paddingRight: 36 }}
          placeholder="••••••••"
          type={showPass ? "text" : "password"}
          value={form.password}
          onKeyDown={handleKeyDown}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          onClick={() => setShowPass(!showPass)}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.grayMid }}
        >
          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && (
        <p style={{ color: "#e85d5d", fontSize: 13, margin: "0 0 10px", textAlign: "center" }}>{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ ...styles.btn("primary"), width: "100%", justifyContent: "center", padding: "11px 0", fontSize: 15, marginTop: 6, borderRadius: 10, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Cargando..." : "Iniciar Sesión"} {!loading && <ArrowRight size={16} />}
      </button>
    </>
  );
}