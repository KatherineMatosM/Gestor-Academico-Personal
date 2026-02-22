import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import AuthScreen from "./components/auth/AuthScreen";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";
import Materias from "./components/materias/Materias";
import Tareas from "./components/tareas/Tareas";
import Examenes from "./components/examenes/Examenes";
import Apuntes from "./components/apuntes/Apuntes";
import Calendario from "./components/calendario/Calendario";
import Progreso from "./components/progreso/Progreso";
import Reportes from "./components/reportes/Reportes";
import Configuracion from "./components/configuracion/Configuracion";
import { Menu, User } from "lucide-react";
import { colors as C } from "./styles/colors";
import { styles } from "./styles/styles";

export default function App() {
  const { user, login, logout } = useAuth();
  const [sidebar, setSidebar] = useState(false);
  const [view, setView] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al iniciar
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    console.log('Usuario almacenado:', storedUser);
    console.log('Token almacenado:', storedToken);
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}>
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={login} />;
  }

  const viewMap = {
    dashboard: <Dashboard />,
    materias: <Materias />,
    tareas: <Tareas />,
    examenes: <Examenes />,
    apuntes: <Apuntes />,
    calendario: <Calendario />,
    progreso: <Progreso />,
    reportes: <Reportes />,
    configuracion: <Configuracion />,
  };

  const nombreUsuario =
    typeof user === "object"
      ? user.nombre || user.user?.nombre || "Usuario"
      : "Usuario";

  return (
    <div style={styles.layout}>
      <Sidebar
        collapsed={sidebar}
        view={view}
        setView={setView}
        onLogout={logout}
      />

      <div style={styles.main}>
        <div style={styles.topBar}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => setSidebar(!sidebar)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: C.coffee,
                padding: 4,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title={sidebar ? "Expandir menú" : "Colapsar menú"}
            >
              <Menu size={22} />
            </button>
            <div style={{ width: 1, height: 28, background: C.grayLight }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: C.coffee }}>
              Gestor Académico
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
              {nombreUsuario}
            </span>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${C.seafoam}, ${C.seafoam})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={17} color={C.white} />
            </div>
          </div>
        </div>

        <div style={styles.content}>{viewMap[view]}</div>
      </div>
    </div>
  );
}