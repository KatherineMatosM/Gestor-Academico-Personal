-- Tabla de Materias
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

-- Índices
CREATE INDEX idx_materia_usuario ON Materia(usuarioId);
CREATE INDEX idx_materia_estado ON Materia(estado);