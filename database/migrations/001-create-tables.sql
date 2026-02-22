-- Script de migración para crear todas las tablas del sistema
-- Gestor Académico - Base de Datos

USE GestorAcademico;
GO

-- Tabla de Usuarios
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuario')
BEGIN
    CREATE TABLE Usuario (
        id INT PRIMARY KEY IDENTITY(1,1),
        nombre NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        createAt DATETIME DEFAULT GETDATE(),
        updateAt DATETIME DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_usuario_email ON Usuario(email);
    PRINT 'Tabla Usuario creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla Usuario ya existe';
END
GO

-- Tabla de Materias
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Materia')
BEGIN
    CREATE TABLE Materia (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuarioId INT NOT NULL,
        nombre NVARCHAR(200) NOT NULL,
        codigo NVARCHAR(50) NOT NULL,
        creditos INT NOT NULL CHECK (creditos BETWEEN 1 AND 8),
        dificultad NVARCHAR(20) CHECK (dificultad IN ('Alta', 'Media', 'Baja')),
        estado NVARCHAR(20) CHECK (estado IN ('Activa', 'Completada', 'Suspendida')),
        nota DECIMAL(5,2) CHECK (nota BETWEEN 0 AND 100),
        createAt DATETIME DEFAULT GETDATE(),
        updateAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE
    );
    
    CREATE INDEX idx_materia_usuario ON Materia(usuarioId);
    CREATE INDEX idx_materia_estado ON Materia(estado);
    PRINT 'Tabla Materia creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla Materia ya existe';
END
GO

-- Tabla de Tareas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tareas')
BEGIN
    CREATE TABLE Tareas (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuarioId INT NOT NULL,
        materiaId INT NOT NULL,
        titulo NVARCHAR(200) NOT NULL,
        tipo NVARCHAR(50) CHECK (tipo IN ('Lectura', 'Práctica', 'Proyecto', 'Estudio')),
        fechaLimite DATE NOT NULL,
        prioridad NVARCHAR(20) CHECK (prioridad IN ('Alta', 'Media', 'Baja')),
        estado NVARCHAR(20) CHECK (estado IN ('Pendiente', 'En Progreso', 'Completada')),
        createAt DATETIME DEFAULT GETDATE(),
        updateAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE,
        FOREIGN KEY (materiaId) REFERENCES Materia(id) ON DELETE NO ACTION
    );
    
    CREATE INDEX idx_tarea_usuario ON Tareas(usuarioId);
    CREATE INDEX idx_tarea_materia ON Tareas(materiaId);
    CREATE INDEX idx_tarea_estado ON Tareas(estado);
    CREATE INDEX idx_tarea_fecha ON Tareas(fechaLimite);
    PRINT 'Tabla Tareas creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla Tareas ya existe';
END
GO

-- Tabla de Exámenes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Examen')
BEGIN
    CREATE TABLE Examen (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuarioId INT NOT NULL,
        materiaId INT NOT NULL,
        titulo NVARCHAR(200) NOT NULL,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        temas NVARCHAR(MAX),
        preparacion INT DEFAULT 0 CHECK (preparacion BETWEEN 0 AND 100),
        nota DECIMAL(5,2) CHECK (nota BETWEEN 0 AND 100),
        autoevaluacion NVARCHAR(50),
        createAt DATETIME DEFAULT GETDATE(),
        updateAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE,
        FOREIGN KEY (materiaId) REFERENCES Materia(id) ON DELETE NO ACTION
    );
    
    CREATE INDEX idx_examen_usuario ON Examen(usuarioId);
    CREATE INDEX idx_examen_materia ON Examen(materiaId);
    CREATE INDEX idx_examen_fecha ON Examen(fecha);
    PRINT 'Tabla Examen creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla Examen ya existe';
END
GO

-- Tabla de Apuntes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Apunte')
BEGIN
    CREATE TABLE Apunte (
        id INT PRIMARY KEY IDENTITY(1,1),
        materiaId INT NOT NULL,
        usuarioId INT NOT NULL,
        titulo NVARCHAR(200) NOT NULL,
        contenido NVARCHAR(MAX) NOT NULL,
        createAt DATETIME DEFAULT GETDATE(),
        updateAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (materiaId) REFERENCES Materia(id) ON DELETE NO ACTION,
        FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE
    );
    
    CREATE INDEX idx_apunte_materia ON Apunte(materiaId);
    CREATE INDEX idx_apunte_usuario ON Apunte(usuarioId);
    CREATE INDEX idx_apunte_fecha ON Apunte(createAt);
    PRINT 'Tabla Apunte creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla Apunte ya existe';
END
GO

PRINT 'Migración completada exitosamente';
GO