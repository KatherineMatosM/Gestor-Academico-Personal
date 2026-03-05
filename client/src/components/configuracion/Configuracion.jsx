import { useState } from "react";
import { User, Lock, Eye, EyeOff, CheckCircle2, Trash2 } from "lucide-react";
import FormRow from "../common/FormRow";
import { colors as C } from "../../styles/colors";
import { styles } from "../../styles/styles";
import { useAuth } from "../../hooks/useAuth";
import { validateEmail } from "../../utils/validators";
import * as authService from "../../services/authService";

export default function Configuracion() {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({ nombre: user.nombre, email: user.email });
  const [saved, setSaved] = useState(false);

  const [passForm, setPassForm] = useState({ actual: "", nueva: "", confirma: "" });
  const [passError, setPassError] = useState("");
  const [passSaved, setPassSaved] = useState(false);
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirma, setShowConfirma] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  const save = async () => {
    if (!validateEmail(form.email)) {
      alert("Email inválido");
      return;
    }
    
    try {
      const updatedUser = await authService.updateProfile({
        nombre: form.nombre,
        email: form.email
      });
      updateUser(updatedUser);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (error) {
      alert("Error al actualizar el perfil: " + (error.response?.data?.message || error.message));
    }
  };

  const savePassword = async () => {
    setPassError("");
    
    if (!passForm.actual || !passForm.nueva || !passForm.confirma) {
      setPassError("Completa todos los campos.");
      return;
    }
    
    if (passForm.nueva !== passForm.confirma) {
      setPassError("Las nuevas contraseñas no coinciden.");
      return;
    }
    
    if (passForm.nueva.length < 4) {
      setPassError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    setLoadingPassword(true);

    try {
      await authService.changePassword({
        currentPassword: passForm.actual,
        newPassword: passForm.nueva
      });

      setPassForm({ actual: "", nueva: "", confirma: "" });
      setPassSaved(true);
      setTimeout(() => setPassSaved(false), 2200);
    } catch (error) {
      setPassError(error.response?.data?.message || "Error al cambiar la contraseña");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "ELIMINAR") {
      alert('Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    setLoadingDelete(true);
    try {
      await authService.deleteAccount();
      logout();
    } catch (error) {
      alert("Error al eliminar cuenta: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700 }}>Configuración</h2>
      <p style={{ color: C.textLight, fontSize: 14, margin: "0 0 24px" }}>
        Gestiona tu perfil y preferencias
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Perfil */}
        <div style={{ ...styles.card, display: "flex", flexDirection: "column" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 16, 
            marginBottom: 24, 
            paddingBottom: 20, 
            borderBottom: `1px solid ${C.grayLight}` 
          }}>
            <div style={{ 
              width: 60, 
              height: 60, 
              borderRadius: 16, 
              background: `linear-gradient(135deg, ${C.blackCherryLight}, ${C.blackCherryLight})`, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              <User size={28} color={C.white} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{user.nombre}</p>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: C.textLight }}>
                {user.email}
              </p>
            </div>
          </div>

          <FormRow label="Nombre completo">
            <input 
              style={styles.input} 
              value={form.nombre} 
              onChange={e => setForm({ ...form, nombre: e.target.value })} 
            />
          </FormRow>
          <FormRow label="Correo electrónico">
            <input 
              style={styles.input} 
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })} 
            />
          </FormRow>

          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
            <button onClick={save} style={styles.btn("primary")}>
              <CheckCircle2 size={15} /> Guardar Cambios
            </button>
            {saved && (
              <span style={{ 
                fontSize: 13, 
                color: C.seafoam, 
                fontWeight: 600, 
                display: "flex", 
                alignItems: "center", 
                gap: 4 
              }}>
                <CheckCircle2 size={14} /> Guardado
              </span>
            )}
          </div>
        </div>

        {/* Contraseña */}
        <div style={{ ...styles.card, display: "flex", flexDirection: "column" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            marginBottom: 20, 
            paddingBottom: 16, 
            borderBottom: `1px solid ${C.grayLight}` 
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12, 
              background: C.blackCherry + "18", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              <Lock size={20} color={C.blackCherry} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                Cambiar contraseña
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: C.textLight }}>
                Actualiza tu contraseña de seguridad
              </p>
            </div>
          </div>

          <FormRow label="Contraseña actual">
            <div style={{ position: "relative" }}>
              <input 
                style={{ ...styles.input, paddingRight: 38 }} 
                type={showActual ? "text" : "password"} 
                placeholder="••••••••" 
                value={passForm.actual} 
                onChange={e => setPassForm({ ...passForm, actual: e.target.value })} 
              />
              <button 
                onClick={() => setShowActual(!showActual)} 
                style={{ 
                  position: "absolute", 
                  right: 12, 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  color: C.grayMid 
                }}
              >
                {showActual ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormRow>

          <FormRow label="Nueva contraseña">
            <div style={{ position: "relative" }}>
              <input 
                style={{ ...styles.input, paddingRight: 38 }} 
                type={showNueva ? "text" : "password"} 
                placeholder="••••••••" 
                value={passForm.nueva} 
                onChange={e => setPassForm({ ...passForm, nueva: e.target.value })} 
              />
              <button 
                onClick={() => setShowNueva(!showNueva)} 
                style={{ 
                  position: "absolute", 
                  right: 12, 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  color: C.grayMid 
                }}
              >
                {showNueva ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormRow>

          <FormRow label="Confirmar nueva contraseña">
            <div style={{ position: "relative" }}>
              <input 
                style={{ ...styles.input, paddingRight: 38 }} 
                type={showConfirma ? "text" : "password"} 
                placeholder="••••••••" 
                value={passForm.confirma} 
                onChange={e => setPassForm({ ...passForm, confirma: e.target.value })} 
              />
              <button 
                onClick={() => setShowConfirma(!showConfirma)} 
                style={{ 
                  position: "absolute", 
                  right: 12, 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  color: C.grayMid 
                }}
              >
                {showConfirma ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormRow>

          {passError && (
            <p style={{ color: "#e85d5d", fontSize: 13, margin: "0 0 10px" }}>
              {passError}
            </p>
          )}

          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
            <button 
              onClick={savePassword} 
              disabled={loadingPassword}
              style={{
                ...styles.btn("primary"),
                opacity: loadingPassword ? 0.7 : 1,
                cursor: loadingPassword ? "not-allowed" : "pointer"
              }}
            >
              <Lock size={15} /> {loadingPassword ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
            {passSaved && (
              <span style={{ 
                fontSize: 13, 
                color: C.seafoam, 
                fontWeight: 600, 
                display: "flex", 
                alignItems: "center", 
                gap: 4 
              }}>
                <CheckCircle2 size={14} /> Contraseña actualizada
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ZONA PELIGROSA */}
      <div style={{ ...styles.card, marginTop: 24, borderColor: "#730F1A" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#730F1A" }}>
          Zona Peligrosa
        </h3>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: C.textLight }}>
          Una vez que elimines tu cuenta, no hay vuelta atrás. Ten cuidado.
        </p>
        <button 
          onClick={() => setShowDeleteModal(true)} 
          style={styles.btn("danger")}
        >
          <Trash2 size={15} /> Eliminar Cuenta
        </button>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {showDeleteModal && (
        <div 
          style={{ 
            position: "fixed", 
            inset: 0, 
            background: "rgba(61,47,42,0.6)", 
            zIndex: 1000, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }} 
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            style={{ 
              background: C.white, 
              borderRadius: 16, 
              width: 480, 
              maxWidth: "92vw", 
              padding: 24,
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)" 
            }} 
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700, color: "#730F1A" }}>
               Eliminar Cuenta Permanentemente
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: 14, color: C.text, lineHeight: 1.6 }}>
              Esta acción es <strong>irreversible</strong>. Se eliminarán todos tus datos:
              materias, tareas, exámenes, apuntes y reportes.
            </p>
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: C.text }}>
              Escribe <strong>"ELIMINAR"</strong> para confirmar:
            </p>
            <input 
              style={{ ...styles.input, marginBottom: 16 }} 
              placeholder="ELIMINAR" 
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button 
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }} 
                style={styles.btn("secondary")}
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={loadingDelete || deleteConfirm !== "ELIMINAR"}
                style={{
                  ...styles.btn("danger"),
                  opacity: (loadingDelete || deleteConfirm !== "ELIMINAR") ? 0.5 : 1,
                  cursor: (loadingDelete || deleteConfirm !== "ELIMINAR") ? "not-allowed" : "pointer"
                }}
              >
                <Trash2 size={15} /> {loadingDelete ? "Eliminando..." : "Eliminar Definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}