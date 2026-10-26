-- ============================================================================
-- Script: script_simulaciones.sql
-- Descripción: crea la tabla `simulaciones` en la base de datos `gemeloDigital`
--              para el módulo de Simulaciones Solares.
--
-- La tabla guarda los datos de entrada declarados por el cliente (municipio,
-- consumo anual, tarifa de la CFE, área del techo, tipo de tarifa y si
-- incluye baterías) junto con los resultados que determina el modelo de
-- cálculo del dominio (paneles, producción, ahorro, costo y retorno).
--
-- La columna `advertencias` guarda un arreglo JSON con los indicadores que
-- devuelve el modelo (por ejemplo: el techo no alcanza para los paneles
-- requeridos o la producción no cubre todo el consumo).
--
-- Uso: ejecutar sobre la base de datos configurada en src/.env (DB_NAME).
-- ============================================================================

USE gemeloDigital;

CREATE TABLE IF NOT EXISTS simulaciones (
    id                      INT UNSIGNED      NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la simulación',
    municipio_id            INT               NOT NULL COMMENT 'Clave INEGI del municipio (referencia a municipios.id)',
    consumo_kwh             DECIMAL(10,2)     NOT NULL COMMENT 'Consumo eléctrico anual en kWh',
    tarifa_cfe              DECIMAL(10,4)     NOT NULL COMMENT 'Costo de la energía en pesos por kWh',
    area_disponible_m2      DECIMAL(10,2)     NULL     COMMENT 'Superficie del techo disponible en metros cuadrados',
    tipo_tarifa             VARCHAR(10)       NOT NULL DEFAULT 'PDBT' COMMENT 'Tipo de tarifa de la CFE: PDBT, DAC o GDBT',
    incluye_baterias        BOOLEAN           NOT NULL DEFAULT FALSE COMMENT 'Si la inversión incluye un banco de baterías',
    paneles_necesarios      SMALLINT UNSIGNED NOT NULL COMMENT 'Número de paneles que requiere la instalación',
    produccion_anual        DECIMAL(12,2)     NOT NULL COMMENT 'Producción solar estimada en kWh al año',
    ahorro_estimado         DECIMAL(12,2)     NOT NULL COMMENT 'Ahorro anual estimado en pesos',
    costo_inversion_total   DECIMAL(12,2)     NOT NULL COMMENT 'Costo total de la inversión en pesos',
    retorno_inversion_anios DECIMAL(8,2)      NOT NULL COMMENT 'Años estimados para recuperar la inversión',
    advertencias            TEXT              NULL     COMMENT 'Indicadores del modelo de cálculo (arreglo JSON de textos)',
    fecha_creacion          DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    fecha_actualizacion     DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de la última actualización',
    PRIMARY KEY (id),
    KEY idx_simulaciones_municipio (municipio_id),
    KEY idx_simulaciones_fecha (fecha_creacion),
    CONSTRAINT fk_simulaciones_municipio
        FOREIGN KEY (municipio_id) REFERENCES municipios (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- El script es idempotente: `CREATE TABLE IF NOT EXISTS` no altera una tabla
-- existente. No se ejecuta ninguna limpieza para no borrar datos reales.
