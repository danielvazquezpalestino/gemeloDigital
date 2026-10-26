-- ============================================================================
-- Script: script_usuarios.sql
-- Descripción: crea la tabla `usuarios` en la base de datos `gemeloDigital`
--              para el módulo de autenticación.
--
-- La contraseña se guarda cifrada con scrypt en el formato
-- `scrypt$<sal>$<clave>`; nunca en texto plano.
--
-- El script es idempotente: `CREATE TABLE IF NOT EXISTS` no altera una tabla
-- existente ni borra datos reales.
--
-- Uso: ejecutar sobre la base de datos configurada en src/.env (DB_NAME).
-- ============================================================================

USE gemeloDigital;

CREATE TABLE IF NOT EXISTS usuarios (
    id                   INT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT 'Identificador del usuario',
    nombre               VARCHAR(100)  NOT NULL COMMENT 'Nombre visible del usuario',
    correo               VARCHAR(150)  NOT NULL COMMENT 'Correo electrónico, identificador de acceso',
    contrasenia_cifrada  VARCHAR(255)  NOT NULL COMMENT 'Hash scrypt con el formato scrypt$sal$clave',
    roles                JSON          NOT NULL COMMENT 'Arreglo JSON de roles, por ejemplo ["usuario"]',
    fecha_creacion       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    fecha_actualizacion  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de la última actualización',
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuarios_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
