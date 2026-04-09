# Gestor Académico

Sistema web full-stack para la gestión integral de actividades académicas, permitiendo a estudiantes organizar materias, tareas, exámenes y apuntes con análisis de rendimiento en tiempo real.

---

## Descripción del Sistema

Gestor Académico es una aplicación web desarrollada para ayudar a estudiantes universitarios a organizar sus actividades académicas de manera integral.

### Funcionalidades Principales

- **Gestión de Materias**: Registro completo con créditos, códigos, dificultad y calificaciones
- **Organización de Tareas**: Sistema con estados (Pendiente, En Progreso, Completada), prioridades y fechas límite
- **Programación de Exámenes**: Calendario con seguimiento de preparación y registro de resultados
- **Almacenamiento de Apuntes**: Repositorio organizado por materia con búsqueda en tiempo real
- **Análisis de Progreso**: Dashboard con gráficos interactivos y estadísticas de rendimiento
- **Calendario Académico**: Vista mensual de todas las actividades (tareas y exámenes)
- **Generación de Reportes**: Exportación de información académica en formato .txt
- **Configuración de Cuenta**: Actualización de perfil, cambio de contraseña y eliminación de cuenta

---

## Tecnologías Utilizadas

### Frontend
- React 18.2.0
- Recharts 2.10.0 (gráficos interactivos)
- Axios 1.6.0 (cliente HTTP)
- Lucide React (sistema de iconos)
- Context API (manejo de estado global)

### Backend
- Node.js 18.x
- Express 4.18.2 (framework web)
- JWT (autenticación y sesiones)
- bcryptjs (encriptación de contraseñas)
- Jest 30.3.0 (framework de testing)

### Base de Datos
- Microsoft SQL Server 2019
- 5 tablas relacionales (Usuario, Materia, Tareas, Examen, Apunte)
- Integridad referencial con foreign keys
- Índices optimizados para consultas

---

## Instalación y Ejecución

### Prerrequisitos

Asegúrate de tener instalado:

- Node.js 18 o superior
- Microsoft SQL Server 2019 o superior
- npm 9 o superior
- Git
- SQL Server Management Studio (SSMS)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/KatherineMatosM/Gestor-Academico-Personal.git
cd Gestor-Academico-Personal
```

### Paso 2: Configurar la Base de Datos

Abre SQL Server Management Studio y ejecuta:

```sql
CREATE DATABASE GestorAcademico;
GO
```

Luego ejecuta el script de migración ubicado en:

```
database/migrations/001-create-tables.sql
```

Para verificar que las tablas se crearon correctamente:

```sql
USE GestorAcademico;
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
```

Deberías ver 5 tablas: Usuario, Materia, Tareas, Examen, Apunte

### Paso 3: Configurar el Backend

```bash
cd server
npm install
```

Crea el archivo `server/.env`:

```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

DB_SERVER=TuServidor
DB_DATABASE=GestorAcademico
DB_DRIVER=ODBC Driver 17 for SQL Server

JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
JWT_EXPIRATION=7d
```

**IMPORTANTE:** 
- Reemplaza `TuServidor` con el nombre de tu instancia SQL Server
- Para obtener el nombre del servidor, ejecuta en SSMS: `SELECT @@SERVERNAME`
- Cambia `JWT_SECRET` por una cadena aleatoria segura

### Paso 4: Configurar el Frontend

```bash
cd client
npm install
```

Crea el archivo `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Paso 5: Ejecutar el Proyecto

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

Deberías ver:

```
[INFO] Pool de conexión creado exitosamente
[INFO] Conexión a la base de datos establecida
[INFO] Servidor ejecutándose en puerto 5000
[INFO] Entorno: development
```

**Terminal 2 - Frontend:**

```bash
cd client
npm start
```

El navegador abrirá automáticamente `http://localhost:3000`

---

## Estructura del Proyecto

### Backend (server/)

