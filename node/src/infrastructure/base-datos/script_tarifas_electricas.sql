-- ============================================================================
-- Script: script_tarifas_electricas.sql
-- Descripción: crea el catálogo de tarifas eléctricas del módulo de
--              Electricidad en la base de datos `gemeloDigital`.
--
-- El módulo consulta estas tablas y, si no encuentra registros o la consulta
-- falla, usa el catálogo formal en memoria de FuenteDatosElectricidadImpl.
--
-- IMPORTANTE: los precios y límites insertados son DATOS DE DEMOSTRACIÓN.
-- No son tarifas oficiales de la CFE y no deben presentarse como tales.
--
-- Uso: ejecutar sobre la base de datos configurada en src/.env (DB_NAME).
-- ============================================================================

USE gemeloDigital;

CREATE TABLE IF NOT EXISTS tarifas_electricas (
    codigo              VARCHAR(20)   NOT NULL COMMENT 'Código de la tarifa: PDBT, DAC, GDBT u otro',
    nombre              VARCHAR(120)  NOT NULL COMMENT 'Nombre visible de la tarifa',
    descripcion         VARCHAR(500)  NOT NULL COMMENT 'Descripción del alcance de la tarifa',
    tipo_usuario        VARCHAR(30)   NOT NULL COMMENT 'Tipo de usuario: HOGAR, COMERCIO, etc.',
    es_demostracion     BOOLEAN       NOT NULL DEFAULT TRUE COMMENT 'Indica si los datos son de demostración',
    fecha_actualizacion DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de la última modificación',
    PRIMARY KEY (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bloques_consumo_tarifa (
    id              INT UNSIGNED      NOT NULL AUTO_INCREMENT COMMENT 'Identificador del bloque',
    tarifa_codigo   VARCHAR(20)       NOT NULL COMMENT 'Código de la tarifa a la que pertenece',
    hasta_kwh       DECIMAL(10,2)     NULL     COMMENT 'Tamaño máximo del bloque en kWh; NULL para el bloque final',
    precio_kwh      DECIMAL(12,4)     NOT NULL COMMENT 'Precio del bloque en pesos por kWh',
    orden           SMALLINT UNSIGNED NOT NULL COMMENT 'Orden del bloque dentro de la tarifa',
    PRIMARY KEY (id),
    UNIQUE KEY uk_bloques_tarifa_orden (tarifa_codigo, orden),
    CONSTRAINT fk_bloques_tarifa
        FOREIGN KEY (tarifa_codigo) REFERENCES tarifas_electricas (codigo)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catálogo inicial de demostración. Se puede reemplazar por datos oficiales
-- verificados sin cambiar el código de la API.
INSERT INTO tarifas_electricas
    (codigo, nombre, descripcion, tipo_usuario, es_demostracion)
VALUES
    (
        'PDBT',
        'Tarifa doméstica de demostración',
        'Tarifa plana de baja tensión con bloques de consumo. Datos de demostración, no oficiales.',
        'HOGAR',
        TRUE
    ),
    (
        'DAC',
        'Tarifa de alto consumo de demostración',
        'Tarifa de alto consumo con precio único. Datos de demostración, no oficiales.',
        'HOGAR',
        TRUE
    ),
    (
        'GDBT',
        'Tarifa general de baja tensión de demostración',
        'Tarifa general por bloques para pequeños comercios. Datos de demostración, no oficiales.',
        'COMERCIO',
        TRUE
    )
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    tipo_usuario = VALUES(tipo_usuario),
    es_demostracion = VALUES(es_demostracion);

-- Se reemplazan únicamente los bloques de las tarifas sembradas.
DELETE FROM bloques_consumo_tarifa
WHERE tarifa_codigo IN ('PDBT', 'DAC', 'GDBT');

INSERT INTO bloques_consumo_tarifa
    (tarifa_codigo, hasta_kwh, precio_kwh, orden)
VALUES
    ('PDBT', 75.00, 1.0500, 1),
    ('PDBT', 125.00, 1.2500, 2),
    ('PDBT', NULL, 1.4500, 3),
    ('DAC', NULL, 2.1000, 1),
    ('GDBT', 100.00, 1.1000, 1),
    ('GDBT', NULL, 1.6000, 2);
