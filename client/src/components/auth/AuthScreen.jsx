import { useState } from "react";
import { BookMarked } from "lucide-react";
import { colors as C } from "../../styles/colors";
import { styles } from "../../styles/styles";
import Login from "./Login";
import Register from "./Register";

const GLOBAL_FONT = "'Segoe UI', system-ui, sans-serif";

export default function AuthScreen({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Panel Izquierdo Decorativo */}
        <LeftPanel />

        {/* Panel Derecho - Formularios */}
        <div style={rightPanelStyle}>
          {/* Toggle Tabs */}
          <div style={tabContainerStyle}>
            {["Iniciar Sesión", "Registrarse"].map((label, i) => (
              <button
                key={i}
                onClick={() => setIsLogin(i === 0)}
                style={{
                  ...styles.btn(isLogin === (i === 0) ? "primary" : "ghost"),
                  ...tabButtonStyle,
                  boxShadow: isLogin === (i === 0) 
                    ? "0 2px 6px rgba(0,0,0,0.15)" 
                    : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Formulario Activo */}
          {isLogin ? (
            <Login onAuth={onAuth} onSwitch={() => setIsLogin(false)} />
          ) : (
            <Register onAuth={onAuth} onSwitch={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}

function LeftPanel() {
  return (
    <div style={leftPanelStyle}>
      {/* Decoraciones Geométricas */}
      <div style={decorationTopLeft} />
      <div style={decorationBottomRight} />
      <div style={decorationSquare} />
      <div style={decorationCircle} />

      {/* Contenido Central */}
      <div style={contentCenterStyle}>
        <div style={logoContainerStyle}>
          <BookMarked size={34} color={C.white} />
        </div>
        
        <h2 style={titleStyle}>
          Gestor Académico
        </h2>
        
        <p style={subtitleStyle}>
          Tu asistente académico personal. Organiza, analiza y mejora tu rendimiento.
        </p>
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${C.blackCherry} 0%, ${C.darkblue} 100%)`,
  fontFamily: GLOBAL_FONT,
};

const cardStyle = {
  display: "flex",
  width: 780,
  maxWidth: "95vw",
  minHeight: 460,
  borderRadius: 20,
  overflow: "hidden",
  boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
};

const leftPanelStyle = {
  width: "38%",
  minWidth: "38%",
  background: `linear-gradient(160deg, ${C.blackCherry} 0%, ${C.blackCherryDark} 55%, ${C.darkblue} 100%)`,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 32,
};

const decorationTopLeft = {
  position: "absolute",
  top: -40,
  left: -40,
  width: 160,
  height: 160,
  background: `${C.blackCherryLight}40`,
  borderRadius: "0 0 50% 0",
  transform: "rotate(15deg)",
};

const decorationBottomRight = {
  position: "absolute",
  bottom: -30,
  right: -30,
  width: 130,
  height: 130,
  background: `${C.skyBlue}30`,
  borderRadius: "50% 0 0 0",
  transform: "rotate(-10deg)",
};

const decorationSquare = {
  position: "absolute",
  top: "45%",
  left: "10%",
  width: 80,
  height: 80,
  border: `2px solid ${C.skyBlue}50`,
  borderRadius: 12,
  transform: "rotate(25deg)",
};

const decorationCircle = {
  position: "absolute",
  top: "20%",
  right: "15%",
  width: 50,
  height: 50,
  background: `${C.blueJeans}30`,
  borderRadius: "50%",
};

const contentCenterStyle = {
  position: "relative",
  zIndex: 1,
  textAlign: "center",
};

const logoContainerStyle = {
  width: 72,
  height: 72,
  borderRadius: 18,
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 18px",
};

const titleStyle = {
  color: C.white,
  fontSize: 22,
  fontWeight: 700,
  margin: "0 0 8px",
  fontFamily: GLOBAL_FONT,
};

const subtitleStyle = {
  color: "rgba(255,255,255,0.75)",
  fontSize: 13,
  margin: 0,
  lineHeight: 1.5,
  fontFamily: GLOBAL_FONT,
};

const rightPanelStyle = {
  flex: 1,
  background: C.white,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 36px",
};

const tabContainerStyle = {
  display: "flex",
  background: C.grayLight,
  borderRadius: 10,
  padding: 3,
  marginBottom: 28,
};

const tabButtonStyle = {
  padding: "7px 20px",
  fontSize: 13,
  fontFamily: GLOBAL_FONT,
};