```
server/
├── src/
│   ├── config/          # Configuraciones (BD, servidor, auth)
│   ├── controllers/     # Controladores HTTP
│   ├── services/        # Lógica de negocio
│   ├── repositories/    # Acceso a datos
│   ├── models/          # Modelos de dominio
│   ├── routes/          # Definición de rutas API
│   ├── middlewares/     # Middlewares (auth, validación)
│   └── utils/           # Utilidades (validators, helpers)
├── tests/               # Pruebas unitarias
├── server.js            # Punto de entrada
└── package.json
```

### Frontend (client/)

```
client/
├── public/
├── src/
│   ├── components/      # Componentes React por módulo
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── materias/
│   │   ├── tareas/
│   │   ├── examenes/
│   │   ├── apuntes/
│   │   ├── calendario/
│   │   ├── progreso/
│   │   ├── reportes/
│   │   ├── configuracion/
│   │   └── common/      # Componentes reutilizables
│   ├── services/        # Servicios API
│   ├── context/         # Context API
│   ├── utils/           # Utilidades
│   └── App.jsx
└── package.json
```

---

## Arquitectura del Sistema

### Arquitectura de 3 Capas

```
Frontend (React) - Backend (Node.js/Express) - Base de Datos (SQL Server)
```

### Patrón MVC en el Backend

```
Request --> Routes --> Controllers --> Services --> Repositories --> Database
                                                                          |
Response <-- Controllers <-- Services <-- Repositories <-----------------+
```

### Modelo de Datos

**Tablas principales:**

1. **Usuario**: Datos de autenticación y perfil
2. **Materia**: Información de materias (nombre, código, créditos, nota)
3. **Tareas**: Tareas asociadas a materias (título, tipo, prioridad, estado)
4. **Examen**: Exámenes programados (fecha, hora, preparación, nota)
5. **Apunte**: Notas y apuntes por materia

**Relaciones:**
- Usuario tiene muchas Materias (1:N)
- Usuario tiene muchas Tareas (1:N)
- Usuario tiene muchos Exámenes (1:N)
- Usuario tiene muchos Apuntes (1:N)
- Materia puede tener muchas Tareas (1:N)
- Materia puede tener muchos Exámenes (1:N)
- Materia puede tener muchos Apuntes (1:N)

---

## Pruebas

### Ejecutar Pruebas Unitarias

```bash
cd server
npm test
```

**Resultados esperados:**
- 18 tests ejecutados
- 18 tests aprobados
- 0 tests fallidos
- Cobertura del 93.75% en módulos críticos

### Ver Reporte de Cobertura

```bash
npm test -- --coverage
```

El reporte HTML se genera en: `server/coverage/lcov-report/index.html`

---

## Uso del Sistema

### Registro e Inicio de Sesión

1. Abre el navegador en `http://localhost:3000`
2. Haz clic en "Registrarse"
3. Completa el formulario con:
   - Nombre completo
   - Email válido
   - Contraseña (mínimo 8 caracteres)
4. El sistema te redirige automáticamente al dashboard

### Gestión de Materias

1. Click en "Materias" en el menú lateral
2. Click en "+ Nueva Materia"
3. Completa la información:
   - Nombre de la materia
   - Código
   - Créditos
   - Dificultad (Baja, Media, Alta)
   - Estado (Activa, Completada, Suspendida)
   - Nota (opcional)
4. Guarda y la materia aparece en la lista

### Gestión de Tareas

1. Click en "Tareas"
2. Click en "+ Nueva Tarea"
3. Completa:
   - Título
   - Materia asociada
   - Tipo (Lectura, Práctica, Proyecto, Estudio)
   - Fecha límite
   - Prioridad (Alta, Media, Baja)
4. Cambia el estado conforme avances: Pendiente → En Progreso → Completada

### Análisis de Progreso

1. Click en "Dashboard" para ver:
   - Promedio general
   - Materias activas
   - Tareas pendientes
   - Próximos exámenes
   - Gráficos de rendimiento

2. Click en "Progreso" para ver:
   - Análisis detallado por materia
   - Alertas de materias en riesgo
   - Evolución de notas
   - Desglose completo

