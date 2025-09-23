-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para asistencia
CREATE DATABASE IF NOT EXISTS `asistencia` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `asistencia`;

-- Volcando estructura para tabla asistencia.asistencia
CREATE TABLE IF NOT EXISTS `asistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `fecha` date NOT NULL,
  `hora_entrada` time NOT NULL,
  `hora_salida` time DEFAULT NULL,
  `id_estado` int NOT NULL,
  `id_categoria` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_estado` (`id_estado`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_3` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_asistencia` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.asistencia: ~23 rows (aproximadamente)
INSERT INTO `asistencia` (`id`, `id_usuario`, `fecha`, `hora_entrada`, `hora_salida`, `id_estado`, `id_categoria`) VALUES
	(3, 1, '2025-09-20', '08:00:00', '17:00:00', 1, 1),
	(4, 2, '2025-09-20', '08:15:00', '17:10:00', 3, 4),
	(5, 3, '2025-09-20', '08:05:00', '16:55:00', 2, 5),
	(6, 4, '2025-09-20', '08:10:00', '17:05:00', 4, 5),
	(9, 3, '2025-09-21', '08:05:00', '16:55:00', 1, 4),
	(10, 4, '2025-09-21', '08:10:00', '17:05:00', 2, 5),
	(11, 1, '2025-09-19', '08:00:00', '17:00:00', 1, 1),
	(12, 2, '2025-09-19', '08:10:00', '17:05:00', 3, 4),
	(13, 3, '2025-09-19', '08:05:00', '17:15:00', 2, 5),
	(14, 4, '2025-09-19', '08:20:00', '16:55:00', 4, 5),
	(15, 1, '2025-09-18', '08:00:00', '17:00:00', 1, 2),
	(16, 2, '2025-09-18', '08:25:00', '17:10:00', 5, 1),
	(17, 3, '2025-09-18', '08:10:00', '17:00:00', 1, 4),
	(18, 4, '2025-09-18', '08:15:00', '17:05:00', 2, 5),
	(19, 1, '2025-09-17', '08:05:00', '17:05:00', 1, 1),
	(20, 2, '2025-09-17', '08:15:00', '17:15:00', 3, 5),
	(21, 3, '2025-09-17', '08:20:00', '17:10:00', 4, 2),
	(22, 4, '2025-09-17', '08:00:00', '17:00:00', 1, 1),
	(23, 1, '2025-09-16', '08:10:00', '17:10:00', 5, 4),
	(24, 2, '2025-09-16', '08:05:00', '17:05:00', 1, 2),
	(25, 3, '2025-09-16', '08:15:00', '17:15:00', 2, 5),
	(26, 4, '2025-09-16', '08:20:00', '17:20:00', 3, 5),
	(28, 1, '2025-09-21', '02:43:15', '02:43:24', 1, 3),
	(29, 1, '2025-09-22', '23:55:09', '23:57:49', 1, 4),
	(30, 1, '2025-09-23', '00:00:33', '00:00:35', 1, 3);

-- Volcando estructura para tabla asistencia.categoria_asistencia
CREATE TABLE IF NOT EXISTS `categoria_asistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.categoria_asistencia: ~5 rows (aproximadamente)
INSERT INTO `categoria_asistencia` (`id`, `nombre`, `descripcion`) VALUES
	(1, 'Entrada Normal', 'Marcaje de entrada en horario establecido'),
	(2, 'Salida Normal', 'Marcaje de salida en horario establecido'),
	(3, 'Salida Anticipada', 'Salida con anterioridad al horario laboral definido'),
	(4, 'Atraso', 'Entrada posterior al horario laboral definido'),
	(5, 'Inasistencia', 'Día completo sin presentarse');

-- Volcando estructura para tabla asistencia.estadoasistencia
CREATE TABLE IF NOT EXISTS `estadoasistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `estado` (`estado`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.estadoasistencia: ~5 rows (aproximadamente)
INSERT INTO `estadoasistencia` (`id`, `estado`, `descripcion`) VALUES
	(1, 'Presente', 'El trabajador se encuentra en su puesto de trabajo'),
	(2, 'Ausente', 'El trabajador no se presentó y no tiene justificación'),
	(3, 'Justificado', 'El trabajador no asistió, pero presentó una justificación válida'),
	(4, 'Licencia Médica', 'El trabajador no asistió por licencia médica'),
	(5, 'Permiso Administrativo', 'Ausencia autorizada por motivos administrativos');

-- Volcando estructura para tabla asistencia.horastrabajadas
CREATE TABLE IF NOT EXISTS `horastrabajadas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entrada` varchar(255) DEFAULT NULL,
  `salida` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.horastrabajadas: ~0 rows (aproximadamente)
INSERT INTO `horastrabajadas` (`id`, `entrada`, `salida`) VALUES
	(1, '09:30:00', '17:30:00');

-- Volcando estructura para tabla asistencia.justificacion_comun
CREATE TABLE IF NOT EXISTS `justificacion_comun` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `fecha_solicitud` datetime NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `archivo` varchar(255) DEFAULT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `justificacion_comun_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.justificacion_comun: ~0 rows (aproximadamente)

-- Volcando estructura para tabla asistencia.licencia_medica
CREATE TABLE IF NOT EXISTS `licencia_medica` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `folio` varchar(255) NOT NULL,
  `fecha_emision` date NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `dias_reposo` int NOT NULL,
  `profesional` varchar(255) DEFAULT NULL,
  `nombre_trabajador` varchar(255) DEFAULT NULL,
  `rut_trabajador` varchar(255) DEFAULT NULL,
  `edad_trabajador` int DEFAULT NULL,
  `sexo_trabajador` varchar(255) DEFAULT NULL,
  `direccion_reposo` varchar(255) DEFAULT NULL,
  `telefono_contacto` varchar(255) DEFAULT NULL,
  `archivo` varchar(255) DEFAULT NULL,
  `tipo_licencia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `licencia_medica_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.licencia_medica: ~0 rows (aproximadamente)
INSERT INTO `licencia_medica` (`id`, `id_usuario`, `folio`, `fecha_emision`, `fecha_inicio`, `fecha_fin`, `dias_reposo`, `profesional`, `nombre_trabajador`, `rut_trabajador`, `edad_trabajador`, `sexo_trabajador`, `direccion_reposo`, `telefono_contacto`, `archivo`, `tipo_licencia`) VALUES
	(2, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758511557298-MedicaLIcencia.pdf', 'MIXTA'),
	(3, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758511573088-MedicaLIcencia.pdf', 'MIXTA'),
	(4, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758514428385-MedicaLIcencia.pdf', 'MIXTA'),
	(5, 10, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758515004325-MedicaLIcencia.pdf', 'MIXTA'),
	(6, 4, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758515054675-MedicaLIcencia.pdf', 'MIXTA'),
	(7, 2, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758515085097-MedicaLIcencia.pdf', 'MIXTA');

-- Volcando estructura para tabla asistencia.rols
CREATE TABLE IF NOT EXISTS `rols` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.rols: ~4 rows (aproximadamente)
INSERT INTO `rols` (`id`, `nombre`, `descripcion`) VALUES
	(1, 'Administrador', 'Acceso total al sistema'),
	(2, 'Marketing', 'El que vela por la publicidad de la empresa'),
	(3, 'rr.hh', 'Maneja a los humanos'),
	(4, 'Finanzas', 'El que maneja y direge la economia de la empresa');

-- Volcando estructura para tabla asistencia.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rut` varchar(255) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` int DEFAULT '2',
  PRIMARY KEY (`id`),
  UNIQUE KEY `rut` (`rut`),
  UNIQUE KEY `correo` (`correo`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rols` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.users: ~6 rows (aproximadamente)
INSERT INTO `users` (`id`, `rut`, `nombre`, `apellido`, `correo`, `password`, `id_rol`) VALUES
	(1, '11.111.111-1', 'Juan', 'Pérez', 'juan.perez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 1),
	(2, '22.222.222-2', 'María', 'López', 'maria.lopez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 2),
	(3, '33.333.333-3', 'Carlos', 'Gonzales', 'carlos.soto@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 4),
	(4, '44.444.444-4', 'Ana', 'González', 'ana.gonzalez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 3),
	(5, '99.999.999-9', 'Arturo', 'Vidal', 'avidal@mail.com', '$2b$10$4bLY5OHlxDrarRcHVV52l.GkUFV/SNTiavqerL5qTfCM/D8yP6N32', 4),
	(10, '55.555.555-K', 'Mario', 'Gonzalez', 'm.gonzalez@example.com', '$2b$10$9FhqHafSkfXWlSv5VvmXeuT6HNznJiv.C5zOQBp6UKwe98DE2y5t2', 2);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
