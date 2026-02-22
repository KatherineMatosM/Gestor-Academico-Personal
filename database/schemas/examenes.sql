-- Tabla de Exámenes
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

-- Índices
CREATE INDEX idx_examen_usuario ON Examen(usuarioId);
CREATE INDEX idx_examen_materia ON Examen(materiaId);
CREATE INDEX idx_examen_fecha ON Examen(fecha);