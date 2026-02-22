-- Tabla de Apuntes
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

-- Índices
CREATE INDEX idx_apunte_materia ON Apunte(materiaId);
CREATE INDEX idx_apunte_usuario ON Apunte(usuarioId);
CREATE INDEX idx_apunte_fecha ON Apunte(createAt);