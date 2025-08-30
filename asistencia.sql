-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS control_asistencia;
USE control_asistencia;

-- ===========================================
-- TABLA: usuarios
-- ===========================================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL, -- Guardar siempre encriptada (bcrypt recomendado)
    rol ENUM('admin','empleado') DEFAULT 'empleado',
    estado ENUM('activo','inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- TABLA: asistencias
-- ===========================================
CREATE TABLE asistencias (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada TIME DEFAULT NULL,
    hora_salida TIME DEFAULT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (id_usuario, fecha) -- Un registro por día por usuario
);

-- ===========================================
-- TABLA: logs_acciones
-- (para auditoría de acciones del administrador)
-- ===========================================
CREATE TABLE logs_acciones (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_admin INT NOT NULL,
    accion ENUM('crear','modificar','eliminar') NOT NULL,
    id_usuario_afectado INT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_admin) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_usuario_afectado) REFERENCES usuarios(id_usuario)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- ===========================================
-- TABLA: calendario_laboral
-- (para distinguir días hábiles y feriados)
-- ===========================================
CREATE TABLE calendario_laboral (
    id_fecha INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE UNIQUE NOT NULL,
    es_laboral BOOLEAN DEFAULT TRUE, -- TRUE = día laboral, FALSE = feriado/fin de semana
    descripcion VARCHAR(255) DEFAULT NULL
);

-- ===========================================
-- DATOS DE PRUEBA
-- ===========================================

-- Insertar un administrador
INSERT INTO usuarios (nombre, apellido, correo, contraseña, rol)
VALUES ('Admin', 'Principal', 'admin@empresa.com', '1234encriptada', 'admin');

-- Insertar algunos empleados
INSERT INTO usuarios (nombre, apellido, correo, contraseña, rol)
VALUES 
('Juan', 'Pérez', 'juan@empresa.com', '1234encriptada', 'empleado'),
('María', 'López', 'maria@empresa.com', '1234encriptada', 'empleado');

-- Insertar días laborales de ejemplo
INSERT INTO calendario_laboral (fecha, es_laboral, descripcion)
VALUES 
('2024-01-02', TRUE, 'Día laboral'),
('2024-01-03', TRUE, 'Día laboral'),
('2024-01-04', TRUE, 'Día laboral');

-- Registrar asistencia de ejemplo
INSERT INTO asistencias (id_usuario, fecha, hora_entrada, hora_salida)
VALUES 
(2, '2024-01-02', '09:10:00', '17:40:00'), -- Juan
(3, '2024-01-02', '09:45:00', '17:20:00'); -- María
