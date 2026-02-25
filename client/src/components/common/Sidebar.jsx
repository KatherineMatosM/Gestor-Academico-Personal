import {
  LayoutDashboard, BookOpen, CheckSquare, FileText, StickyNote,
  Calendar, TrendingUp, FileDown, Settings, LogOut, BookMarked
} from "lucide-react";
import { colors as C } from "../../styles/colors";
import { styles } from "../../styles/styles";

export default function Sidebar({ collapsed, view, setView, onLogout }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "materias", label: "Materias", icon: <BookOpen size={18} /> },
    { id: "tareas", label: "Tareas", icon: <CheckSquare size={18} /> },
    { id: "examenes", label: "Exámenes", icon: <FileText size={18} /> },
    { id: "apuntes", label: "Apuntes", icon: <StickyNote size={18} /> },
    { id: "calendario", label: "Calendario", icon: <Calendar size={18} /> },
    { id: "progreso", label: "Progreso", icon: <TrendingUp size={18} /> },
    { id: "reportes", label: "Reportes", icon: <FileDown size={18} /> },
    { id: "configuracion", label: "Configuración", icon: <Settings size={18} /> },
  ];

  return (
    <div style={styles.sidebar(collapsed)}>
      <div style={styles.sidebarHeader}>
        <div style={styles.sidebarLogo(collapsed)}>
          <div style={styles.logoCircle}>
            <BookMarked size={18} color={C.darkblue} />
          </div>
          {!collapsed && <span style={styles.logoText}>Gestor Académico</span>}
        </div>
      </div>

      <div style={styles.sidebarNav}>
        {navItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => setView(item.id)} 
            style={styles.navItem(view === item.id, collapsed)} 
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 0", borderTop: `1px solid rgba(255,255,255,0.1)` }}>
        <div 
          onClick={onLogout} 
          style={{ ...styles.navItem(false, collapsed), color: "rgba(255,255,255,0.5)" }} 
          title="Cerrar sesión"
        >
          <LogOut size={18} />
          {!collapsed && <span>Cerrar sesión</span>}
        </div>
      </div>
    </div>
  );
}