### Generación de Reportes

1. Click en "Reportes"
2. Selecciona el tipo de reporte:
   - Reporte General
   - Reporte de Materias
   - Reporte de Tareas
   - Reporte de Exámenes
3. Click en "Descargar .txt"
4. El archivo se descarga automáticamente

---

## Solución de Problemas Comunes

### ERROR: "Cannot connect to SQL Server"

**Solución:**
1. Verifica que SQL Server esté ejecutándose
2. Confirma el nombre del servidor en SSMS: `SELECT @@SERVERNAME`
3. Actualiza `DB_SERVER` en `server/.env`
4. Verifica que TCP/IP esté habilitado en SQL Server Configuration Manager

### ERROR: "Port 5000 already in use"

**Solución:**
1. Cambia el puerto en `server/.env` a 5001
2. Actualiza `REACT_APP_API_URL` en `client/.env` a `http://localhost:5001/api`

### ERROR: "Module not found"

**Solución:**
```bash
# Eliminar node_modules
rm -rf node_modules
# Reinstalar
npm install
```

### ERROR: Pantalla blanca en el navegador

**Solución:**
1. Abre DevTools (F12)
2. Ve a la pestaña Console
3. Revisa los errores mostrados
4. Verifica que el backend esté ejecutándose

### ERROR: "Credenciales inválidas" con contraseña correcta

**Solución:**
- Si creaste el usuario antes de cambiar la longitud de contraseña de 4 a 8 caracteres, crea un nuevo usuario con contraseña de 8+ caracteres

---

## Características de Seguridad

### Autenticación
- Tokens JWT con expiración de 7 días
- Contraseñas hasheadas con bcrypt (10 rounds)
- Validación de credenciales en múltiples capas

### Validaciones
- **Frontend**: Email, contraseña (8+ caracteres), campos requeridos
- **Backend**: JWT, autorización, sanitización de inputs
- **Base de Datos**: Constraints, foreign keys, tipos de datos

### Protección
- CORS configurado para permitir solo el frontend
- Middleware de autenticación en todas las rutas protegidas
- SQL injection prevenido mediante queries parametrizadas

---

## API Endpoints

### Autenticación
```
POST   /api/auth/register          # Registrar usuario
POST   /api/auth/login             # Iniciar sesión
GET    /api/auth/me                # Obtener usuario actual
PUT    /api/auth/profile           # Actualizar perfil
PUT    /api/auth/change-password   # Cambiar contraseña
DELETE /api/auth/account           # Eliminar cuenta
```

### Materias
```
GET    /api/materias               # Listar materias
GET    /api/materias/:id           # Obtener materia
POST   /api/materias               # Crear materia
PUT    /api/materias/:id           # Actualizar materia
DELETE /api/materias/:id           # Eliminar materia
```

### Tareas
```
GET    /api/tareas                 # Listar tareas
POST   /api/tareas                 # Crear tarea
PUT    /api/tareas/:id             # Actualizar tarea
DELETE /api/tareas/:id             # Eliminar tarea
```

### Exámenes
```
GET    /api/examenes               # Listar exámenes
POST   /api/examenes               # Crear examen
PUT    /api/examenes/:id           # Actualizar examen
DELETE /api/examenes/:id           # Eliminar examen
```

### Apuntes
```
GET    /api/apuntes                # Listar apuntes
POST   /api/apuntes                # Crear apunte
PUT    /api/apuntes/:id            # Actualizar apunte
DELETE /api/apuntes/:id            # Eliminar apunte
```

---

## Contribución

### Autor

Katherine Matos Medina

### Institución

Instituto Tecnológico de las Américas (ITLA)

### Asignatura

Programación 3

### Profesora

Eduandy Isabel Cruz Abreu

### Fecha

Abril 2026

---

## Licencia

Este proyecto fue desarrollado con fines educativos como proyecto final de la asignatura Programación 3.

---

## Contacto

Para preguntas o sugerencias sobre el proyecto, contactar a través del repositorio de GitHub.