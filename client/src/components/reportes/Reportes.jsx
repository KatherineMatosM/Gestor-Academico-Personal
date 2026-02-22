import { useState, useEffect } from "react";
import { FileDown, Layers, BookOpen, CheckSquare, FileText } from "lucide-react";
import { colors as C } from "../../styles/colors";
import { styles } from "../../styles/styles";
import { useAuth } from "../../hooks/useAuth";
import * as materiasService from "../../services/materiasService";
import * as tareasService from "../../services/tareasService";
import * as examenesService from "../../services/examenesService";
import * as apuntesService from "../../services/apuntesService";

export default function Reportes() {
  const { user } = useAuth();
  const [materias, setMaterias] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [apuntes, setApuntes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [materiasData, tareasData, examenesData, apuntesData] = await Promise.all([
        materiasService.getMaterias(),
        tareasService.getTareas(),
        examenesService.getExamenes(),
        apuntesService.getApuntes()
      ]);
      setMaterias(materiasData);
      setTareas(tareasData);
      setExamenes(examenesData);
      setApuntes(apuntesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const generateTxt = (type) => {
    let content = "";
    const sep = "=".repeat(50);
    const line = "-".repeat(50);

    if (type === "general") {
      const activas = materias.filter(m => m.estado === "Activa");
      const prom = activas.length 
        ? Math.round(activas.reduce((s, m) => s + Number(m.nota || 0), 0) / activas.length) 
        : 0;
      
      content = `${sep}\nREPORTE ACADÉMICO GENERAL\nEstudiante: ${user.nombre}\nFecha: ${new Date().toLocaleDateString("es-ES")}\n${sep}\n\nRESUMEN\nPromedio General: ${prom}/100\nMaterias Activas: ${activas.length}\nTareas Totales: ${tareas.length}\nTareas Completadas: ${tareas.filter(t => t.estado === "Completada").length}\nExámenes Registrados: ${examenes.length}\nApuntes: ${apuntes.length}\n\n${line}\nMATERIAS\n${line}\n`;
      
      materias.forEach(m => { 
        content += `• ${m.nombre} (${m.codigo}) – Créditos: ${m.creditos} – Estado: ${m.estado} – Nota: ${m.nota || "N/A"}\n`; 
      });
      
      content += `\n${line}\nTAREAS\n${line}\n`;
      tareas.forEach(t => { 
        const mat = materias.find(x => x.id === t.materiaId); 
        content += `• ${t.titulo} – ${mat?.nombre || "—"} – Estado: ${t.estado} – Límite: ${t.fecha}\n`; 
      });
      
      content += `\n${line}\nEXÁMENES\n${line}\n`;
      examenes.forEach(e => { 
        const mat = materias.find(x => x.id === e.materiaId); 
        content += `• ${e.titulo} – ${mat?.nombre || "—"} – Fecha: ${e.fecha} – Nota: ${e.nota ?? "Pendiente"}\n`; 
      });
    } else if (type === "materia") {
      content = `${sep}\nREPORTE POR MATERIAS\nEstudiante: ${user.nombre}\nFecha: ${new Date().toLocaleDateString("es-ES")}\n${sep}\n\n`;
      
      materias.forEach(m => {
        content += `${line}\n${m.nombre} (${m.codigo})\n${line}\nCréditos: ${m.creditos} | Dificultad: ${m.dificultad} | Estado: ${m.estado} | Nota: ${m.nota || "N/A"}\n`;
        const mTareas = tareas.filter(t => t.materiaId === m.id);
        content += `Tareas: ${mTareas.length} (${mTareas.filter(t => t.estado === "Completada").length} completadas)\n`;
        const mExamenes = examenes.filter(e => e.materiaId === m.id);
        content += `Exámenes: ${mExamenes.length}\n\n`;
      });
    } else if (type === "tareas") {
      content = `${sep}\nREPORTE DE TAREAS\nEstudiante: ${user.nombre}\nFecha: ${new Date().toLocaleDateString("es-ES")}\n${sep}\n\n`;
      content += `Total de tareas: ${tareas.length}\nCompletadas: ${tareas.filter(t => t.estado === "Completada").length}\nEn progreso: ${tareas.filter(t => t.estado === "En Progreso").length}\nPendientes: ${tareas.filter(t => t.estado === "Pendiente").length}\n\n${line}\n`;
      
      tareas.forEach(t => { 
        const mat = materias.find(x => x.id === t.materiaId); 
        content += `[${t.estado}] ${t.titulo}\n  Materia: ${mat?.nombre || "—"} | Tipo: ${t.tipo} | Prioridad: ${t.prioridad} | Fecha límite: ${t.fecha}\n\n`; 
      });
    } else if (type === "examenes") {
      content = `${sep}\nREPORTE DE EXÁMENES\nEstudiante: ${user.nombre}\nFecha: ${new Date().toLocaleDateString("es-ES")}\n${sep}\n\n`;
      content += `Total de exámenes: ${examenes.length}\nCon nota registrada: ${examenes.filter(e => e.nota !== null).length}\nPendientes de nota: ${examenes.filter(e => e.nota === null).length}\n\n${line}\n`;
      
      examenes.forEach(e => { 
        const mat = materias.find(x => x.id === e.materiaId); 
        content += `${e.titulo}\n  Materia: ${mat?.nombre || "—"} | Fecha: ${e.fecha} ${e.hora} | Preparación: ${e.preparacion}%\n  Nota: ${e.nota ?? "Pendiente"} | Autoevaluación: ${e.autoevaluacion || "—"}\n  Temas: ${e.temas || "—"}\n\n`; 
      });
    }

    const encoded = encodeURIComponent(content);
    const a = document.createElement("a");
    a.href = `data:text/plain;charset=utf-8,${encoded}`;
    a.download = `reporte_${type}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reportCards = [
    { 
      title: "Reporte General", 
      desc: "Resumen completo de tu situación académica incluyendo materias, tareas y exámenes.", 
      icon: <Layers size={24} />, 
      type: "general", 
      color: C.orchid 
    },
    { 
      title: "Reporte por Materia", 
      desc: "Detalle desglosado de cada materia con sus tareas y exámenes asociados.", 
      icon: <BookOpen size={24} />, 
      type: "materia", 
      color: C.seafoam 
    },
    { 
      title: "Reporte de Tareas", 
      desc: "Estado actual de todas tus tareas, filtrado por estado y prioridad.", 
      icon: <CheckSquare size={24} />, 
      type: "tareas", 
      color: C.sky 
    },
    { 
      title: "Reporte de Exámenes", 
      desc: "Historial de exámenes con notas, preparación y autoevaluación.", 
      icon: <FileText size={24} />, 
      type: "examenes", 
      color: C.sugar 
    },
  ];

  return (
    <div>
      <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700 }}>Reportes</h2>
      <p style={{ color: C.textLight, fontSize: 14, margin: "0 0 22px" }}>
        Genera y descarga reportes en formato .txt
      </p>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: 18 
      }}>
        {reportCards.map((r, i) => (
          <div 
            key={i} 
            style={{ ...styles.card, display: "flex", flexDirection: "column" }}
          >
            <div style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 14, 
              background: r.color + "18", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: r.color, 
              marginBottom: 14 
            }}>
              {r.icon}
            </div>
            <h4 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700 }}>
              {r.title}
            </h4>
            <p style={{ 
              margin: 0, 
              fontSize: 13, 
              color: C.textLight, 
              flex: 1, 
              lineHeight: 1.5 
            }}>
              {r.desc}
            </p>
            <button 
              onClick={() => generateTxt(r.type)} 
              style={{ 
                ...styles.btn("primary"), 
                marginTop: 16, 
                justifyContent: "center" 
              }}
            >
              <FileDown size={15} /> Descargar .txt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}