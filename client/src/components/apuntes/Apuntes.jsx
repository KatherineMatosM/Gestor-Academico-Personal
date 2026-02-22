import { useState, useEffect } from "react";
import { Plus, Trash2, Search, CheckCircle2, Edit2 } from "lucide-react";
import Modal from "../common/Modal";
import FormRow from "../common/FormRow";
import SelectInput from "../common/SelectInput";
import { colors as C } from "../../styles/colors";
import { styles } from "../../styles/styles";
import { formatDate, today } from "../../utils/formatDate";
import * as apuntesService from "../../services/apuntesService";
import * as materiasService from "../../services/materiasService";

export default function Apuntes() {
  const [apuntes, setApuntes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ 
    titulo: "", 
    materiaId: "", 
    contenido: "", 
    fecha: today() 
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [apuntesData, materiasData] = await Promise.all([
        apuntesService.getApuntes(),
        materiasService.getMaterias()
      ]);
      console.log('Apuntes cargados:', apuntesData);
      setApuntes(apuntesData);
      setMaterias(materiasData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const open = (a) => {
    if (a) {
      console.log('Editando apunte:', a);
      setForm({ 
        titulo: a.titulo || "",
        materiaId: String(a.materiaId),
        contenido: a.contenido || "",
        fecha: a.fecha || today()
      });
      setEditing(a.id);
    } else {
      setForm({ 
        titulo: "", 
        materiaId: materias[0]?.id ? String(materias[0].id) : "", 
        contenido: "", 
        fecha: today() 
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

    if (!form.contenido) {
      alert("El contenido es obligatorio");
      return;
    }
    
    const data = { 
      titulo: form.titulo,
      materiaId: Number(form.materiaId),
      contenido: form.contenido,
      fecha: form.fecha
    };

    console.log('Guardando apunte:', data);

    try {
      if (editing) {
        await apuntesService.updateApunte(editing, data);
      } else {
        await apuntesService.createApunte(data);
      }
      await loadData();
      setModal(false);
    } catch (error) {
      console.error("Error guardando apunte:", error);
      alert("Error al guardar el apunte: " + (error.response?.data?.message || error.message));
    }
  };

  const remove = async (id, e) => {
    e.stopPropagation(); // Evitar que se abra el modal al eliminar
    if (!window.confirm("¿Eliminar este apunte?")) return;
    try {
      await apuntesService.deleteApunte(id);
      loadData();
    } catch (error) {
      console.error("Error eliminando apunte:", error);
    }
  };

  const filtered = apuntes.filter(a => 
    a.titulo.toLowerCase().includes(search.toLowerCase()) || 
    a.contenido.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        marginBottom: 16 
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Apuntes</h2>
          <p style={{ color: C.textLight, fontSize: 14, margin: "4px 0 0" }}>
            Notas y apuntes de clase
          </p>
        </div>
        <button onClick={() => open()} style={styles.btn("primary")}>
          <Plus size={15} /> Nuevo Apunte
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 18, maxWidth: 340 }}>
        <Search 
          size={15} 
          color={C.grayMid} 
          style={{ 
            position: "absolute", 
            left: 12, 
            top: "50%", 
            transform: "translateY(-50%)" 
          }} 
        />
        <input 
          style={{ ...styles.input, paddingLeft: 34 }} 
          placeholder="Buscar apuntes..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: 16 
      }}>
        {filtered.map(a => {
          const mat = materias.find(m => m.id === a.materiaId);
          return (
            <div 
              key={a.id} 
              style={{ 
                ...styles.card, 
                display: "flex", 
                flexDirection: "column", 
                minHeight: 140,
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(85,67,69,0.12)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(85,67,69,0.08)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={styles.badge(C.orchid)}>{mat?.codigo || "—"}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      open(a);
                    }} 
                    style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      color: C.textLight,
                      padding: 4
                    }}
                    title="Editar apunte"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button 
                    onClick={(e) => remove(a.id, e)} 
                    style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      color: "#e85d5d",
                      padding: 4
                    }}
                    title="Eliminar apunte"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div 
                onClick={() => open(a)}
                style={{ 
                  flex: 1,
                  cursor: "pointer"
                }}
              >
                <h4 style={{ margin: "10px 0 4px", fontSize: 15, fontWeight: 700 }}>
                  {a.titulo}
                </h4>
                <p style={{ 
                  margin: 0, 
                  fontSize: 13, 
                  color: C.textLight, 
                  lineHeight: 1.5, 
                  overflow: "hidden", 
                  display: "-webkit-box", 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: "vertical" 
                }}>
                  {a.contenido}
                </p>
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 11, color: C.gray }}>
                {formatDate(a.fecha)}
              </p>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ 
          color: C.textLight, 
          fontSize: 14, 
          padding: 20, 
          textAlign: "center" 
        }}>
          {search ? "No se encontraron apuntes con ese término de búsqueda." : "No hay apuntes registrados."}
        </p>
      )}

      <Modal 
        open={modal} 
        onClose={() => setModal(false)} 
        title={editing ? "Editar Apunte" : "Nuevo Apunte"} 
        width={600}
      >
        <FormRow label="Título *">
          <input 
            style={styles.input} 
            value={form.titulo} 
            onChange={e => setForm({ ...form, titulo: e.target.value })} 
            placeholder="Título del apunte"
          />
        </FormRow>
        <FormRow label="Materia">
          <SelectInput 
            value={form.materiaId} 
            onChange={v => setForm({ ...form, materiaId: v })} 
            options={materias.map(m => ({ value: String(m.id), label: m.nombre }))} 
          />
        </FormRow>
        <FormRow label="Contenido *">
          <textarea 
            style={{ 
              ...styles.input, 
              minHeight: 140, 
              resize: "vertical", 
              fontFamily: "inherit" 
            }} 
            value={form.contenido} 
            onChange={e => setForm({ ...form, contenido: e.target.value })} 
            placeholder="Escribe el contenido del apunte aquí..."
          />
        </FormRow>
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