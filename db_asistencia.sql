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

-- Volcando estructura para tabla asistencia.estadoasistencia
CREATE TABLE IF NOT EXISTS `estadoasistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.estadoasistencia: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.users: ~4 rows (aproximadamente)
INSERT INTO `users` (`id`, `rut`, `nombre`, `apellido`, `correo`, `password`, `id_rol`) VALUES
	(1, '11.111.111-1', 'Juan', 'Pérez', 'juan.perez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 1),
	(2, '22.222.222-2', 'María', 'López', 'maria.lopez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 2),
	(3, '33.333.333-3', 'Carlos', 'Soto', 'carlos.soto@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 4),
	(4, '44.444.444-4', 'Ana', 'González', 'ana.gonzalez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 3);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
