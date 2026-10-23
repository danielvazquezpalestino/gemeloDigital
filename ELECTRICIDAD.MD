# Electricidad — Módulo del Gemelo Digital

## Descripción

Módulo de la API que expone el **catálogo de tarifas eléctricas**, la
**estimación de una factura** y la **evaluación del riesgo de caer en la tarifa
DAC**.

El módulo respeta la arquitectura limpia por capas:

- El **dominio** contiene las entidades, los DTO con validación, los contratos
  (repositorio y fuente de datos) y los servicios de cálculo
  (`CalculadoraFacturaElectrica` y `EvaluadorRiesgoDac`).
- La **infraestructura** consulta MySQL y, si no hay registros o la consulta
  falla, devuelve el **catálogo formal en memoria**.
- La **presentación** valida la entrada, invoca el repositorio y traduce los
  errores a `CustomError` con el formato único `{ "mensaje": "..." }`.

> **Aviso:** los precios y límites del catálogo son **datos de DEMOSTRACIÓN**.
> No son tarifas oficiales de la CFE y no deben presentarse como tales.

## Método y rutas

| Método | Ruta | Controlador | Método del controlador | Estado |
|---|---|---|---|---|
| GET | `/api/v1/electricity/tariffs` | `ControladorElectricidad` | `listarTarifas` | Implementado |
| POST | `/api/v1/electricity/estimate-bill` | `ControladorElectricidad` | `estimarFactura` | Implementado |
| GET | `/api/v1/electricity/dac-risk` | `ControladorElectricidad` | `evaluarRiesgoDac` | Implementado |

## Autenticación

No requerida.

---

## 1. GET /api/v1/electricity/tariffs — Consultar las tarifas

Devuelve las tarifas eléctricas disponibles. La fuente de datos intenta leer
MySQL primero; si la tabla `tarifas_electricas` no existe, está vacía o la
consulta falla, el repositorio recibe el **catálogo formal en memoria** de
`FuenteDatosElectricidadImpl`.

### Parámetros

Ninguno.

### Ejemplo

```
GET /api/v1/electricity/tariffs
```

### Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Tarifas obtenidas correctamente",
    "esDemostracion": true,
    "advertencia": "El catálogo contiene datos de DEMOSTRACIÓN. No son tarifas oficiales de la CFE.",
    "tarifas": [
        {
            "codigo": "PDBT",
            "nombre": "Tarifa doméstica de demostración",
            "descripcion": "Tarifa plana de baja tensión con bloques de consumo. Datos de demostración, no oficiales.",
            "tipoUsuario": "HOGAR",
            "bloques": [
                { "hastaKwh": 75, "precioKwh": 1.05 },
                { "hastaKwh": 125, "precioKwh": 1.25 },
                { "hastaKwh": null, "precioKwh": 1.45 }
            ],
            "esDemostracion": true
        },
        {
            "codigo": "DAC",
            "nombre": "Tarifa de alto consumo de demostración",
            "descripcion": "Tarifa de alto consumo con precio único. Datos de demostración, no oficiales.",
            "tipoUsuario": "HOGAR",
            "bloques": [
                { "hastaKwh": null, "precioKwh": 2.1 }
            ],
            "esDemostracion": true
        },
        {
            "codigo": "GDBT",
            "nombre": "Tarifa general de baja tensión de demostración",
            "descripcion": "Tarifa general por bloques para pequeños comercios. Datos de demostración, no oficiales.",
            "tipoUsuario": "COMERCIO",
            "bloques": [
                { "hastaKwh": 100, "precioKwh": 1.1 },
                { "hastaKwh": null, "precioKwh": 1.6 }
            ],
            "esDemostracion": true
        }
    ]
}
```

### Campos de la tarifa

| Campo | Tipo | Descripción |
|---|---|---|
| `codigo` | texto | Código de la tarifa: `PDBT`, `DAC`, `GDBT`, etc. |
| `nombre` | texto | Nombre visible de la tarifa |
| `descripcion` | texto | Alcance de la tarifa |
| `tipoUsuario` | texto | Tipo de usuario: `HOGAR`, `COMERCIO`, etc. |
| `bloques` | arreglo | Bloques de consumo de la tarifa |
| `bloques[].hastaKwh` | número o `null` | Tamaño máximo del bloque en kWh; `null` es el bloque final sin límite |
| `bloques[].precioKwh` | número | Precio del bloque en pesos por kWh |
| `esDemostracion` | booleano | Indica si la tarifa contiene datos de demostración |

La respuesta incluye `esDemostracion: true` y la `advertencia` cuando al menos
una tarifa es de demostración. Si todas las filas de MySQL están marcadas como
oficiales, `esDemostracion` vale `false` y `advertencia` vale `null`.

> El fallback no cambia el contrato del repositorio: `listarTarifas()` sigue
> devolviendo `TarifaElectrica[]`. La decisión de usar MySQL o el catálogo en
> memoria vive únicamente en la fuente de datos.

---

## 2. POST /api/v1/electricity/estimate-bill — Estimar una factura

Aplica la lógica de bloques de `CalculadoraFacturaElectrica` al consumo
declarado y devuelve el desglose y el total estimado.

### Parámetros del cuerpo

| Campo | Tipo | Obligatorio | Restricciones | Descripción |
|---|---|---|---|---|
| `tipoTarifa` | texto | Sí | `PDBT`, `DAC` o `GDBT` (sin distinguir mayúsculas) | Tarifa con la que se estima la factura |
| `consumoKwh` | número | Sí | > 0 y ≤ 10 000 000 | Consumo total del periodo en kWh |
| `periodo` | texto | No | `MENSUAL`, `BIMESTRAL`, `TRIMESTRAL`, `SEMESTRAL` o `ANUAL` (por defecto `MENSUAL`) | Periodo al que corresponde el consumo |

`periodo` es informativo: el cálculo aplica los bloques de la tarifa al total
de kWh recibido y **no convierte** el consumo entre periodos.

### Ejemplo — parámetros básicos

```json
{
    "tipoTarifa": "PDBT",
    "consumoKwh": 150,
    "periodo": "BIMESTRAL"
}
```

### Ejemplo — tarifa DAC

```json
{
    "tipoTarifa": "DAC",
    "consumoKwh": 300,
    "periodo": "MENSUAL"
}
```

### Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Estimación de factura calculada correctamente",
    "factura": {
        "tarifaCodigo": "PDBT",
        "tarifaNombre": "Tarifa doméstica de demostración",
        "consumoKwh": 150,
        "periodo": "BIMESTRAL",
        "moneda": "MXN",
        "desglose": [
            {
                "concepto": "Bloque 1 (hasta 75 kWh)",
                "cantidadKwh": 75,
                "precioKwh": 1.05,
                "subtotal": 78.75
            },
            {
                "concepto": "Bloque 2 (hasta 125 kWh)",
                "cantidadKwh": 75,
                "precioKwh": 1.25,
                "subtotal": 93.75
            }
        ],
        "totalEstimado": 172.5,
        "esDemostracion": true,
        "supuestos": [
            "Los precios y límites usados son datos de DEMOSTRACIÓN y no tarifas oficiales de la CFE.",
            "La estimación no incluye IVA, cargos fijos, ajustes, recargos ni subsidios.",
            "El resultado es informativo y no sustituye un recibo o una determinación oficial."
        ]
    }
}
```

### Campos de la factura

| Campo | Tipo | Descripción |
|---|---|---|
| `tarifaCodigo` | texto | Código de la tarifa aplicada |
| `tarifaNombre` | texto | Nombre de la tarifa aplicada |
| `consumoKwh` | número | Consumo usado en el cálculo |
| `periodo` | texto | Periodo declarado por el cliente |
| `moneda` | texto | Moneda del resultado (`MXN`) |
| `desglose` | arreglo | Líneas de consumo calculadas |
| `desglose[].concepto` | texto | Nombre del bloque aplicado |
| `desglose[].cantidadKwh` | número | kWh consumidos en ese bloque |
| `desglose[].precioKwh` | número | Precio del bloque en pesos por kWh |
| `desglose[].subtotal` | número | Importe del bloque en pesos |
| `totalEstimado` | número | Suma de los subtotales en pesos |
| `esDemostracion` | booleano | Indica si la tarifa es de demostración |
| `supuestos` | arreglo de textos | Limitaciones del cálculo |

