-- Create database
CREATE DATABASE IF NOT EXISTS attendance_control;
USE attendance_control;

-- ===========================================
-- TABLA: users
-- ===========================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Guardar siempre encriptada (bcrypt recomendado)
    role ENUM('admin','employee') DEFAULT 'employee',
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- TABLA: attendances
-- ===========================================
CREATE TABLE attendances (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    check_in TIME DEFAULT NULL,
    check_out TIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (user_id, date) -- Un registro por día por usuario
);

-- ===========================================
-- TABLA: action_logs
-- (para auditoría de acciones del administrador)
-- ===========================================
CREATE TABLE action_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action ENUM('create','update','delete') NOT NULL,
    affected_user_id INT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (affected_user_id) REFERENCES users(user_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- ===========================================
-- TABLA: work_calendar
-- (para distinguir días hábiles y feriados)
-- ===========================================
CREATE TABLE work_calendar (
    calendar_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    is_working_day BOOLEAN DEFAULT TRUE, -- TRUE = día laboral, FALSE = feriado/fin de semana
    description VARCHAR(255) DEFAULT NULL
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
