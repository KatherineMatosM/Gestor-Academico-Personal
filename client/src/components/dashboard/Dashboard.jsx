import { useState, useEffect, useMemo } from "react";
import { BarChart2, BookOpen, CheckSquare, Calendar } from "lucide-react";
import StatCard from "./StatCard";
import { colors as C, PIE_COLORS } from "../../styles/colors";
import { styles } from "../../styles/styles";
import { formatDate } from "../../utils/formatDate";
import {
  BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from "recharts";
import * as materiasService from "../../services/materiasService";
import * as tareasService from "../../services/tareasService";
import * as examenesService from "../../services/examenesService";

export default function Dashboard() {
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

  const activas = materias.filter(m => m.estado === "Activa");
  const pendientes = tareas.filter(t => t.estado !== "Completada").length;
  const promedioGeneral = activas.length 
    ? Math.round(activas.reduce((s, m) => s + Number(m.nota || 0), 0) / activas.length) 
    : 0;

  const hoy = new Date();
  const proximosExamenes = examenes
    .filter(e => new Date(e.fecha + "T00:00:00") >= hoy)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(0, 3);

  const barData = activas.map(m => ({ name: m.codigo, nota: m.nota || 0 }));

  const taskByState = [
    { name: "Pendientes", value: tareas.filter(t => t.estado === "Pendiente").length },
    { name: "En Progreso", value: tareas.filter(t => t.estado === "En Progreso").length },
    { name: "Completadas", value: tareas.filter(t => t.estado === "Completada").length },
  ];

  const weekData = useMemo(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);

    return ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d, i) => {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + i);
      const dateStr = currentDay.toISOString().split('T')[0];

      const tareasDelDia = tareas.filter(t => t.fecha === dateStr).length;
      const examenesDelDia = examenes.filter(e => e.fecha === dateStr).length;

      return {
        name: d,
        tareas: tareasDelDia,
        exámenes: examenesDelDia
      };
    });
  }, [tareas, examenes]);

  const statCards = [
    { label: "Promedio General", value: promedioGeneral, unit: "/100", accent: C.blackCherry, icon: <BarChart2 size={22} /> },
    { label: "Materias Activas", value: activas.length, unit: "", accent: C.blueJeans, icon: <BookOpen size={22} /> },
    { label: "Tareas Pendientes", value: pendientes, unit: "", accent: C.skyBlue, icon: <CheckSquare size={22} /> },
    { label: "Exámenes Próximos", value: proximosExamenes.length, unit: "", accent: C.silverStars, icon: <Calendar size={22} /> },
  ];

  return (
    <div>
      <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700 }}>Dashboard</h2>
      <p style={{ color: C.textLight, fontSize: 14, margin: "0 0 22px" }}>
        Resumen de tu actividad académica
      </p>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", 
        gap: 16, 
        marginBottom: 24 
      }}>
        {statCards.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18, marginBottom: 24 }}>
        <div style={styles.card}>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>
            Notas por Materia
          </h4>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grayLight} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.textLight }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: C.textLight }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.grayLight}`, fontSize: 13 }} />
                <Bar dataKey="nota" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: C.textLight, fontSize: 13, textAlign: 'center', padding: 40 }}>
              No hay materias con notas registradas
            </p>
          )}
        </div>

        <div style={styles.card}>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>
            Tareas por Estado
          </h4>
          {tareas.length > 0 ? (
            <ResponsiveContainer width="100%" height={190}>
              <RechartsPie>
                <Pie 
                  data={taskByState} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={42} 
                  outerRadius={68} 
                  dataKey="value" 
                  label={({ name, value }) => `${name}: ${value}`} 
                  labelLine={{ stroke: C.grayMid }} 
                  fontSize={11}
                >
                  {taskByState.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: C.textLight, fontSize: 13, textAlign: 'center', padding: 40 }}>
              No hay tareas registradas
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>
        <div style={styles.card}>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>
            Actividad Semanal
          </h4>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="gTareas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.blackCherry} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.blackCherry} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExamenes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.skyBlue} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.skyBlue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grayLight} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.textLight }} />
              <YAxis tick={{ fontSize: 11, fill: C.textLight }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
              <Legend iconType="circle" iconSize={10} />
              <Area 
                type="monotone" 
                dataKey="tareas" 
                stroke={C.blackCherry} 
                fill="url(#gTareas)" 
                strokeWidth={2} 
                name="Tareas" 
              />
              <Area 
                type="monotone" 
                dataKey="exámenes" 
                stroke={C.skyBlue} 
                fill="url(#gExamenes)" 
                strokeWidth={2} 
                name="Exámenes" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <h4 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>
            Exámenes Próximos
          </h4>
          {proximosExamenes.length === 0 && (
            <p style={{ color: C.textLight, fontSize: 13 }}>No hay exámenes próximos.</p>
          )}
          {proximosExamenes.map((e, i) => (
            <div 
              key={i} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                padding: "10px 0", 
                borderBottom: i < proximosExamenes.length - 1 ? `1px solid ${C.grayLight}` : "none" 
              }}
            >
              <div style={{ 
                width: 38, 
                height: 38, 
                borderRadius: 10, 
                background: C.skyBlue + "18", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <Calendar size={18} color={C.skyBlue} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{e.titulo}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: C.textLight }}>
                  {formatDate(e.fecha)} · {e.hora}
                </p>
              </div>
              <span style={styles.badge(C.skyBlue)}>{e.preparacion}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}