---

## 3. GET /api/v1/electricity/dac-risk — Evaluar el riesgo DAC

Aplica la regla de demostración de `EvaluadorRiesgoDac` al consumo promedio
mensual y devuelve el nivel de riesgo.

### Parámetros de consulta

| Parámetro | Tipo | Obligatorio | Restricciones | Descripción |
|---|---|---|---|---|
| `consumoPromedioMensualKwh` | número | Sí | > 0 y ≤ 10 000 000 | Consumo promedio mensual en kWh |
| `tipoTarifa` | texto | Sí | `PDBT`, `DAC` o `GDBT` (sin distinguir mayúsculas) | Tarifa actual del usuario |
| `mesesHistoricos` | número | No | Entero entre 1 y 120 (por defecto 12) | Meses de historial disponibles |

La regla requiere al menos **6 meses** de historial. Con menos, el resultado es
`INDETERMINADO`.

### Ejemplo — riesgo alto

```
GET /api/v1/electricity/dac-risk?consumoPromedioMensualKwh=3000&tipoTarifa=PDBT
```

### Ejemplo — riesgo medio

```
GET /api/v1/electricity/dac-risk?consumoPromedioMensualKwh=2200&tipoTarifa=GDBT&mesesHistoricos=12
```

### Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Riesgo DAC evaluado con una regla de demostración",
    "evaluacion": {
        "nivelRiesgo": "ALTO",
        "tipoTarifa": "PDBT",
        "puedeDeterminarse": true,
        "motivo": "El consumo promedio alcanza o supera el umbral mensual de demostración.",
        "consumoPromedioMensualKwh": 3000,
        "mesesHistoricos": 12,
        "umbralMensualKwh": 2500,
        "indiceSobreUmbral": 1.2,
        "esDemostracion": true,
        "determinacionOficial": false,
        "advertencias": [
            "La regla aplicada es una DEMOSTRACIÓN y no un criterio oficial de la CFE.",
            "El resultado no constituye una determinación oficial de cambio de tarifa."
        ]
    }
}
```

### Campos de la evaluación

| Campo | Tipo | Descripción |
|---|---|---|
| `nivelRiesgo` | texto | `BAJO`, `MEDIO`, `ALTO` o `INDETERMINADO` |
| `tipoTarifa` | texto | Tarifa actual declarada por el cliente |
| `puedeDeterminarse` | booleano | `false` si no hay historial suficiente |
| `motivo` | texto | Explicación del nivel obtenido |
| `consumoPromedioMensualKwh` | número | Consumo usado en la evaluación |
| `mesesHistoricos` | número | Meses de historial usados |
| `umbralMensualKwh` | número o `null` | Umbral de demostración (2500 kWh) |
| `indiceSobreUmbral` | número o `null` | Consumo dividido por el umbral |
| `esDemostracion` | booleano | Siempre `true`: la regla no es oficial |
| `determinacionOficial` | booleano | Siempre `false` |
| `advertencias` | arreglo de textos | Limitaciones del resultado |

Si `tipoTarifa` es `DAC`, se agrega una advertencia indicando que el usuario ya
se encuentra en esa tarifa y que el nivel se muestra solo como referencia.

---

## Modelo de cálculo

El modelo vive en el dominio:

- `node/src/domain/servicios/calculadora-factura-electrica.ts`
- `node/src/domain/servicios/evaluador-riesgo-dac.ts`

### Constantes

| Constante | Valor | Significado |
|---|---|---|
| `UMBRAL_DEMO_KWH_MENSUAL` | 2500 | Umbral mensual de la regla de demostración |
| `MESES_MINIMOS_DEMO` | 6 | Historial mínimo para emitir un riesgo |
| Precio `PDBT` | 1.05 / 1.25 / 1.45 | Precio por kWh de cada bloque de demostración |
| Precio `DAC` | 2.10 | Precio único por kWh de demostración |
| Precio `GDBT` | 1.10 / 1.60 | Precio por kWh de cada bloque de demostración |

### Fórmulas de la factura

```
cantidad del bloque = min(consumo restante, hastaKwh)        (null = todo el restante)
subtotal del bloque = cantidad del bloque * precioKwh
total estimado      = suma de subtotales
```

`hastaKwh` se interpreta como el **tamaño máximo del bloque**, no como un
umbral acumulado. Por eso, con `PDBT` y 150 kWh, se aplican 75 kWh del primer
bloque y 75 kWh del segundo.

Todos los importes se redondean a dos decimales.

### Fórmulas del riesgo DAC

```
índice sobre umbral = consumoPromedioMensualKwh / 2500
nivel BAJO          = índice < 0.80
nivel MEDIO         = 0.80 <= índice < 1.00
nivel ALTO          = índice >= 1.00
nivel INDETERMINADO = mesesHistoricos < 6
```

---

## Códigos de respuesta

| Código | Cuerpo | Descripción |
|---|---|---|
| 200 | `{ "mensaje": "...", ... }` | Consulta o cálculo correctos |
| 400 | `{ "mensaje": "..." }` | Datos o parámetros inválidos. Se lanza como `CustomError.badRequest(...)` |
| 404 | `{ "mensaje": "La tarifa \"...\" no existe en el catálogo configurado" }` | La tarifa solicitada no está en el catálogo |
| 500 | `{ "mensaje": "..." }` | Error interno. El detalle real solo se registra en el servidor con `console.error` |

Ejemplos de errores `400`:

```json
{ "mensaje": "El campo \"tipoTarifa\" es obligatorio y debe ser un texto" }
```

```json
{ "mensaje": "El campo \"tipoTarifa\" debe ser PDBT, DAC o GDBT" }
```

```json
{ "mensaje": "El campo \"consumoKwh\" debe ser mayor que 0" }
```

```json
{ "mensaje": "El campo \"periodo\" debe ser MENSUAL, BIMESTRAL, TRIMESTRAL, SEMESTRAL o ANUAL" }
```

```json
{ "mensaje": "El parámetro \"consumoPromedioMensualKwh\" es obligatorio" }
```

---

## Arquitectura (capas y archivos)

```
Petición HTTP
   │
   ├─▶ presentation/routes.ts                          AppRoutes                 → monta /api/v1
   │      └─▶ presentation/rutas-v1.ts                 RutasV1                   → monta /electricity
   │             └─▶ presentation/electricidad/rutas.ts
   │                    RutasElectricidad              → declara método + ruta
   │                    └─▶ presentation/electricidad/controlador.ts
   │                           ControladorElectricidad → valida el DTO, invoca el puerto,
   │                                                   │ mapea el resultado a la respuesta
   │                                                   ▼
   │                  domain/repositories/repositorio-electricidad.ts
   │                    RepositorioElectricidad         (puerto, abstracto)
   │                                                   ▼
   │                  infrastructure/repositories/repositorio-electricidad.impl.ts
   │                    RepositorioElectricidadImpl     → orquesta catálogo y cálculos
   │                                                   ▼
   │                  domain/servicios/calculadora-factura-electrica.ts
   │                    CalculadoraFacturaElectrica     → aplica los bloques de la tarifa
   │                  domain/servicios/evaluador-riesgo-dac.ts
   │                    EvaluadorRiesgoDac              → aplica la regla de demostración
   │                                                   ▼
   │                  domain/datasources/fuente-datos-electricidad.ts
   │                    FuenteDatosElectricidad          (puerto, abstracto)
   │                                                   ▼
   │                  infrastructure/datasources/fuente-datos-electricidad.impl.ts
   │                    FuenteDatosElectricidadImpl      → consulta MySQL y aplica fallback
   │                                                   ▼
   │                  config/database.ts                 pool de conexiones MySQL
   │
   └─▶ Respuesta JSON  ◀── controlador mapea entidad/error → { ... } o { "mensaje": "..." }
