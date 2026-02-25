import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import Modal from "../common/Modal";
import FormRow from "../common/FormRow";
import SelectInput from "../common/SelectInput";
import { colors as C } from "../../styles/colors";
import { styles } from "../../styles/styles";
import { DIFICULTADES, ESTADOS_MATERIA } from "../../utils/constants";
import * as materiasService from "../../services/materiasService";

export default function Materias() {
  const [materias, setMaterias] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    nombre: "", 
    codigo: "", 
    creditos: 3, 
    dificultad: "Media", 
    estado: "Activa", 
    nota: "" 
  });

  useEffect(() => {
    loadMaterias();
  }, []);

  const loadMaterias = async () => {
    try {
      const data = await materiasService.getMaterias();
      setMaterias(data);
    } catch (error) {
      console.error("Error cargando materias:", error);
    }
  };

  const open = (m) => {
    if (m) {
      setForm({ ...m, nota: m.nota ?? "" });
      setEditing(m.id);
    } else {
      setForm({ 
        nombre: "", 
        codigo: "", 
        creditos: 3, 
        dificultad: "Media", 
        estado: "Activa", 
        nota: "" 
      });
      setEditing(null);
    }
    setModal(true);
  };

  const save = async () => {
    if (!form.nombre || !form.codigo) return;
    
    const cleaned = { 
      ...form, 
      nota: form.nota !== "" && form.nota !== null ? Number(form.nota) : null, 
      creditos: Number(form.creditos) 
    };

    try {
      if (editing) {
        await materiasService.updateMateria(editing, cleaned);
      } else {
        await materiasService.createMateria(cleaned);
      }
      loadMaterias();
      setModal(false);
    } catch (error) {
      console.error("Error guardando materia:", error);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar esta materia?")) return;
    try {
      await materiasService.deleteMateria(id);
      loadMaterias();
    } catch (error) {
      console.error("Error eliminando materia:", error);
    }
  };

  const diffColor = { Alta: C.blackCherry, Media: C.skyBlue, Baja: C.blueJeans };
  const stateColor = { Activa: C.blueJeans, Completada: C.skyBlue, Suspendida: C.silverStars };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        marginBottom: 20 
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Materias</h2>
          <p style={{ color: C.textLight, fontSize: 14, margin: "4px 0 0" }}>
            Gestiona tus materias académicas
          </p>
        </div>
        <button onClick={() => open()} style={styles.btn("primary")}>
          <Plus size={15} /> Nueva Materia
        </button>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: 16 
      }}>
        {materias.map(m => (
          <div key={m.id} style={{ ...styles.card, position: "relative" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-start" 
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, maxWidth: 190 }}>
                  {m.nombre}
                </h4>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: C.textLight }}>
                  {m.codigo} · {m.creditos} créditos
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button 
                  onClick={() => open(m)} 
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
                  onClick={() => remove(m.id)} 
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
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <span style={styles.badge(diffColor[m.dificultad])}>{m.dificultad}</span>
              <span style={styles.badge(stateColor[m.estado])}>{m.estado}</span>
              {m.nota !== null && (
                <span style={{ 
                  marginLeft: "auto", 
                  fontSize: 18, 
                  fontWeight: 800, 
                  color: C.blackCherry 
                }}>
                  {m.nota}
                  <span style={{ fontSize: 11, fontWeight: 500, color: C.textLight }}>
                    /100
                  </span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal 
        open={modal} 
        onClose={() => setModal(false)} 
        title={editing ? "Editar Materia" : "Nueva Materia"}
      >
        <FormRow label="Nombre">
          <input 
            style={styles.input} 
            value={form.nombre} 
            onChange={e => setForm({ ...form, nombre: e.target.value })} 
          />
        </FormRow>
        <FormRow label="Código">
          <input 
            style={styles.input} 
            value={form.codigo} 
            onChange={e => setForm({ ...form, codigo: e.target.value })} 
          />
        </FormRow>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormRow label="Créditos">
            <input 
              style={styles.input} 
              type="number" 
              min={1} 
              max={8} 
              value={form.creditos} 
              onChange={e => setForm({ ...form, creditos: Number(e.target.value) })} 
            />
          </FormRow>
          <FormRow label="Nota">
            <input 
              style={styles.input} 
              type="number" 
              min={0} 
              max={100} 
              placeholder="0–100" 
              value={form.nota} 
              onChange={e => setForm({ ...form, nota: e.target.value })} 
            />
          </FormRow>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormRow label="Dificultad">
            <SelectInput 
              value={form.dificultad} 
              onChange={v => setForm({ ...form, dificultad: v })} 
              options={DIFICULTADES} 
            />
          </FormRow>
          <FormRow label="Estado">
            <SelectInput 
              value={form.estado} 
              onChange={v => setForm({ ...form, estado: v })} 
              options={ESTADOS_MATERIA} 
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