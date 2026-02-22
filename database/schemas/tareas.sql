-- Tabla de Tareas
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

-- Índices
CREATE INDEX idx_tarea_usuario ON Tareas(usuarioId);
CREATE INDEX idx_tarea_materia ON Tareas(materiaId);
CREATE INDEX idx_tarea_estado ON Tareas(estado);
CREATE INDEX idx_tarea_fecha ON Tareas(fechaLimite);