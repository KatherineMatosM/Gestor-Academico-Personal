import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Plus, Edit2, Trash2, X, CheckCircle2 } from "lucide-react";
import Modal from "../common/Modal";
import FormRow from "../common/FormRow";
import SelectInput from "../common/SelectInput";
import { colors as C } from "../../styles/colors";
import { styles } from "../../styles/styles";
import { formatDate, today } from "../../utils/formatDate";
import { TIPOS_TAREA, PRIORIDADES, ESTADOS_TAREA } from "../../utils/constants";
import * as tareasService from "../../services/tareasService";
import * as examenesService from "../../services/examenesService";
import * as materiasService from "../../services/materiasService";

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tareas, setTareas] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [newEvent, setNewEvent] = useState({ tipo: "tarea", titulo: "", materiaId: "", fecha: "" });
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tareasData, examenesData, materiasData] = await Promise.all([
        tareasService.getTareas(),
        examenesService.getExamenes(),
        materiasService.getMaterias()
      ]);
      setTareas(tareasData);
      setExamenes(examenesData);
      setMaterias(materiasData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return { 
      tareas: tareas.filter(t => t.fecha === dateStr), 
      examenes: examenes.filter(e => e.fecha === dateStr) 
    };
  };

  const openAdd = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDay(day);
    setNewEvent({ 
      tipo: "tarea", 
      titulo: "", 
      materiaId: materias[0]?.id ? String(materias[0].id) : "", 
      fecha: dateStr 
    });
    setModal(true);
  };

  const saveEvent = async () => {
    if (!newEvent.titulo) return;
    
    try {
      if (newEvent.tipo === "tarea") {
        await tareasService.createTarea({ 
          titulo: newEvent.titulo, 
          materiaId: Number(newEvent.materiaId), 
          tipo: "Estudio", 
          fecha: newEvent.fecha, 
          prioridad: "Media", 
          estado: "Pendiente" 
        });
      } else {
        await examenesService.createExamen({ 
          titulo: newEvent.titulo, 
          materiaId: Number(newEvent.materiaId), 
          fecha: newEvent.fecha, 
          hora: "10:00", 
          temas: "", 
          preparacion: 0, 
          nota: null, 
          autoevaluacion: "" 
        });
      }
      loadData();
      setModal(false);
    } catch (error) {
      console.error("Error guardando evento:", error);
    }
  };

  const openEdit = (tipo, item) => {
    if (tipo === "tarea") {
      setEditTarget({ tipo, form: { ...item, materiaId: String(item.materiaId) } });
    } else {
      setEditTarget({ tipo, form: { ...item, materiaId: String(item.materiaId), nota: item.nota ?? "" } });
    }
  };

  const saveEdit = async () => {
    if (!editTarget || !editTarget.form.titulo) return;
    
    try {
      if (editTarget.tipo === "tarea") {
        const data = { ...editTarget.form, materiaId: Number(editTarget.form.materiaId) };
        await tareasService.updateTarea(data.id, data);
      } else {
        const data = { 
          ...editTarget.form, 
          materiaId: Number(editTarget.form.materiaId), 
          preparacion: Number(editTarget.form.preparacion), 
          nota: editTarget.form.nota !== "" ? Number(editTarget.form.nota) : null 
        };
        await examenesService.updateExamen(data.id, data);
      }
      loadData();
      setEditTarget(null);
    } catch (error) {
      console.error("Error actualizando:", error);
    }
  };

  const setEditForm = (key, val) => setEditTarget(prev => ({ 
    ...prev, 
    form: { ...prev.form, [key]: val } 
  }));

  const removeTarea = async (id) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    try {
      await tareasService.deleteTarea(id);
      loadData();
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  const removeExamen = async (id) => {
    if (!window.confirm("¿Eliminar este examen?")) return;
    try {
      await examenesService.deleteExamen(id);
      loadData();
    } catch (error) {
      console.error("Error eliminando examen:", error);
    }
  };

  const todayStr = today();

  return (
    <div>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        marginBottom: 20 
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Calendario</h2>
          <p style={{ color: C.textLight, fontSize: 14, margin: "4px 0 0" }}>
            Vista mensual de tareas y exámenes
          </p>
        </div>
      </div>

      <div style={styles.card}>
        {/* Month nav */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          marginBottom: 18 
        }}>
          <button 
            onClick={prev} 
            style={{ 
              background: "none", 
              border: `1px solid ${C.grayLight}`, 
              borderRadius: 8, 
              padding: "6px 10px", 
              cursor: "pointer", 
              color: C.text 
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <h3 style={{ 
            margin: 0, 
            fontSize: 17, 
            fontWeight: 700, 
            textTransform: "capitalize" 
          }}>
            {monthName}
          </h3>
          <button 
            onClick={next} 
            style={{ 
              background: "none", 
              border: `1px solid ${C.grayLight}`, 
              borderRadius: 8, 
              padding: "6px 10px", 
              cursor: "pointer", 
              color: C.text 
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(7, 1fr)", 
          gap: 4, 
          marginBottom: 6 
        }}>
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => (
            <div 
              key={d} 
              style={{ 
                textAlign: "center", 
                fontSize: 11, 
                fontWeight: 700, 
                color: C.textLight, 
                padding: "6px 0" 
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {Array.from({ length: (firstDay === 0 ? 6 : firstDay - 1) }).map((_, i) => (
            <div key={"e" + i} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const events = getEventsForDay(day);
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = dateStr === todayStr;
            const hasEvents = events.tareas.length > 0 || events.examenes.length > 0;

            const visibleExams = events.examenes.slice(0, 1);
            const remainAfterExams = events.examenes.length - visibleExams.length;
            const slotsLeft = 2 - visibleExams.length;
            const visibleTareas = events.tareas.slice(0, Math.max(slotsLeft, 0));
            const extraCount = remainAfterExams + (events.tareas.length - visibleTareas.length);

            return (
              <div 
                key={day} 
                style={{ 
                  height: 96, 
                  borderRadius: 10, 
                  border: `1px solid ${isToday ? C.orchid : C.grayLight}`, 
                  background: isToday ? C.orchid + "08" : C.white, 
                  padding: "4px 5px", 
                  cursor: "pointer", 
                  position: "relative", 
                  overflow: "hidden", 
                  transition: "background 0.2s" 
                }}
                onClick={() => openAdd(day)}
              >
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                }}>
                  <span style={{ 
                    fontSize: 12, 
                    fontWeight: isToday ? 800 : 600, 
                    color: isToday ? C.orchid : C.text 
                  }}>
                    {day}
                  </span>
                  {hasEvents && (
                    <div style={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: "50%", 
                      background: events.examenes.length > 0 ? C.orchid : C.sky 
                    }} />
                  )}
                </div>
                {visibleExams.map(e => (
                  <div 
                    key={"ex" + e.id} 
                    style={{ 
                      fontSize: 9, 
                      background: C.orchid + "22", 
                      color: C.orchidDark, 
                      padding: "1px 4px", 
                      borderRadius: 4, 
                      marginTop: 2, 
                      whiteSpace: "nowrap", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis", 
                      fontWeight: 600 
                    }}
                  >
                    {e.titulo}
                  </div>
                ))}
                {visibleTareas.map(t => (
                  <div 
                    key={"t" + t.id} 
                    style={{ 
                      fontSize: 9, 
                      background: C.sky + "22", 
                      color: C.sky, 
                      padding: "1px 4px", 
                      borderRadius: 4, 
                      marginTop: 2, 
                      whiteSpace: "nowrap", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis" 
                    }}
                  >
                    {t.titulo}
                  </div>
                ))}
                {extraCount > 0 && (
                  <div style={{ fontSize: 9, color: C.textLight, marginTop: 2 }}>
                    +{extraCount} más
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ 
          display: "flex", 
          gap: 18, 
          marginTop: 18, 
          justifyContent: "center" 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              borderRadius: 3, 
              background: C.orchid + "33" 
            }} />
            <span style={{ fontSize: 12, color: C.textLight }}>Exámenes</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              borderRadius: 3, 
              background: C.sky + "33" 
            }} />
            <span style={{ fontSize: 12, color: C.textLight }}>Tareas</span>
          </div>
        </div>
      </div>

      {/* Day detail panel */}
      {selectedDay && (() => {
        const events = getEventsForDay(selectedDay);
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
        return (
          <div style={{ ...styles.card, marginTop: 16 }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              marginBottom: 12 
            }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                Eventos del {formatDate(dateStr)}
              </h4>
              <button 
                onClick={() => setSelectedDay(null)} 
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  color: C.grayMid 
                }}
              >
                <X size={18} />
              </button>
            </div>
            {events.examenes.map(e => (
              <div 
                key={e.id} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  padding: "8px 0", 
                  borderBottom: `1px solid ${C.grayLight}` 
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={styles.badge(C.orchid)}>Examen</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{e.titulo}</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button 
                    onClick={() => openEdit("examen", e)} 
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
                    onClick={() => removeExamen(e.id)} 
                    style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      color: "#e85d5d" 
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {events.tareas.map(t => (
              <div 
                key={t.id} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  padding: "8px 0", 
                  borderBottom: `1px solid ${C.grayLight}` 
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={styles.badge(C.sky)}>Tarea</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t.titulo}</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button 
                    onClick={() => openEdit("tarea", t)} 
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
                    onClick={() => removeTarea(t.id)} 
                    style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      color: "#e85d5d" 
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {events.tareas.length === 0 && events.examenes.length === 0 && (
              <p style={{ color: C.textLight, fontSize: 13 }}>Sin eventos este día.</p>
            )}
          </div>
        );
      })()}

      {/* Modal: agregar evento */}
      <Modal 
        open={modal} 
        onClose={() => setModal(false)} 
        title={`Agregar evento – ${selectedDay ? formatDate(`${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`) : ""}`}
      >
        <FormRow label="Tipo de evento">
          <div style={{ display: "flex", gap: 8 }}>
            {["tarea", "examen"].map(t => (
              <button 
                key={t} 
                onClick={() => setNewEvent({ ...newEvent, tipo: t })} 
                style={{ 
                  ...styles.btn(newEvent.tipo === t ? "primary" : "secondary"), 
                  flex: 1, 
                  justifyContent: "center", 
                  textTransform: "capitalize" 
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </FormRow>
        <FormRow label="Título">
          <input 
            style={styles.input} 
            value={newEvent.titulo} 
            onChange={e => setNewEvent({ ...newEvent, titulo: e.target.value })} 
          />
        </FormRow>
        <FormRow label="Materia">
          <SelectInput 
            value={newEvent.materiaId} 
            onChange={v => setNewEvent({ ...newEvent, materiaId: v })} 
            options={materias.map(m => ({ value: String(m.id), label: m.nombre }))} 
          />
        </FormRow>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          <button onClick={() => setModal(false)} style={styles.btn("secondary")}>
            Cancelar
          </button>
          <button onClick={saveEvent} style={styles.btn("primary")}>
            <Plus size={15} /> Agregar
          </button>
        </div>
      </Modal>

      {/* Modal: editar tarea */}
      <Modal 
        open={editTarget?.tipo === "tarea"} 
        onClose={() => setEditTarget(null)} 
        title="Editar Tarea"
      >
        {editTarget?.tipo === "tarea" && (
          <>
            <FormRow label="Título">
              <input 
                style={styles.input} 
                value={editTarget.form.titulo} 
                onChange={e => setEditForm("titulo", e.target.value)} 
              />
            </FormRow>
            <FormRow label="Materia">
              <SelectInput 
                value={editTarget.form.materiaId} 
                onChange={v => setEditForm("materiaId", v)} 
                options={materias.map(m => ({ value: String(m.id), label: m.nombre }))} 
              />
            </FormRow>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormRow label="Tipo">
                <SelectInput 
                  value={editTarget.form.tipo} 
                  onChange={v => setEditForm("tipo", v)} 
                  options={TIPOS_TAREA} 
                />
              </FormRow>
              <FormRow label="Fecha límite">
                <input 
                  style={styles.input} 
                  type="date" 
                  value={editTarget.form.fecha} 
                  onChange={e => setEditForm("fecha", e.target.value)} 
                />
              </FormRow>
              <FormRow label="Prioridad">
                <SelectInput 
                  value={editTarget.form.prioridad} 
                  onChange={v => setEditForm("prioridad", v)} 
                  options={PRIORIDADES} 
                />
              </FormRow>
              <FormRow label="Estado">
                <SelectInput 
                  value={editTarget.form.estado} 
                  onChange={v => setEditForm("estado", v)} 
                  options={ESTADOS_TAREA} 
                />
              </FormRow>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button onClick={() => setEditTarget(null)} style={styles.btn("secondary")}>
                Cancelar
              </button>
              <button onClick={saveEdit} style={styles.btn("primary")}>
                <CheckCircle2 size={15} /> Guardar
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Modal: editar examen */}
      <Modal 
        open={editTarget?.tipo === "examen"} 
        onClose={() => setEditTarget(null)} 
        title="Editar Examen"
      >
        {editTarget?.tipo === "examen" && (
          <>
            <FormRow label="Título">
              <input 
                style={styles.input} 
                value={editTarget.form.titulo} 
                onChange={e => setEditForm("titulo", e.target.value)} 
              />
            </FormRow>
            <FormRow label="Materia">
              <SelectInput 
                value={editTarget.form.materiaId} 
                onChange={v => setEditForm("materiaId", v)} 
                options={materias.map(m => ({ value: String(m.id), label: m.nombre }))} 
              />
            </FormRow>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormRow label="Fecha">
                <input 
                  style={styles.input} 
                  type="date" 
                  value={editTarget.form.fecha} 
                  onChange={e => setEditForm("fecha", e.target.value)} 
                />
              </FormRow>
              <FormRow label="Hora">
                <input 
                  style={styles.input} 
                  type="time" 
                  value={editTarget.form.hora} 
                  onChange={e => setEditForm("hora", e.target.value)} 
                />
              </FormRow>
            </div>
            <FormRow label="Temas a estudiar">
              <input 
                style={styles.input} 
                placeholder="Ej: Árboles, Grafos..." 
                value={editTarget.form.temas} 
                onChange={e => setEditForm("temas", e.target.value)} 
              />
            </FormRow>
            <FormRow label={`Nivel de preparación: ${editTarget.form.preparacion}%`}>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={editTarget.form.preparacion} 
                onChange={e => setEditForm("preparacion", Number(e.target.value))} 
                style={{ width: "100%", accentColor: C.orchid }} 
              />
            </FormRow>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormRow label="Nota obtenida">
                <input 
                  style={styles.input} 
                  type="number" 
                  placeholder="0–100" 
                  value={editTarget.form.nota} 
                  onChange={e => setEditForm("nota", e.target.value)} 
                />
              </FormRow>
              <FormRow label="Autoevaluación">
                <SelectInput 
                  value={editTarget.form.autoevaluacion} 
                  onChange={v => setEditForm("autoevaluacion", v)} 
                  options={[
                    { value: "", label: "— Sin evaluar —" },
                    "Muy bien",
                    "Bien",
                    "Regular",
                    "Mal"
                  ]} 
                />
              </FormRow>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button onClick={() => setEditTarget(null)} style={styles.btn("secondary")}>
                Cancelar
              </button>
              <button onClick={saveEdit} style={styles.btn("primary")}>
                <CheckCircle2 size={15} /> Guardar
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}