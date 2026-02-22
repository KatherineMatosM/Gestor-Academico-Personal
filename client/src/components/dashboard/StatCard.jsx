import { styles } from "../../styles/styles";
import { colors as C } from "../../styles/colors";

export default function StatCard({ label, value, unit, accent, icon }) {
  return (
    <div style={styles.statCard(accent)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ 
            margin: 0, 
            fontSize: 11, 
            fontWeight: 600, 
            color: C.textLight, 
            textTransform: "uppercase", 
            letterSpacing: "0.5px" 
          }}>
            {label}
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 800, color: accent }}>
            {value}
            <span style={{ fontSize: 13, fontWeight: 500, color: C.textLight }}>
              {unit}
            </span>
          </p>
        </div>
        <div style={{ 
          width: 44, 
          height: 44, 
          borderRadius: 12, 
          background: accent + "18", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          color: accent 
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}