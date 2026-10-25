-- ============================================================================
-- Script: script_paneles_solares.sql
-- Descripción: crea el catálogo de paneles solares del módulo de Paneles en
--              la base de datos `gemeloDigital`.
--
-- El módulo consulta esta tabla y, si no encuentra registros o la consulta
-- falla, usa el catálogo formal en memoria de FuenteDatosPanelesImpl.
--
-- IMPORTANTE: los fabricantes y modelos insertados son FICTICIOS. Son datos de
-- demostración y no representan productos reales verificados.
--
-- Uso: ejecutar sobre la base de datos configurada en src/.env (DB_NAME).
-- ============================================================================

USE gemeloDigital;

CREATE TABLE IF NOT EXISTS paneles_solares (
    id                  VARCHAR(30)       NOT NULL COMMENT 'Identificador del panel en el catálogo',
    fabricante          VARCHAR(100)      NOT NULL COMMENT 'Fabricante del panel',
    modelo              VARCHAR(60)       NOT NULL COMMENT 'Modelo comercial del panel',
    potencia_watts      DECIMAL(10,2)     NOT NULL COMMENT 'Potencia nominal en watts',
    eficiencia_porcentaje DECIMAL(5,2)    NOT NULL COMMENT 'Eficiencia de conversión en porcentaje',
    tecnologia          VARCHAR(40)       NOT NULL COMMENT 'Tecnología del panel: monocristalino, policristalino, etc.',
    garantia_anios      SMALLINT UNSIGNED NOT NULL COMMENT 'Años de garantía del fabricante',
    ancho_metros        DECIMAL(5,2)      NOT NULL COMMENT 'Ancho del panel en metros',
    alto_metros         DECIMAL(5,2)      NOT NULL COMMENT 'Alto del panel en metros',
    descripcion         VARCHAR(500)      NOT NULL COMMENT 'Descripción del panel',
    es_demostracion     BOOLEAN           NOT NULL DEFAULT TRUE COMMENT 'Indica si el panel es de demostración',
    fecha_actualizacion DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de la última modificación',
    PRIMARY KEY (id),
    KEY idx_paneles_fabricante (fabricante),
    KEY idx_paneles_potencia (potencia_watts)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catálogo inicial de demostración. Se puede reemplazar por productos reales
-- verificados sin cambiar el código de la API.
INSERT INTO paneles_solares
    (id, fabricante, modelo, potencia_watts, eficiencia_porcentaje, tecnologia,
     garantia_anios, ancho_metros, alto_metros, descripcion, es_demostracion)
VALUES
    (
        'DEMO-PANEL-001',
        'Fabricante Demo Uno',
        'FD-450M',
        450.00,
        20.50,
        'Monocristalino',
        12,
        1.13,
        1.76,
        'Panel de demostración para pruebas del gemelo digital.',
        TRUE
    ),
    (
        'DEMO-PANEL-002',
        'Fabricante Demo Uno',
        'FD-550M',
        550.00,
        21.30,
        'Monocristalino',
        12,
        1.13,
        2.09,
        'Panel de demostración de mayor potencia.',
        TRUE
    ),
    (
        'DEMO-PANEL-003',
        'Fabricante Demo Dos',
        'FDD-400P',
        400.00,
        19.20,
        'Policristalino',
        10,
        1.05,
        1.95,
        'Panel de demostración de tecnología policristalina.',
        TRUE
    )
ON DUPLICATE KEY UPDATE
    fabricante = VALUES(fabricante),
    modelo = VALUES(modelo),
    potencia_watts = VALUES(potencia_watts),
    eficiencia_porcentaje = VALUES(eficiencia_porcentaje),
    tecnologia = VALUES(tecnologia),
    garantia_anios = VALUES(garantia_anios),
    ancho_metros = VALUES(ancho_metros),
    alto_metros = VALUES(alto_metros),
    descripcion = VALUES(descripcion),
    es_demostracion = VALUES(es_demostracion);