```

| Capa | Archivo | Símbolo |
|---|---|---|
| Dominio (entidad) | `node/src/domain/entities/tarifa-electrica.entidad.ts` | `TarifaElectrica` |
| Dominio (entidad) | `node/src/domain/entities/bloque-consumo-tarifa.entidad.ts` | `BloqueConsumoTarifa` |
| Dominio (entidad) | `node/src/domain/entities/factura-estimada.entidad.ts` | `FacturaEstimada` |
| Dominio (entidad) | `node/src/domain/entities/linea-factura-estimada.entidad.ts` | `LineaFacturaEstimada` |
| Dominio (entidad) | `node/src/domain/entities/riesgo-dac.entidad.ts` | `EvaluacionRiesgoDac` |
| Dominio (enumeración) | `node/src/domain/entities/tipo-tarifa.ts` | `TipoTarifa` |
| Dominio (enumeración) | `node/src/domain/entities/periodo-facturacion.ts` | `PeriodoFacturacion` |
| Dominio (DTO) | `node/src/domain/entities/dtos/electricidad/estimar-factura.dto.ts` | `DtoEstimarFactura` |
| Dominio (DTO) | `node/src/domain/entities/dtos/electricidad/riesgo-dac.dto.ts` | `DtoRiesgoDac` |
| Dominio (servicio) | `node/src/domain/servicios/calculadora-factura-electrica.ts` | `CalculadoraFacturaElectrica` |
| Dominio (servicio) | `node/src/domain/servicios/evaluador-riesgo-dac.ts` | `EvaluadorRiesgoDac` |
| Dominio (puerto repositorio) | `node/src/domain/repositories/repositorio-electricidad.ts` | `RepositorioElectricidad` |
| Dominio (puerto fuente de datos) | `node/src/domain/datasources/fuente-datos-electricidad.ts` | `FuenteDatosElectricidad` |
| Dominio (error) | `node/src/domain/datasources/errors/custom.error.ts` | `CustomError` |
| Infraestructura (fuente de datos) | `node/src/infrastructure/datasources/fuente-datos-electricidad.impl.ts` | `FuenteDatosElectricidadImpl` |
| Infraestructura (repositorio) | `node/src/infrastructure/repositories/repositorio-electricidad.impl.ts` | `RepositorioElectricidadImpl` |
| Infraestructura (script SQL) | `node/src/infrastructure/base-datos/script_tarifas_electricas.sql` | — |
| Presentación (controlador) | `node/src/presentation/electricidad/controlador.ts` | `ControladorElectricidad` |
| Presentación (rutas del módulo) | `node/src/presentation/electricidad/rutas.ts` | `RutasElectricidad` |
| Presentación (rutas raíz) | `node/src/presentation/rutas-v1.ts` | `RutasV1` (monta `/electricity`) |

El SQL vive únicamente en `infrastructure/`. El dominio no conoce Express ni
MySQL, y la composición de dependencias se hace en
`presentation/electricidad/rutas.ts`.

---

## Base de datos

- **Base de datos:** `gemeloDigital`.
- **Tablas:**
  - `tarifas_electricas`: catálogo de tarifas.
  - `bloques_consumo_tarifa`: bloques de consumo de cada tarifa.
- **Script de creación y datos iniciales:**
  `node/src/infrastructure/base-datos/script_tarifas_electricas.sql`.

```sql
CREATE TABLE IF NOT EXISTS tarifas_electricas (
    codigo              VARCHAR(20)   NOT NULL,
    nombre              VARCHAR(120)  NOT NULL,
    descripcion         VARCHAR(500)  NOT NULL,
    tipo_usuario        VARCHAR(30)   NOT NULL,
    es_demostracion     BOOLEAN       NOT NULL DEFAULT TRUE,
    fecha_actualizacion DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bloques_consumo_tarifa (
    id              INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    tarifa_codigo   VARCHAR(20)       NOT NULL,
    hasta_kwh       DECIMAL(10,2)     NULL,
    precio_kwh      DECIMAL(12,4)     NOT NULL,
    orden           SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_bloques_tarifa_orden (tarifa_codigo, orden),
    CONSTRAINT fk_bloques_tarifa
        FOREIGN KEY (tarifa_codigo) REFERENCES tarifas_electricas (codigo)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Fallback al catálogo formal

`FuenteDatosElectricidadImpl.listarTarifas()` intenta ejecutar la consulta
parametrizada sobre el pool de MySQL. Si no hay filas o la consulta lanza un
error (por ejemplo, porque la tabla todavía no existe), devuelve el catálogo
formal en memoria. Así los tres endpoints siguen disponibles aunque la base de
datos no esté preparada.

El catálogo en memoria contiene las mismas tres tarifas del script
(`PDBT`, `DAC`, `GDBT`) y está marcado como demostración.

### Ejecutar el script

```bash
mysql -u root -p gemeloDigital < node/src/infrastructure/base-datos/script_tarifas_electricas.sql
```

El script es idempotente para las tablas y vuelve a sembrar los bloques de las
tres tarifas de demostración.

---

## Prueba rápida

Con el servidor levantado (`npm run dev` dentro de `node/`):

```bash
# 1. Consultar el catálogo de tarifas
curl http://localhost:3100/api/v1/electricity/tariffs

# 2. Estimar una factura PDBT bimestral
curl -X POST http://localhost:3100/api/v1/electricity/estimate-bill \
  -H "Content-Type: application/json" \
  -d '{"tipoTarifa":"PDBT","consumoKwh":150,"periodo":"BIMESTRAL"}'

# 3. Estimar una factura DAC
curl -X POST http://localhost:3100/api/v1/electricity/estimate-bill \
  -H "Content-Type: application/json" \
  -d '{"tipoTarifa":"DAC","consumoKwh":300}'

# 4. Evaluar riesgo DAC alto
curl "http://localhost:3100/api/v1/electricity/dac-risk?consumoPromedioMensualKwh=3000&tipoTarifa=PDBT"

# 5. Evaluar riesgo DAC con historial
curl "http://localhost:3100/api/v1/electricity/dac-risk?consumoPromedioMensualKwh=2200&tipoTarifa=GDBT&mesesHistoricos=12"

# 6. Estimación inválida (debe responder 400)
curl -X POST http://localhost:3100/api/v1/electricity/estimate-bill \
  -H "Content-Type: application/json" \
  -d '{"consumoKwh":150}'

# 7. Riesgo sin tipo de tarifa (debe responder 400)
curl "http://localhost:3100/api/v1/electricity/dac-risk?consumoPromedioMensualKwh=3000"
```

(El puerto depende de la variable `PORT` de `node/src/.env`; por defecto 3100.)

---

## Notas y trabajo futuro

- **Datos de demostración:** los precios, bloques y el umbral DAC no provienen
  de una fuente oficial verificada. Antes de usar el módulo en producción hay
  que cargar el catálogo oficial de la CFE en MySQL.
- **Periodo:** `periodo` se conserva en la respuesta, pero el cálculo no
  convierte kWh entre periodos. Si el cliente envía un consumo anual, la
  estimación se calcula sobre ese total.
- **Fallback silencioso para el cliente:** cuando MySQL no está disponible, el
  endpoint responde `200` con el catálogo en memoria. El error real se registra
  en el servidor con `console.error`.
- **Persistencia:** este módulo es de solo lectura sobre el catálogo; no guarda
  estimaciones ni evaluaciones.
- **Cargos oficiales:** la estimación no incluye IVA, cargos fijos, ajustes,
  recargos ni subsidios.
- **Seguridad:** los endpoints todavía no tienen autenticación, CORS, limitador
  de peticiones ni manejador global de errores; quedan pendientes del
  `AGENTS.md`.
- **Pruebas:** `node/src/pruebas/endpoints.test.ts` cubre el catálogo, la
  estimación, el riesgo DAC y los errores `400` del módulo.
