# PLAN DE PRUEBAS - GESTOR ACADÉMICO

**Proyecto:** Sistema de Gestión Académica  
**Versión:** 1.0  
**Fecha:** 12 Marzo 2026  
**Responsable:** [Katherine matos]  
**Matrícula:** [2024-1577]

---

## 1. OBJETIVO

Verificar el correcto funcionamiento de los módulos principales del sistema mediante pruebas unitarias, de integración y funcionales, garantizando la calidad del software.

---

## 2. ALCANCE

### 2.1 Módulos Incluidos
- Autenticación (Registro, Login, Cambio de contraseña, Eliminación de cuenta)
- Gestión de Materias (CRUD completo)
- Gestión de Tareas (CRUD completo con filtros)
- Gestión de Exámenes (CRUD completo con preparación)
- Gestión de Apuntes (CRUD completo con búsqueda)
- Dashboard con estadísticas y gráficos
- Calendario académico
- Análisis de progreso
- Generación de reportes

### 2.2 Fuera de Alcance
- Pruebas de rendimiento y carga
- Pruebas de seguridad avanzadas
- Compatibilidad con navegadores antiguos
- Pruebas de accesibilidad

---

## 3. TIPOS DE PRUEBAS

### 3.1 Pruebas Unitarias
Validar funciones individuales de validación y helpers del backend.

### 3.2 Pruebas de Integración
Validar flujos completos que involucran frontend, backend y base de datos.

### 3.3 Pruebas Funcionales
Validar casos de uso desde la interfaz de usuario.

---

## 4. CASOS DE PRUEBA

### CP-001: Registro de Usuario Nuevo
- **Módulo:** Autenticación
- **Prioridad:** Alta
- **Descripción:** Validar que un usuario puede registrarse con datos válidos
- **Pasos:**
  1. Navegar a pantalla de registro
  2. Ingresar nombre completo, email válido y contraseña (mínimo 8 caracteres)
  3. Confirmar contraseña
  4. Hacer clic en "Crear Cuenta"
- **Resultado Esperado:** Usuario creado, token JWT generado, redirección al dashboard
- **Estado:** APROBADO

---

### CP-002: Login con Credenciales Válidas
- **Módulo:** Autenticación
- **Prioridad:** Alta
- **Descripción:** Iniciar sesión con usuario existente
- **Resultado Esperado:** Token JWT generado, usuario autenticado, acceso al dashboard
- **Estado:** APROBADO

---

### CP-003: Login con Credenciales Inválidas
- **Módulo:** Autenticación
- **Prioridad:** Alta
- **Descripción:** Validar rechazo de credenciales incorrectas
- **Resultado Esperado:** Mensaje de error "Credenciales inválidas"
- **Estado:** APROBADO

---

### CP-004: Validación de Contraseña Corta
- **Módulo:** Autenticación
- **Prioridad:** Alta
- **Descripción:** Validar que se rechacen contraseñas menores a 8 caracteres
- **Resultado Esperado:** Mensaje "La contraseña debe tener al menos 8 caracteres"
- **Estado:** APROBADO

---

### CP-005: Crear Nueva Materia
- **Módulo:** Materias
- **Prioridad:** Alta
- **Descripción:** Crear materia con todos los datos requeridos
- **Resultado Esperado:** Materia creada, visible en lista y guardada en BD
- **Estado:** APROBADO

---

### CP-006: Editar Materia Existente
- **Módulo:** Materias
- **Prioridad:** Media
- **Descripción:** Modificar datos de una materia (agregar nota)
- **Resultado Esperado:** Materia actualizada correctamente
- **Estado:** APROBADO

---

### CP-007: Eliminar Materia
- **Módulo:** Materias
- **Prioridad:** Media
- **Descripción:** Eliminar materia del sistema
- **Resultado Esperado:** Materia eliminada de lista y base de datos
- **Estado:** APROBADO

---

