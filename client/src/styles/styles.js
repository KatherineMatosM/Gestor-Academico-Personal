import { colors as C } from "./colors";

export const styles = {
  layout: { 
    display: "flex", 
    height: "100vh", 
    fontFamily: "'Segoe UI', system-ui, sans-serif", 
    background: C.offWhite, 
    color: C.text, 
    overflow: "hidden" 
  },
  
  sidebar: (collapsed) => ({
    width: collapsed ? 68 : 240, 
    minWidth: collapsed ? 68 : 240, 
    background: C.darkblue,
    display: "flex", 
    flexDirection: "column", 
    transition: "width 0.3s ease, min-width 0.3s ease",
    zIndex: 10, 
    position: "relative", 
    overflow: "hidden"
  }),
  
  sidebarHeader: { 
    padding: "24px 0 20px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    borderBottom: `1px solid rgba(255,255,255,0.1)` 
  },
  
  sidebarLogo: (collapsed) => ({
    display: "flex", 
    alignItems: "center", 
    gap: 10, 
    padding: collapsed ? "0" : "0 20px",
    justifyContent: collapsed ? "center" : "flex-start"
  }),
  
  logoCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    background: `linear-gradient(135deg, ${C.blackCherryLight}, ${C.blackCherryLight})`, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    flexShrink: 0 
  },
  
  logoText: { 
    color: C.white, 
    fontWeight: 700, 
    fontSize: 15, 
    whiteSpace: "nowrap", 
    overflow: "hidden" 
  },
  
  sidebarNav: { 
    flex: 1, 
    padding: "16px 0", 
    overflowY: "auto" 
  },
  
  navItem: (active, collapsed) => ({
    display: "flex", 
    alignItems: "center", 
    gap: 12, 
    padding: collapsed ? "10px 0" : "10px 20px",
    justifyContent: collapsed ? "center" : "flex-start",
    cursor: "pointer", 
    margin: collapsed ? "2px 8px" : "2px 12px", 
    borderRadius: 10,
    background: active ? `rgba(115,15,26,0.18)` : "transparent",
    color: active ? C.blackCherry : "rgba(255,255,255,0.65)", 
    transition: "all 0.2s",
    fontSize: 14, 
    fontWeight: active ? 600 : 500, 
    whiteSpace: "nowrap"
  }),
  
  main: { 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    overflow: "hidden" 
  },
  
  topBar: { 
    height: 64, 
    background: C.white, 
    borderBottom: `1px solid ${C.grayLight}`, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between", 
    padding: "0 28px", 
    flexShrink: 0, 
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)" 
  },
  
  content: { 
    flex: 1, 
    overflowY: "auto", 
    padding: 28 
  },
  
  card: { 
    background: C.white, 
    borderRadius: 14, 
    padding: 20, 
    boxShadow: "0 2px 12px rgba(85,67,69,0.08)", 
    border: `1px solid ${C.grayLight}` 
  },
  
  cardSm: { 
    background: C.white, 
    borderRadius: 12, 
    padding: 16, 
    boxShadow: "0 2px 8px rgba(85,67,69,0.06)", 
    border: `1px solid ${C.grayLight}` 
  },
  
  btn: (variant = "primary") => ({
    display: "inline-flex", 
    alignItems: "center", 
    gap: 6, 
    padding: "9px 18px", 
    borderRadius: 9, 
    border: "none", 
    cursor: "pointer", 
    fontWeight: 600, 
    fontSize: 13, 
    transition: "all 0.2s",
    background: variant === "primary" ? `linear-gradient(135deg, ${C.blackCherry}, ${C.blackCherryDark})` : 
                variant === "secondary" ? C.grayLight : 
                variant === "danger" ? "#e85d5d" : "transparent",
    color: variant === "primary" || variant === "danger" ? C.white : 
           variant === "secondary" ? C.text : C.blackCherry
  }),
  
  input: { 
    width: "100%", 
    padding: "10px 14px", 
    borderRadius: 9, 
    border: `1.5px solid ${C.grayLight}`, 
    fontSize: 14, 
    outline: "none", 
    background: C.offWhite, 
    color: C.text, 
    boxSizing: "border-box", 
    transition: "border-color 0.2s" 
  },
  
  label: { 
    fontSize: 12, 
    fontWeight: 600, 
    color: C.textLight, 
    marginBottom: 4, 
    display: "block", 
    textTransform: "uppercase", 
    letterSpacing: "0.5px" 
  },
  
  badge: (color) => ({ 
    display: "inline-block", 
    padding: "3px 10px", 
    borderRadius: 20, 
    fontSize: 11, 
    fontWeight: 600, 
    background: color + "22", 
    color: color 
  }),
  
  statCard: (accent) => ({ 
    background: C.white, 
    borderRadius: 14, 
    padding: "18px 20px", 
    boxShadow: "0 2px 12px rgba(85,67,69,0.08)", 
    border: `1px solid ${C.grayLight}` 
  }),
};