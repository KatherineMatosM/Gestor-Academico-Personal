import { X } from "lucide-react";
import { colors as C } from "../../styles/colors";

export default function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null;

  return (
    <div 
      style={{ 
        position: "fixed", 
        inset: 0, 
        background: "rgba(61,47,42,0.45)", 
        zIndex: 1000, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        backdropFilter: "blur(3px)" 
      }} 
      onClick={onClose}
    >
      <div 
        style={{ 
          background: C.white, 
          borderRadius: 16, 
          width, 
          maxWidth: "92vw", 
          maxHeight: "85vh", 
          overflowY: "auto", 
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)" 
        }} 
        onClick={e => e.stopPropagation()}
      >
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            padding: "20px 24px 12px", 
            borderBottom: `1px solid ${C.grayLight}` 
          }}
        >
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}>
            {title}
          </h3>
          <button 
            onClick={onClose} 
            style={{ 
              background: "none", 
              border: "none", 
              cursor: "pointer", 
              color: C.grayMid 
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: "20px 24px 24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}