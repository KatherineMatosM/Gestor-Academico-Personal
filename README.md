# Gestor Académico

Sistema web full-stack para la gestión integral de actividades académicas, permitiendo a estudiantes organizar materias, tareas, exámenes y apuntes con análisis de rendimiento en tiempo real.

---

## Descripción del Sistema

Gestor Académico es una aplicación web que permite a estudiantes universitarios:

- **Gestionar materias**: Registro completo de materias con créditos, códigos y calificaciones
- **Organizar tareas**: Sistema de tareas con estados, prioridades y fechas límite
- **Programar exámenes**: Calendario de exámenes con seguimiento de preparación
- **Almacenar apuntes**: Repositorio de notas organizadas por materia con búsqueda
- **Analizar progreso**: Dashboard con gráficos y estadísticas de rendimiento
- **Visualizar calendario**: Vista mensual de todas las actividades académicas
- **Generar reportes**: Exportación de reportes académicos en formato texto

---

## Instalación y Ejecución

### Prerrequisitos

- Node.js 18 o superior
- SQL Server 2019 o superior
- npm 9 o superior
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/KatherineMatosM/Gestor-Academico-Personal.git
cd Gestor-Academico-Personal
```

### 2. Configurar la Base de Datos

Abre SQL Server Management Studio y ejecuta:
```sql
CREATE DATABASE GestorAcademico;
GO
```

Luego ejecuta el script de migración ubicado en:
```
database/migrations/001-create-tables.sql
```

### 3. Configurar el Backend
```bash
cd server
npm install
```

Crea el archivo `server/.env`:
```env
NODE_ENV=development
PORT=5001
CORS_ORIGIN=http://localhost:3000

DB_SERVER=TuServidor
DB_DATABASE=GestorAcademico
DB_DRIVER=ODBC Driver 17 for SQL Server

JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRATION=7d
```

> **Nota:** Reemplaza `TuServidor` con el nombre de tu instancia SQL Server.

### 4. Configurar el Frontend
```bash
cd ../client
npm install
```

Crea el archivo `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### 5. Ejecutar el Proyecto

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

Deberías ver:
```
[INFO] Pool de conexión creado exitosamente
[INFO] Conexión a la base de datos establecida
[INFO] Servidor ejecutándose en puerto 5001
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```

El navegador abrirá automáticamente `http://localhost:3000`

---

## Solución de Problemas

**Error: Cannot connect to SQL Server**
- Verifica que SQL Server esté ejecutándose
- Confirma el nombre del servidor en `.env`
- Habilita TCP/IP en SQL Server Configuration Manager
- Verifica que el driver ODBC esté instalado

**Error: Port already in use**
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID [PID] /F
```

**Error: Module not found**
```bash
cd server && npm install
cd client && npm install
```