### CP-008: Crear Tarea con Fecha Límite
- **Módulo:** Tareas
- **Prioridad:** Alta
- **Descripción:** Crear tarea asociada a una materia
- **Resultado Esperado:** Tarea creada con estado "Pendiente"
- **Estado:** APROBADO

---

### CP-009: Cambiar Estado de Tarea
- **Módulo:** Tareas
- **Prioridad:** Alta
- **Descripción:** Actualizar estado de tarea de "Pendiente" a "Completada"
- **Resultado Esperado:** Estado actualizado inmediatamente
- **Estado:** APROBADO

---

### CP-010: Filtrar Tareas por Estado
- **Módulo:** Tareas
- **Prioridad:** Media
- **Descripción:** Aplicar filtro para ver solo tareas completadas
- **Resultado Esperado:** Solo tareas completadas visibles
- **Estado:** APROBADO

---

### CP-011: Crear Examen con Preparación
- **Módulo:** Exámenes
- **Prioridad:** Alta
- **Descripción:** Registrar examen con indicador de preparación
- **Resultado Esperado:** Examen creado con barra de preparación visual
- **Estado:** APROBADO

---

### CP-012: Buscar Apuntes por Texto
- **Módulo:** Apuntes
- **Prioridad:** Media
- **Descripción:** Filtrar apuntes usando búsqueda en tiempo real
- **Resultado Esperado:** Resultados filtrados instantáneamente
- **Estado:** APROBADO

---

### CP-013: Visualizar Dashboard
- **Módulo:** Dashboard
- **Prioridad:** Alta
- **Descripción:** Cargar estadísticas y gráficos en dashboard
- **Resultado Esperado:** 
  - Promedio general calculado
  - Gráfico de barras con notas
  - Gráfico pie con distribución de tareas
  - Lista de próximos exámenes
- **Estado:** APROBADO

---

### CP-014: Generar Reporte General
- **Módulo:** Reportes
- **Prioridad:** Media
- **Descripción:** Exportar reporte académico en formato .txt
- **Resultado Esperado:** Archivo .txt descargado con datos correctos
- **Estado:** APROBADO

---

### CP-015: Cambiar Contraseña
- **Módulo:** Configuración
- **Prioridad:** Alta
- **Descripción:** Actualizar contraseña de la cuenta
- **Resultado Esperado:** Contraseña actualizada, mensaje de confirmación
- **Estado:** APROBADO

---

### CP-016: Eliminar Cuenta
- **Módulo:** Configuración
- **Prioridad:** Alta
- **Descripción:** Eliminar cuenta permanentemente con confirmación
- **Resultado Esperado:** Cuenta eliminada, usuario deslogueado, datos borrados
- **Estado:** APROBADO

---

### CP-017: Calendario Mensual
- **Módulo:** Calendario
- **Prioridad:** Media
- **Descripción:** Visualizar eventos en vista de calendario
- **Resultado Esperado:** Tareas y exámenes visibles por día
- **Estado:** APROBADO

---

### CP-018: Análisis de Progreso
- **Módulo:** Progreso
- **Prioridad:** Alta
- **Descripción:** Visualizar estadísticas de rendimiento académico
- **Resultado Esperado:** 
  - Promedio general
  - Alertas de materias en riesgo
  - Gráficos de evolución
- **Estado:** APROBADO

---

## 5. CRITERIOS DE ACEPTACIÓN

- Todas las pruebas de prioridad ALTA deben pasar (13/13)
- Mínimo 90% de pruebas totales aprobadas (18/18 = 100%)
- Cero errores críticos sin resolver
- Todas las incidencias documentadas y resueltas

---

## 6. RESUMEN EJECUTIVO

**Total de Casos de Prueba:** 18  
**Casos Aprobados:** 18  
**Casos Fallidos:** 0  
**Tasa de Éxito:** 100%

**Conclusión:** El sistema ha superado todas las pruebas planificadas y está listo para producción.