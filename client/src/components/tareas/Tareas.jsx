import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import Modal from "../common/Modal";
import FormRow from "../common/FormRow";
import SelectInput from "../common/SelectInput";
import { colors as C } from "../../styles/colors";
import { styles } from "../../styles/styles";
import { today } from "../../utils/formatDate";
import { TIPOS_TAREA, PRIORIDADES, ESTADOS_TAREA } from "../../utils/constants";
import * as tareasService from "../../services/tareasService";
import * as materiasService from "../../services/materiasService";

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("Todas");
  const [form, setForm] = useState({ 
    titulo: "", 
    materiaId: "", 
    tipo: "Estudio", 
    fecha: today(), 
    prioridad: "Media", 
    estado: "Pendiente" 
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tareasData, materiasData] = await Promise.all([
        tareasService.getTareas(),
        materiasService.getMaterias()
      ]);
      console.log('Tareas cargadas:', tareasData);
      setTareas(tareasData);
      setMaterias(materiasData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const open = (t) => {
    if (t) {
      let fechaFormateada = t.fecha;
      if (t.fecha && t.fecha.includes('T')) {
        fechaFormateada = t.fecha.split('T')[0];
      }
      
      setForm({ 
        ...t, 
        materiaId: String(t.materiaId),
        fecha: fechaFormateada
      });
      setEditing(t.id);
    } else {
      setForm({ 
        titulo: "", 
        materiaId: materias[0]?.id ? String(materias[0].id) : "", 
        tipo: "Estudio", 
        fecha: today(), 
        prioridad: "Media", 
        estado: "Pendiente" 
      });
      setEditing(null);
    }
    setModal(true);
  };

  const save = async () => {
    if (!form.titulo || !form.fecha) {
      alert("El título y la fecha son obligatorios");
      return;
    }
    
    const data = { 
      ...form, 
      materiaId: Number(form.materiaId) 
    };

    console.log('Guardando tarea:', data);

    try {
      if (editing) {
        await tareasService.updateTarea(editing, data);
      } else {
        await tareasService.createTarea(data);
      }
      await loadData();
      setModal(false);
    } catch (error) {
      console.error("Error guardando tarea:", error);
      alert("Error al guardar la tarea: " + (error.response?.data?.message || error.message));
    }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    try {
      await tareasService.deleteTarea(id);
      loadData();
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  const toggleState = async (id, newState) => {
    try {
      const tarea = tareas.find(t => t.id === id);
      await tareasService.updateTarea(id, { ...tarea, estado: newState });
      loadData();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const filtered = filter === "Todas" ? tareas : tareas.filter(t => t.estado === filter);
  const prioColor = { Alta: C.blackCherry, Media: C.skyBlue, Baja: C.blueJeans };
  const stateColor = { Pendiente: C.silverStars, "En Progreso": C.skyBlue, Completada: C.blueJeans };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        marginBottom: 16 
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Tareas</h2>
          <p style={{ color: C.textLight, fontSize: 14, margin: "4px 0 0" }}>
            Organiza tus tareas académicas
          </p>
        </div>
        <button onClick={() => open()} style={styles.btn("primary")}>
          <Plus size={15} /> Nueva Tarea
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["Todas", "Pendiente", "En Progreso", "Completada"].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            style={{ 
              ...styles.btn(filter === f ? "primary" : "secondary"), 
              padding: "6px 14px", 
              fontSize: 12 
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(t => {
          const materia = materias.find(m => m.id === t.materiaId);
          let fechaMostrar = t.fecha;
          if (t.fecha && t.fecha.includes('T')) {
            fechaMostrar = t.fecha.split('T')[0];
          }
          
          return (
            <div 
              key={t.id} 
              style={{ 
                ...styles.cardSm, 
                display: "flex", 
                alignItems: "center", 
                gap: 14 
              }}
            >
              <div style={{ 
                width: 8, 
                height: 8, 
                borderRadius: "50%", 
                background: stateColor[t.estado], 
                flexShrink: 0 
              }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{t.titulo}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textLight }}>
                  {materia?.nombre || "Sin materia"} · {t.tipo} · Límite: {fechaMostrar}
                </p>
              </div>
              <span style={styles.badge(prioColor[t.prioridad])}>{t.prioridad}</span>
              <select 
                value={t.estado} 
                onChange={e => toggleState(t.id, e.target.value)} 
                style={{ 
                  padding: "5px 8px", 
                  borderRadius: 8, 
                  border: `1px solid ${C.grayLight}`, 
                  fontSize: 12, 
                  background: C.offWhite, 
                  cursor: "pointer" 
                }}
              >
                <option>Pendiente</option>
                <option>En Progreso</option>
                <option>Completada</option>
              </select>
              <button 
                onClick={() => open(t)} 
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
                onClick={() => remove(t.id)} 
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
          );
        })}
        {filtered.length === 0 && (
          <p style={{ 
            color: C.textLight, 
            fontSize: 14, 
            padding: 20, 
            textAlign: "center" 
          }}>
            No hay tareas en esta categoría.
          </p>
        )}
      </div>

      <Modal 
        open={modal} 
        onClose={() => setModal(false)} 
        title={editing ? "Editar Tarea" : "Nueva Tarea"}
      >
        <FormRow label="Título *">
          <input 
            style={styles.input} 
            value={form.titulo} 
            onChange={e => setForm({ ...form, titulo: e.target.value })} 
            placeholder="Título de la tarea"
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
          <FormRow label="Tipo">
            <SelectInput 
              value={form.tipo} 
              onChange={v => setForm({ ...form, tipo: v })} 
              options={TIPOS_TAREA} 
            />
          </FormRow>
          <FormRow label="Fecha límite *">
            <input 
              style={styles.input} 
              type="date" 
              value={form.fecha} 
              onChange={e => setForm({ ...form, fecha: e.target.value })} 
            />
          </FormRow>
          <FormRow label="Prioridad">
            <SelectInput 
              value={form.prioridad} 
              onChange={v => setForm({ ...form, prioridad: v })} 
              options={PRIORIDADES} 
            />
          </FormRow>
          <FormRow label="Estado">
            <SelectInput 
              value={form.estado} 
              onChange={v => setForm({ ...form, estado: v })} 
              options={ESTADOS_TAREA} 
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