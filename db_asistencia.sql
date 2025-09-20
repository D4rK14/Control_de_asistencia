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
  `id_usuario` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora_entrada` time DEFAULT NULL,
  `hora_salida` time DEFAULT NULL,
  `id_estado` int DEFAULT NULL,
  `id_categoria` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_estado` (`id_estado`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_3` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_asistencia` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.asistencia: ~8 rows (aproximadamente)
INSERT INTO `asistencia` (`id`, `id_usuario`, `fecha`, `hora_entrada`, `hora_salida`, `id_estado`, `id_categoria`) VALUES
	(1, 1, '2025-09-13', '08:55:00', '17:15:00', 1, 1),
	(2, 1, '2025-09-12', '09:20:00', '17:10:00', 1, 3),
	(3, 1, '2025-09-11', NULL, NULL, 4, 5),
	(4, 2, '2025-09-13', '08:50:00', '18:05:00', 1, 4),
	(5, 2, '2025-09-12', NULL, NULL, 3, 5),
	(6, 1, '2025-09-20', '01:01:06', '01:04:25', 1, NULL),
	(7, 2, '2025-09-20', '01:35:33', '01:35:37', 1, NULL),
	(8, 3, '2025-09-20', '01:50:08', '01:50:10', 1, NULL);

-- Volcando estructura para tabla asistencia.categoria_asistencia
CREATE TABLE IF NOT EXISTS `categoria_asistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.categoria_asistencia: ~5 rows (aproximadamente)
INSERT INTO `categoria_asistencia` (`id`, `nombre`, `descripcion`) VALUES
	(1, 'Entrada Normal', 'Marcaje de entrada en horario establecido'),
	(2, 'Salida Normal', 'Marcaje de salida en horario establecido'),
	(3, 'Atraso', 'Entrada posterior al horario laboral definido'),
	(4, 'Horas Extras', 'Salida después del horario regular'),
	(5, 'Inasistencia', 'Día completo sin presentarse');

-- Volcando estructura para tabla asistencia.estadoasistencia
CREATE TABLE IF NOT EXISTS `estadoasistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.horastrabajadas: ~0 rows (aproximadamente)

-- Volcando estructura para tabla asistencia.rols
CREATE TABLE IF NOT EXISTS `rols` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.rols: ~4 rows (aproximadamente)
INSERT INTO `rols` (`id`, `nombre`, `descripcion`) VALUES
	(1, 'Administrador', 'Acceso total al sistema'),
	(2, 'Marketing', 'El que vela por la publicidad de la empresa'),
	(3, 'Recursos Humanos', 'Maneja a los humanos'),
	(4, 'Finanzas', 'El que maneja y direge la economia de la empresa');

-- Volcando estructura para tabla asistencia.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rut` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `id_rol` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rols` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.users: ~6 rows (aproximadamente)
INSERT INTO `users` (`id`, `rut`, `nombre`, `apellido`, `correo`, `password`, `id_rol`) VALUES
	(1, '11.111.111-1', 'Juan', 'Pérez', 'juan.perez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 1),
	(2, '22.222.222-2', 'María', 'López', 'maria.lopez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 2),
	(3, '33.333.333-3', 'Carlos', 'Gonzales', 'carlos.soto@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 4),
	(4, '44.444.444-4', 'Ana', 'González', 'ana.gonzalez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 3),
	(5, '99.999.999-9', 'Arturo', 'Vidal', 'avidal@mail.com', '$2b$10$4bLY5OHlxDrarRcHVV52l.GkUFV/SNTiavqerL5qTfCM/D8yP6N32', 4),
	(6, '88.888.888-8', 'Benjamin', 'Pavez', 'bpavez@mail.com', '$2b$10$2Ht35qoq/cScqu1eISHAUOXarSr45fh4nZa8kK/7uSn5jEyFw3ity', 2);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
