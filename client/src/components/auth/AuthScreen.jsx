import { useState } from "react";
import { BookMarked } from "lucide-react";
import { colors as C } from "../../styles/colors";
import { styles } from "../../styles/styles";
import Login from "./Login";
import Register from "./Register";

export default function AuthScreen({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${C.blackCherry} 0%, ${C.darkblue} 100%)` }}>
      <div style={{ display: "flex", width: 780, maxWidth: "95vw", minHeight: 460, borderRadius: 20, overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.35)" }}>

        <div style={{ width: "38%", minWidth: "38%", background: `linear-gradient(160deg, ${C.blackCherry} 0%, ${C.blackCherryDark} 55%, ${C.darkblue} 100%)`, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <div style={{ position: "absolute", top: -40, left: -40, width: 160, height: 160, background: `${C.blackCherryLight}40`, borderRadius: "0 0 50% 0", transform: "rotate(15deg)" }} />
          <div style={{ position: "absolute", bottom: -30, right: -30, width: 130, height: 130, background: `${C.skyBlue}30`, borderRadius: "50% 0 0 0", transform: "rotate(-10deg)" }} />
          <div style={{ position: "absolute", top: "45%", left: "10%", width: 80, height: 80, border: `2px solid ${C.skyBlue}50`, borderRadius: 12, transform: "rotate(25deg)" }} />
          <div style={{ position: "absolute", top: "20%", right: "15%", width: 50, height: 50, background: `${C.blueJeans}30`, borderRadius: "50%" }} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <BookMarked size={34} color={C.white} />
            </div>
            <h2 style={{ color: C.white, fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Gestor Académico</h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              Tu asistente académico personal. Organiza, analiza y mejora tu rendimiento.
            </p>
          </div>
        </div>

        <div style={{ flex: 1, background: C.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 36px" }}>
          <div style={{ display: "flex", background: C.grayLight, borderRadius: 10, padding: 3, marginBottom: 28 }}>
            {["Iniciar Sesión", "Registrarse"].map((label, i) => (
              <button
                key={i}
                onClick={() => setIsLogin(i === 0)}
                style={{ ...styles.btn(isLogin === (i === 0) ? "primary" : "ghost"), padding: "7px 20px", fontSize: 13, boxShadow: isLogin === (i === 0) ? "0 2px 6px rgba(0,0,0,0.15)" : "none" }}
              >
                {label}
              </button>
            ))}
          </div>

          {isLogin
            ? <Login onAuth={onAuth} onSwitch={() => setIsLogin(false)} />
            : <Register onAuth={onAuth} onSwitch={() => setIsLogin(true)} />
          }
        </div>
      </div>
    </div>
  );
}