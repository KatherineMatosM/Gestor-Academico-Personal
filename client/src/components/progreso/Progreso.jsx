import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { colors as C, PIE_COLORS } from "../../styles/colors";
import { styles } from "../../styles/styles";
import {
  LineChart, Line, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import * as materiasService from "../../services/materiasService";
import * as tareasService from "../../services/tareasService";
import * as examenesService from "../../services/examenesService";

export default function Progreso() {
  const [materias, setMaterias] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [examenes, setExamenes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [materiasData, tareasData, examenesData] = await Promise.all([
        materiasService.getMaterias(),
        tareasService.getTareas(),
        examenesService.getExamenes()
      ]);
      setMaterias(materiasData);
      setTareas(tareasData);
      setExamenes(examenesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const activas = materias.filter(m => m.estado === "Activa" && m.nota !== null);
  const promGeneral = activas.length 
    ? Math.round(activas.reduce((s, m) => s + Number(m.nota), 0) / activas.length) 
    : 0;
  const completadas = tareas.filter(t => t.estado === "Completada").length;
  const totalTareas = tareas.length;
  const examConNota = examenes.filter(e => e.nota !== null);
  const promExamenes = examConNota.length 
    ? Math.round(examConNota.reduce((s, e) => s + Number(e.nota), 0) / examConNota.length) 
    : 0;

  const atRisk = activas.filter(m => m.nota < 60);
  const warning = activas.filter(m => m.nota >= 60 && m.nota < 75);

  const lineData = activas.map((m, i) => ({ 
    name: m.codigo, 
    nota: m.nota, 
    index: i + 1 
  }));

  const completionData = [
    { name: "Completadas", value: completadas },
    { name: "Pendientes", value: totalTareas - completadas },
  ];

  return (
    <div>
      <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700 }}>
        Progreso Académico
      </h2>
      <p style={{ color: C.textLight, fontSize: 14, margin: "0 0 22px" }}>
        Indicadores y evolución de tu rendimiento
      </p>

      {/* Top stats */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", 
        gap: 14, 
        marginBottom: 22 
      }}>
        {[
          { label: "Promedio General", val: promGeneral, unit: "/100", color: C.orchid },
          { label: "Tareas Completadas", val: `${completadas}/${totalTareas}`, unit: "", color: C.seafoam },
          { label: "Prom. Exámenes", val: promExamenes, unit: "/100", color: C.sky },
          { label: "Materias en Riesgo", val: atRisk.length, unit: "", color: "#e85d5d" },
        ].map((s, i) => (
          <div key={i} style={styles.statCard(s.color)}>
            <p style={{ 
              margin: 0, 
              fontSize: 11, 
              fontWeight: 600, 
              color: C.textLight, 
              textTransform: "uppercase", 
              letterSpacing: "0.5px" 
            }}>
              {s.label}
            </p>
            <p style={{ 
              margin: "6px 0 0", 
              fontSize: 26, 
              fontWeight: 800, 
              color: s.color 
            }}>
              {s.val}
              <span style={{ fontSize: 12, fontWeight: 500, color: C.textLight }}>
                {s.unit}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Risk alerts */}
      {(atRisk.length > 0 || warning.length > 0) && (
        <div style={{ marginBottom: 20 }}>
          {atRisk.map(m => (
            <div 
              key={m.id} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 10, 
                background: "#fff0f0", 
                border: "1px solid #f0c0c0", 
                borderRadius: 10, 
                padding: "10px 14px", 
                marginBottom: 8 
              }}
            >
              <AlertTriangle size={18} color="#e85d5d" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#c04040" }}>
                Riesgo alto: {m.nombre} — Nota: {m.nota}
              </span>
            </div>
          ))}
          {warning.map(m => (
            <div 
              key={m.id} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 10, 
                background: "#fffbe8", 
                border: "1px solid #e8d890", 
                borderRadius: 10, 
                padding: "10px 14px", 
                marginBottom: 8 
              }}
            >
              <AlertTriangle size={18} color="#c8a400" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#9a7a00" }}>
                Atención: {m.nombre} — Nota: {m.nota}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18 }}>
        <div style={styles.card}>
          <h4 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>
            Evolución por Materia
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grayLight} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.textLight }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: C.textLight }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
              <Line 
                type="monotone" 
                dataKey="nota" 
                stroke={C.orchid} 
                strokeWidth={3} 
                dot={{ fill: C.orchid, r: 5 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <h4 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>
            Completitud Tareas
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <Pie 
                data={completionData} 
                cx="50%" 
                cy="50%" 
                innerRadius={45} 
                outerRadius={72} 
                dataKey="value" 
                label={({ name, value }) => `${name}: ${value}`} 
                labelLine={{ stroke: C.grayMid }} 
                fontSize={11}
              >
                <Cell fill={C.seafoam} />
                <Cell fill={C.grayLight} />
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-materia progress bars */}
      <div style={{ ...styles.card, marginTop: 18 }}>
        <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>
          Detalle por Materia
        </h4>
        {activas.map((m, i) => (
          <div key={m.id} style={{ marginBottom: i < activas.length - 1 ? 16 : 0 }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: 6 
            }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{m.nombre}</span>
              <span style={{ 
                fontSize: 13, 
                fontWeight: 800, 
                color: m.nota >= 75 ? C.seafoam : m.nota >= 60 ? C.sky : "#e85d5d" 
              }}>
                {m.nota}/100
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: C.grayLight }}>
              <div style={{ 
                width: `${m.nota}%`, 
                height: "100%", 
                borderRadius: 4, 
                background: m.nota >= 75 ? C.seafoam : m.nota >= 60 ? C.sky : "#e85d5d", 
                transition: "width 0.5s" 
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}