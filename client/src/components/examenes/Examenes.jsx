import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, Clock } from "lucide-react";
import Modal from "../common/Modal";
import FormRow from "../common/FormRow";
import SelectInput from "../common/SelectInput";
import { colors as C } from "../../styles/colors";
import { styles } from "../../styles/styles";
import { formatDate, today } from "../../utils/formatDate";
import { AUTOEVALUACIONES } from "../../utils/constants";
import * as examenesService from "../../services/examenesService";
import * as materiasService from "../../services/materiasService";

export default function Examenes() {
  const [examenes, setExamenes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    titulo: "", 
    materiaId: "", 
    fecha: today(), 
    hora: "10:00", 
    temas: "", 
    preparacion: 0, 
    nota: "", 
    autoevaluacion: "" 
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [examenesData, materiasData] = await Promise.all([
        examenesService.getExamenes(),
        materiasService.getMaterias()
      ]);
      console.log('Exámenes cargados:', examenesData);
      setExamenes(examenesData);
      setMaterias(materiasData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const open = (e) => {
    if (e) {
      let fechaFormateada = e.fecha;
      if (e.fecha) {
        if (e.fecha.includes('T')) {
          fechaFormateada = e.fecha.split('T')[0];
        } else if (e.fecha.includes(' ')) {
          fechaFormateada = e.fecha.split(' ')[0];
        }
      }

      console.log('Abriendo examen para editar:', e);
      console.log('Fecha formateada:', fechaFormateada);
      
      setForm({ 
        titulo: e.titulo || "",
        materiaId: String(e.materiaId),
        fecha: fechaFormateada || today(),
        hora: e.hora || "10:00",
        temas: e.temas || "",
        preparacion: e.preparacion || 0,
        nota: e.nota !== null && e.nota !== undefined ? String(e.nota) : "",
        autoevaluacion: e.autoevaluacion || ""
      });
      setEditing(e.id);
    } else {
      setForm({ 
        titulo: "", 
        materiaId: materias[0]?.id ? String(materias[0].id) : "", 
        fecha: today(), 
        hora: "10:00", 
        temas: "", 
        preparacion: 0, 
        nota: "", 
        autoevaluacion: "" 
      });
      setEditing(null);
    }
    setModal(true);
  };

  const save = async () => {
    if (!form.titulo) {
      alert("El título es obligatorio");
      return;
    }

    if (!form.fecha) {
      alert("La fecha es obligatoria");
      return;
    }

    if (!form.hora) {
      alert("La hora es obligatoria");
      return;
    }
    
    const data = { 
      titulo: form.titulo,
      materiaId: Number(form.materiaId), 
      fecha: form.fecha,
      hora: form.hora,
      temas: form.temas || "",
      preparacion: Number(form.preparacion), 
      nota: form.nota !== "" ? Number(form.nota) : null,
      autoevaluacion: form.autoevaluacion || ""
    };

    console.log('Guardando examen:', data);

    try {
      if (editing) {
        await examenesService.updateExamen(editing, data);
      } else {
        await examenesService.createExamen(data);
      }
      await loadData();
      setModal(false);
    } catch (error) {
      console.error("Error guardando examen:", error);
      alert("Error al guardar el examen: " + (error.response?.data?.message || error.message));
    }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar este examen?")) return;
    try {
      await examenesService.deleteExamen(id);
      loadData();
    } catch (error) {
      console.error("Error eliminando examen:", error);
    }
  };

  const prepColor = (v) => v >= 70 ? C.blueJeans : v >= 40 ? C.skyBlue : C.blackCherry;

  return (
    <div>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        marginBottom: 20 
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Exámenes</h2>
          <p style={{ color: C.textLight, fontSize: 14, margin: "4px 0 0" }}>
            Registra y haz seguimiento de tus exámenes
          </p>
        </div>
        <button onClick={() => open()} style={styles.btn("primary")}>
          <Plus size={15} /> Nuevo Examen
        </button>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", 
        gap: 16 
      }}>
        {examenes.map(e => {
          const mat = materias.find(m => m.id === e.materiaId);
          
          let fechaComparar = e.fecha;
          if (e.fecha && e.fecha.includes('T')) {
            fechaComparar = e.fecha.split('T')[0];
          } else if (e.fecha && e.fecha.includes(' ')) {
            fechaComparar = e.fecha.split(' ')[0];
          }
          
          const isPast = new Date(fechaComparar + "T23:59:59") < new Date();
          
          return (
            <div key={e.id} style={{ ...styles.card, position: "relative" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start" 
              }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{e.titulo}</h4>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textLight }}>
                    {mat?.nombre || "Sin materia"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button 
                    onClick={() => open(e)} 
                    style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      color: C.textLight 
                    }}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button 
                    onClick={() => remove(e.id)} 
                    style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      color: "#e85d5d" 
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              
              <p style={{ margin: "10px 0 0", fontSize: 12, color: C.textLight }}>
                <Clock size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
                {formatDate(fechaComparar)} · {e.hora}
              </p>
              <p style={{ margin: "4px 0 10px", fontSize: 12, color: C.textLight }}>
                Temas: {e.temas || "—"}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ 
                  fontSize: 11, 
                  fontWeight: 600, 
                  color: C.textLight, 
                  width: 80 
                }}>
                  Preparación
                </span>
                <div style={{ 
                  flex: 1, 
                  height: 7, 
                  borderRadius: 4, 
                  background: C.grayLight 
                }}>
                  <div style={{ 
                    width: `${e.preparacion}%`, 
                    height: "100%", 
                    borderRadius: 4, 
                    background: prepColor(e.preparacion), 
                    transition: "width 0.4s" 
                  }} />
                </div>
                <span style={{ 
                  fontSize: 12, 
                  fontWeight: 700, 
                  color: prepColor(e.preparacion) 
                }}>
                  {e.preparacion}%
                </span>
              </div>

              {e.nota !== null && (
                <div style={{ 
                  marginTop: 10, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8 
                }}>
                  <span style={{ fontSize: 12, color: C.textLight }}>Nota:</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: C.blackCherry }}>
                    {e.nota}
                  </span>
                  {e.autoevaluacion && (
                    <span style={{ fontSize: 12, color: C.textLight }}>
                      · {e.autoevaluacion}
                    </span>
                  )}
                </div>
              )}

              {isPast && e.nota === null && (
                <span style={{ 
                  ...styles.badge(C.silverStars), 
                  marginTop: 8, 
                  display: "inline-block" 
                }}>
                  Pendiente calificación
                </span>
              )}
            </div>
          );
        })}
      </div>

      <Modal 
        open={modal} 
        onClose={() => setModal(false)} 
        title={editing ? "Editar Examen" : "Nuevo Examen"}
      >
        <FormRow label="Título *">
          <input 
            style={styles.input} 
            value={form.titulo} 
            onChange={e => setForm({ ...form, titulo: e.target.value })} 
            placeholder="Título del examen"
          />
        </FormRow>
        <FormRow label="Materia">
          <SelectInput 
            value={form.materiaId} 
            onChange={v => setForm({ ...form, materiaId: v })} 
            options={materias.map(m => ({ value: String(m.id), label: m.nombre }))} 
          />
        </FormRow>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormRow label="Fecha *">
            <input 
              style={styles.input} 
              type="date" 
              value={form.fecha} 
              onChange={e => {
                console.log('Nueva fecha seleccionada:', e.target.value);
                setForm({ ...form, fecha: e.target.value });
              }} 
            />
          </FormRow>
          <FormRow label="Hora *">
            <input 
              style={styles.input} 
              type="time" 
              value={form.hora} 
              onChange={e => setForm({ ...form, hora: e.target.value })} 
            />
          </FormRow>
        </div>
        <FormRow label="Temas a estudiar">
          <input 
            style={styles.input} 
            placeholder="Ej: Árboles, Grafos..." 
            value={form.temas} 
            onChange={e => setForm({ ...form, temas: e.target.value })} 
          />
        </FormRow>
        <FormRow label={`Nivel de preparación: ${form.preparacion}%`}>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={form.preparacion} 
            onChange={e => setForm({ ...form, preparacion: Number(e.target.value) })} 
            style={{ width: "100%", accentColor: C.blackCherry }} 
          />
        </FormRow>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormRow label="Nota obtenida">
            <input 
              style={styles.input} 
              type="number" 
              placeholder="0–100" 
              value={form.nota} 
              onChange={e => setForm({ ...form, nota: e.target.value })} 
            />
          </FormRow>
          <FormRow label="Autoevaluación">
            <SelectInput 
              value={form.autoevaluacion} 
              onChange={v => setForm({ ...form, autoevaluacion: v })} 
              options={AUTOEVALUACIONES} 
            />
          </FormRow>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          <button onClick={() => setModal(false)} style={styles.btn("secondary")}>
            Cancelar
          </button>
          <button onClick={save} style={styles.btn("primary")}>
            <CheckCircle2 size={15} /> Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}