-- Tabla de Usuarios
CREATE TABLE Usuario (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    createAt DATETIME DEFAULT GETDATE(),
    updateAt DATETIME DEFAULT GETDATE()
);

-- Índices
CREATE INDEX idx_usuario_email ON Usuario(email);