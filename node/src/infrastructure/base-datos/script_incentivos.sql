-- ============================================================================
-- Script: script_incentivos.sql
-- Descripción: crea la tabla `incentivos` en la base de datos `gemeloDigital`
--              para el módulo de Incentivos y Programas de Apoyo.
--
-- La tabla almacena los programas de apoyo para la generación distribuida y la
-- instalación de sistemas solares fotovoltaicos (hogares y PyMEs de Puebla).
--
-- - `beneficiarios` guarda el arreglo JSON de tipos de beneficiario aplicables
--   (por ejemplo `["home", "business"]`).
-- - `requisitos` guarda el arreglo JSON de requisitos documentados por programa.
-- - `beneficios` guarda el arreglo JSON de beneficios (tipo, monto, porcentaje
--   y moneda).
-- - `estado_verificacion` indica si los requisitos del programa fueron
--   verificados por el organismo competente (`verified` / `noVerificado`).
--
-- Uso: ejecutar sobre la base de datos configurada en src/.env (DB_NAME).
-- ============================================================================

USE gemeloDigital;

CREATE TABLE IF NOT EXISTS incentivos (
    id                    INT UNSIGNED      NOT NULL AUTO_INCREMENT COMMENT 'Identificador del programa de incentivos',
    programa             VARCHAR(150)      NOT NULL COMMENT 'Clave o nombre del programa de apoyo',
    nombre                VARCHAR(150)      NOT NULL COMMENT 'Nombre oficial del programa',
    descripcion          TEXT              NULL     COMMENT 'Descripción del programa de apoyo',
    beneficiarios         JSON             NOT NULL COMMENT 'Tipos de beneficiario aplicables: ["home", "business"]',
    municipio_id          INT               NULL     COMMENT 'Clave INEGI del municipio (NULL para programas del nivel estatal)',
    requisitos            JSON             NOT NULL COMMENT 'Requisitos documentados por programa (arreglo JSON)',
    beneficios            JSON              NULL     COMMENT 'Beneficios del programa (arreglo JSON)',
    vigencia_desde        DATE              NULL     COMMENT 'Fecha de inicio de la vigencia del programa',
    vigencia_hasta        DATE              NULL     COMMENT 'Fecha de cierre de la vigencia del programa',
    organismo_responsable VARCHAR(150)    NULL     COMMENT 'Organismo encargado de otorgar el apoyo',
    fuente_oficial        VARCHAR(255)      NULL     COMMENT 'URL de la fuente oficial del programa',
    estado_verificacion   VARCHAR(20)       NOT NULL DEFAULT 'noVerificado' COMMENT 'Estado de verificación de los requisitos: verified / noVerificado',
    fecha_actualizacion   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de la última actualización',
    PRIMARY KEY (id),
    KEY idx_incentivos_municipio (municipio_id),
    KEY idx_incentivos_vigencia (vigencia_hasta),
    CONSTRAINT fk_incentivos_municipio
        FOREIGN KEY (municipio_id) REFERENCES municipios (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- El script es idempotente: `CREATE TABLE IF NOT EXISTS` no altera una tabla
-- existente. No se ejecuta ninguna limpieza para no borrar datos reales.
