# Simulaciones Solares — Módulo del Gemelo Digital

## Descripción

Módulo de la API que permite **simular una instalación solar fotovoltaica** a
partir del consumo eléctrico anual de un hogar y del costo de la energía
(tarifa de la CFE), y **guardar el historial** de esas simulaciones.

Cada simulación es un registro persistido en la tabla `simulaciones` de MySQL
que almacena:

- **Los datos de entrada** declarados por el cliente (municipio, consumo
  anual, tarifa, área del techo, tipo de tarifa e inclusión de baterías).
- **Los resultados** que determina el modelo de cálculo del dominio (paneles
  necesarios, producción anual, ahorro, costo de inversión, retorno de la
  inversión e indicadores de advertencia).

El cálculo vive en el **dominio** (`CalculadoraSimulacionSolar`); la capa de
infraestructura solo persiste el resultado. La arquitectura es limpia por
capas, con nombres en español.

## Método y rutas

| Método | Ruta | Controlador | Método del controlador | Estado |
|---|---|---|---|---|
| POST | `/api/simulaciones` | `ControladorSimulaciones` | `crearSimulacion` | Implementado |
| GET | `/api/simulaciones/:id` | `ControladorSimulaciones` | `obtenerSimulacion` | Implementado |
| GET | `/api/simulaciones` | `ControladorSimulaciones` | `obtenerHistorial` | Implementado |
| DELETE | `/api/simulaciones/:id` | `ControladorSimulaciones` | `eliminarSimulacion` | Implementado |
| POST | `/api/simulaciones/:id/recalcular` | `ControladorSimulaciones` | `recalcularSimulacion` | Implementado |

## Autenticación

No requerida.

---

## 1. POST /api/simulaciones — Crear una simulación solar

Calcula la simulación con el modelo solar, la persiste y devuelve el registro
completo.

### Parámetros del cuerpo

| Campo | Tipo | Obligatorio | Restricciones | Descripción |
|---|---|---|---|---|
| `municipioId` | número | Sí | Entero > 0 | Clave INEGI del municipio (1 a 217). Debe existir en `municipios` |
| `consumoKwh` | número | Sí | > 0 y ≤ 10 000 000 | Consumo eléctrico **anual** en kWh |
| `tarifaCfe` | número | Sí | > 0 y ≤ 1 000 | Costo de la energía en pesos por kWh |
| `areaDisponibleM2` | número | No | > 0 y ≤ 1 000 000 | Superficie del techo disponible en m². Si se envía, el modelo respeta el límite físico del techo |
| `tipoTarifa` | texto | No | `PDBT`, `DAC` o `GDBT` (sin distinguir mayúsculas) | Tipo de tarifa de la CFE. Por defecto `PDBT` |
| `incluyeBaterias` | booleano | No | `true` o `false` | Si se agrega el costo de un banco de baterías a la inversión. Por defecto `false` |

### Ejemplo — parámetros básicos

```json
{
    "municipioId": 25,
    "consumoKwh": 3600,
    "tarifaCfe": 6.85
}
```

### Ejemplo — parámetros avanzados

```json
{
    "municipioId": 25,
    "consumoKwh": 6000,
    "tarifaCfe": 7.10,
    "areaDisponibleM2": 12,
    "tipoTarifa": "DAC",
    "incluyeBaterias": true
}
```

### Respuesta exitosa

Código: `201 Created`

```json
{
    "mensaje": "Simulación solar creada correctamente",
    "simulacion": {
        "id": 2,
        "municipioId": 25,
        "consumoKwh": 6000,
        "tarifaCfe": 7.1,
        "areaDisponibleM2": 12,
        "tipoTarifa": "DAC",
        "incluyeBaterias": true,
        "panelesNecesarios": 5,
        "produccionAnual": 6375,
        "ahorroEstimado": 44730,
        "costoInversionTotal": 48500,
        "retornoInversionAnios": 1.08,
        "advertencias": [
            "Se incluye un banco de baterías estimado en 18000 MXN: el retorno de inversión aumenta frente a una instalación sin baterías."
        ],
        "fechaCreacion": "2026-10-21T17:29:32.000Z",
        "fechaActualizacion": "2026-10-21T17:29:32.000Z"
    }
}
```

### Campos de la simulación

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | número | Identificador generado por la base de datos |
| `municipioId` | número | Clave INEGI del municipio |
| `consumoKwh` | número | Consumo eléctrico anual en kWh |
| `tarifaCfe` | número | Costo de la energía en pesos por kWh |
| `areaDisponibleM2` | número o `null` | Superficie del techo en m² (`null` si no se declaró) |
| `tipoTarifa` | texto | `PDBT`, `DAC` o `GDBT` |
| `incluyeBaterias` | booleano | Si la inversión incluye un banco de baterías |
| `panelesNecesarios` | número | Paneles que se instalarán (0 si el techo no permite ninguno) |
| `produccionAnual` | número | Producción solar estimada en kWh al año |
| `ahorroEstimado` | número | Ahorro anual estimado en pesos |
| `costoInversionTotal` | número | Costo total de la inversión en pesos (paneles + instalación + baterías) |
| `retornoInversionAnios` | número | Años estimados para recuperar la inversión |
| `advertencias` | arreglo de textos | Indicadores del modelo de cálculo (puede estar vacío) |
| `fechaCreacion` | fecha | Fecha de creación del registro |
| `fechaActualizacion` | fecha | Fecha de la última modificación |

---

## 2. GET /api/simulaciones/:id — Consultar una simulación

### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | número | Identificador de la simulación. Debe ser un entero mayor que cero |

### Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Simulación obtenida correctamente",
    "simulacion": {
        "id": 1,
        "municipioId": 25,
        "consumoKwh": 3600,
        "tarifaCfe": 6.85,
        "areaDisponibleM2": null,
        "tipoTarifa": "PDBT",
        "incluyeBaterias": false,
        "panelesNecesarios": 3,
        "produccionAnual": 3825,
        "ahorroEstimado": 24660,
        "costoInversionTotal": 21500,
        "retornoInversionAnios": 0.87,
        "advertencias": [],
        "fechaCreacion": "2026-10-21T17:29:16.000Z",
        "fechaActualizacion": "2026-10-21T17:29:16.000Z"
    }
}
```

---

## 3. GET /api/simulaciones — Consultar el historial

Devuelve las simulaciones en **orden descendente por fecha de creación** (las
más recientes primero), con paginación y filtro opcional por municipio.

### Parámetros de consulta

| Parámetro | Tipo | Obligatorio | Restricciones | Descripción |
|---|---|---|---|---|
| `municipioId` | número | No | Entero > 0 | Filtra el historial por municipio |
| `pagina` | número | No | Entero ≥ 1 (por defecto 1) | Número de página |
| `limite` | número | No | Entero entre 1 y 100 (por defecto 20) | Registros por página |

### Ejemplos

```
GET /api/simulaciones
GET /api/simulaciones?municipioId=25
GET /api/simulaciones?pagina=2&limite=10
GET /api/simulaciones?municipioId=25&pagina=1&limite=5
```

### Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Simulaciones obtenidas correctamente",
    "total": 2,
    "pagina": 1,
    "limite": 1,
    "simulaciones": [
        {
            "id": 2,
            "municipioId": 25,
            "consumoKwh": 6000,
            "tarifaCfe": 7.1,
            "areaDisponibleM2": 12,
            "tipoTarifa": "DAC",
            "incluyeBaterias": true,
            "panelesNecesarios": 5,
            "produccionAnual": 6375,
            "ahorroEstimado": 44730,
            "costoInversionTotal": 48500,
            "retornoInversionAnios": 1.08,
            "advertencias": [],
            "fechaCreacion": "2026-10-21T17:29:32.000Z",
            "fechaActualizacion": "2026-10-21T17:29:32.000Z"
        }
    ]
}
```

`total` es el número de registros que cumplen el filtro (sin aplicar la
paginación), para que el cliente pueda calcular el número de páginas.

---

## 4. DELETE /api/simulaciones/:id — Eliminar una simulación

Elimina el registro de forma permanente. La simulación debe existir.

### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | número | Identificador de la simulación |

### Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Simulación eliminada correctamente",
    "id": 3
}
```

---

## 5. POST /api/simulaciones/:id/recalcular — Recalcular una simulación

Vuelve a aplicar el modelo de cálculo sobre una simulación existente, usando
los **datos nuevos** enviados en el cuerpo y **conservando** los que no se
envían. Actualiza el registro y devuelve la simulación ya recalculada.

### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | número | Identificador de la simulación a recalcular |

### Parámetros del cuerpo

Todos son opcionales, pero se exige **al menos uno**.

| Campo | Tipo | Si no se envía | Si se envía `null` |
|---|---|---|---|
| `municipioId` | número entero > 0 | Conserva el municipio | Error (debe ser número) |
| `consumoKwh` | número > 0 | Conserva el consumo | Error (debe ser número) |
| `tarifaCfe` | número > 0 | Conserva la tarifa | Error (debe ser número) |
| `areaDisponibleM2` | número > 0 | Conserva el área | **Elimina** la restricción de área del techo |
| `tipoTarifa` | `PDBT`, `DAC`, `GDBT` | Conserva el tipo de tarifa | Restablece a `PDBT` |
| `incluyeBaterias` | booleano | Conserva el valor | Restablece a `false` |

### Ejemplos

```json
{ "consumoKwh": 5000, "areaDisponibleM2": 4 }
```

```json
{ "tarifaCfe": 7.5, "incluyeBaterias": true }
```

```json
{ "areaDisponibleM2": null }
```

### Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Simulación recalculada correctamente",
    "simulacion": {
        "id": 1,
        "municipioId": 25,
        "consumoKwh": 5000,
        "tarifaCfe": 6.85,
        "areaDisponibleM2": 4,
        "tipoTarifa": "PDBT",
        "incluyeBaterias": false,
        "panelesNecesarios": 2,
        "produccionAnual": 2550,
        "ahorroEstimado": 17467.5,
        "costoInversionTotal": 17000,
        "retornoInversionAnios": 0.97,
        "advertencias": [
            "El área disponible (4 m²) permite instalar como máximo 2 paneles, por lo que se instalarán 2 de los 4 necesarios para cubrir todo el consumo.",
            "La producción anual estimada (2550 kWh) no cubre todo el consumo anual (5000 kWh): la cobertura estimada es del 51 %."
        ],
        "fechaCreacion": "2026-10-21T17:29:16.000Z",
        "fechaActualizacion": "2026-10-21T17:30:24.000Z"
    }
}
```

`fechaCreacion` se conserva y `fechaActualizacion` refleja el recálculo.

---

## Modelo de cálculo

El modelo vive en el dominio, en
`node/src/domain/servicios/calculadora-simulacion-solar.ts`. Todas las
constantes de mercado están agrupadas en esa clase para que el supuesto técnico
sea auditable y ajustable en un solo lugar.

### Constantes

| Constante | Valor | Significado |
|---|---|---|
| `PRODUCCION_ANUAL_PANEL_KWH` | 1500 | kWh que genera un panel al año |
| `FACTOR_DESEMPENO` | 0.85 | Pérdidas por orientación, suciedad y temperatura |
| `AREA_PANEL_M2` | 1.7 | Superficie que ocupa cada panel (módulo + separación) |
| `COSTO_PANEL_MXN` | 4500 | Costo del panel con estructura, en pesos |
| `COSTO_INSTALACION_MXN` | 8000 | Costo fijo de mano de obra e instalación, en pesos |
| `COSTO_BANCO_BATERIAS_MXN` | 18000 | Costo estimado de un banco de baterías, en pesos |
| `FACTORES_TARIFA` | `PDBT` 1.00, `DAC` 1.05, `GDBT` 1.03 | Ajuste del ahorro según el tipo de tarifa |

### Fórmulas

```
producción por panel      = PRODUCCION_ANUAL_PANEL_KWH * FACTOR_DESEMPENO            = 1275 kWh/año
paneles requeridos        = max(1, ceil(consumoKwh / producción por panel))
paneles máximo por techo  = floor(areaDisponibleM2 / AREA_PANEL_M2)                   (si se envió el área)
paneles a instalar        = min(paneles requeridos, paneles máximo por techo)         (si el techo limita)
producción anual          = paneles a instalar * producción por panel
energía cubierta          = min(producción anual, consumoKwh)
ahorro estimado           = energía cubierta * tarifaCfe * FACTORES_TARIFA[tipoTarifa]
costo de paneles          = paneles a instalar * COSTO_PANEL_MXN
costo de instalación      = COSTO_INSTALACION_MXN (0 si no se instalan paneles)
costo de baterías         = COSTO_BANCO_BATERIAS_MXN (0 si no se incluyen o no hay paneles)
costo total de inversión  = costo de paneles + costo de instalación + costo de baterías
retorno de inversión      = costo total de inversión / ahorro estimado
```

Todos los resultados derivados se redondean a dos decimales.

### Advertencias (indicadores)

El modelo devuelve avisos cuando hay una limitación o una condición que el
usuario debe conocer. Se guardan en la columna `advertencias` y se devuelven en
las respuestas:

| Situación | Advertencia |
|---|---|
| El techo no alcanza | `El área disponible (X m²) permite instalar como máximo N paneles, por lo que se instalarán N de los M necesarios para cubrir todo el consumo.` |
| El techo no permite ni un panel | `El área disponible (X m²) no alcanza para instalar un panel solar: cada panel ocupa 1.7 m².` |
| La producción no cubre el consumo | `La producción anual estimada (X kWh) no cubre todo el consumo anual (Y kWh): la cobertura estimada es del Z %.` |
| Se incluyen baterías | `Se incluye un banco de baterías estimado en 18000 MXN: el retorno de inversión aumenta frente a una instalación sin baterías.` |
| Baterías sin paneles | `No se incluye banco de baterías porque el área disponible no permite instalar paneles que generen energía para almacenar.` |

> Nota: las baterías **no aumentan el ahorro estimado**, porque el modelo ya
> limita el ahorro al consumo real (`min(producción, consumo)`). Lo que hacen
> es aumentar la inversión y, por tanto, alargar el retorno de la inversión.

---

## Códigos de respuesta

| Código | Cuerpo | Descripción |
|---|---|---|
| 200 | `{ "mensaje": "...", ... }` | Consulta, recálculo o eliminación correctos |
| 201 | `{ "mensaje": "...", "simulacion": {...} }` | Simulación creada correctamente |
| 400 | `{ "mensaje": "..." }` | Datos o parámetros inválidos (falta un campo obligatorio, tipo incorrecto, `tipoTarifa` desconocida, `limite` mayor a 100, id no numérico, municipio inexistente, recálculo sin campos) |
| 404 | `{ "mensaje": "La simulación solicitada no existe" }` | No hay ninguna simulación con ese `id` |
| 500 | `{ "mensaje": "..." }` | Error interno (por ejemplo, MySQL inaccesible). El detalle real solo se registra en el servidor con `console.error` |

---

## Arquitectura (capas y archivos)

```
Petición HTTP
   │
   ├─▶ presentation/routes.ts                    AppRoutes            → monta /api/simulaciones
   │      └─▶ presentation/simulaciones/rutas.ts RutasSimulaciones   → declara método + ruta
   │             └─▶ presentation/simulaciones/controlador.ts
   │                    ControladorSimulaciones  → valida el DTO, invoca el puerto,
   │                                            │ mapea el resultado a la respuesta
   │                                            ▼
   │                  domain/repositorios/repositorio-simulaciones.ts
   │                    RepositorioSimulaciones (puerto, abstracto)
   │                                            ▼
   │                  infrastructure/repositorios/repositorio-simulaciones.impl.ts
   │                    RepositorioSimulacionesImpl → aplica el modelo de cálculo
   │                                            ▼
   │                  domain/servicios/calculadora-simulacion-solar.ts
   │                    CalculadoraSimulacionSolar → reglas del modelo solar
   │                                            ▼
   │                  domain/fuentes-datos/fuente-datos-simulaciones.ts
   │                    FuenteDatosSimulaciones  (puerto, abstracto)
   │                                            ▼
   │                  infrastructure/fuentes-datos/fuente-datos-simulaciones.impl.ts
   │                    FuenteDatosSimulacionesImpl → ejecuta el SQL sobre MySQL
   │                                            ▼
   │                  config/database.ts         pool de conexiones MySQL
   │
   └─▶ Respuesta JSON  ◀── controlador mapea entidad/error → { ... } o { "mensaje": "..." }
```

| Capa | Archivo | Símbolo |
|---|---|---|
| Dominio (entidad) | `node/src/domain/entidades/simulacion.entidad.ts` | `Simulacion` |
| Dominio (entidad) | `node/src/domain/entidades/historial-simulaciones.entidad.ts` | `HistorialSimulaciones` |
| Dominio (entidad) | `node/src/domain/entidades/resultado-calculo-solar.entidad.ts` | `ResultadoCalculoSolar` |
| Dominio (entidad) | `node/src/domain/entidades/tipo-tarifa.ts` | `TipoTarifa` |
| Dominio (servicio) | `node/src/domain/servicios/calculadora-simulacion-solar.ts` | `CalculadoraSimulacionSolar` |
| Dominio (DTO) | `node/src/domain/entidades/dtos/simulaciones/crear-simulacion.dto.ts` | `DtoCrearSimulacion` |
| Dominio (DTO) | `node/src/domain/entidades/dtos/simulaciones/recalcular-simulacion.dto.ts` | `DtoRecalcularSimulacion` |
| Dominio (DTO) | `node/src/domain/entidades/dtos/simulaciones/consultar-simulaciones.dto.ts` | `DtoConsultarSimulaciones` |
| Dominio (DTO) | `node/src/domain/entidades/dtos/simulaciones/id-simulacion.dto.ts` | `DtoIdSimulacion` |
| Dominio (DTO) | `node/src/domain/entidades/dtos/simulaciones/validacion-simulacion.ts` | `ValidacionSimulacion` |
| Dominio (puerto repositorio) | `node/src/domain/repositorios/repositorio-simulaciones.ts` | `RepositorioSimulaciones` |
| Dominio (puerto fuente de datos) | `node/src/domain/fuentes-datos/fuente-datos-simulaciones.ts` | `FuenteDatosSimulaciones` |
| Dominio (error) | `node/src/domain/fuentes-datos/errores/error-personalizado.ts` | `ErrorPersonalizado` |
| Infraestructura (fuente de datos) | `node/src/infrastructure/fuentes-datos/fuente-datos-simulaciones.impl.ts` | `FuenteDatosSimulacionesImpl` |
| Infraestructura (repositorio) | `node/src/infrastructure/repositorios/repositorio-simulaciones.impl.ts` | `RepositorioSimulacionesImpl` |
| Infraestructura (script SQL) | `node/src/infrastructure/base-datos/script_simulaciones.sql` | — |
| Presentación (controlador) | `node/src/presentation/simulaciones/controlador.ts` | `ControladorSimulaciones` |
| Presentación (rutas del módulo) | `node/src/presentation/simulaciones/rutas.ts` | `RutasSimulaciones` |
| Presentación (rutas raíz) | `node/src/presentation/routes.ts` | `AppRoutes` (monta `/api/simulaciones`) |

El SQL vive únicamente en `infrastructure/`. Todas las consultas usan
marcadores de posición (`?`) sobre el pool de `config/database.ts`.

---

## Base de datos

- **Base de datos:** `gemeloDigital`.
- **Tabla:** `simulaciones`.
- **Script de creación:** `node/src/infrastructure/base-datos/script_simulaciones.sql`.
  Hay que ejecutarlo una vez antes de usar el módulo.

```sql
CREATE TABLE IF NOT EXISTS simulaciones (
    id                      INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    municipio_id            INT               NOT NULL,
    consumo_kwh             DECIMAL(10,2)     NOT NULL,
    tarifa_cfe              DECIMAL(10,4)     NOT NULL,
    area_disponible_m2      DECIMAL(10,2)     NULL,
    tipo_tarifa             VARCHAR(10)       NOT NULL DEFAULT 'PDBT',
    incluye_baterias        BOOLEAN           NOT NULL DEFAULT FALSE,
    paneles_necesarios      SMALLINT UNSIGNED NOT NULL,
    produccion_anual        DECIMAL(12,2)     NOT NULL,
    ahorro_estimado         DECIMAL(12,2)     NOT NULL,
    costo_inversion_total   DECIMAL(12,2)     NOT NULL,
    retorno_inversion_anios DECIMAL(8,2)      NOT NULL,
    advertencias            TEXT              NULL,
    fecha_creacion          DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion     DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_simulaciones_municipio (municipio_id),
    KEY idx_simulaciones_fecha (fecha_creacion),
    CONSTRAINT fk_simulaciones_municipio
        FOREIGN KEY (municipio_id) REFERENCES municipios (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

Notas de diseño:

- `municipio_id` es **INT con signo** para ser compatible con la clave foránea
  a `municipios.id` (también con signo). Si se declarara `UNSIGNED`, MySQL
  rechazaría la llave foránea.
- La llave foránea con `ON DELETE RESTRICT` impide borrar un municipio que
  tenga simulaciones asociadas.
- Los `DECIMAL` los entrega MySQL como texto; la capa de infraestructura los
  convierte a número al mapear la entidad.
- `advertencias` guarda un arreglo JSON de textos.
- `incluye_baterias` es `BOOLEAN` (`TINYINT(1)`) con valor por defecto `FALSE`.

### Ejecutar el script

```bash
mysql -u root -p gemeloDigital < node/src/infrastructure/base-datos/script_simulaciones.sql
```

La tabla `municipios` debe existir previamente (rama `ObtenerMunicipios`,
script `script_municipios.sql`).

---

## Prueba rápida

Con el servidor levantado (`npm run dev` dentro de `node/`):

```bash
# 1. Crear una simulación con parámetros básicos
curl -X POST http://localhost:3100/api/simulaciones \
  -H "Content-Type: application/json" \
  -d '{"municipioId":25,"consumoKwh":3600,"tarifaCfe":6.85}'

# 2. Crear una simulación con parámetros avanzados
curl -X POST http://localhost:3100/api/simulaciones \
  -H "Content-Type: application/json" \
  -d '{"municipioId":25,"consumoKwh":6000,"tarifaCfe":7.10,"areaDisponibleM2":12,"tipoTarifa":"DAC","incluyeBaterias":true}'

# 3. Consultar una simulación por id
curl http://localhost:3100/api/simulaciones/1

# 4. Consultar el historial (con filtro y paginación)
curl "http://localhost:3100/api/simulaciones?municipioId=25&pagina=1&limite=10"

# 5. Recalcular una simulación
curl -X POST http://localhost:3100/api/simulaciones/1/recalcular \
  -H "Content-Type: application/json" \
  -d '{"consumoKwh":5000,"areaDisponibleM2":4}'

# 6. Eliminar una simulación
curl -X DELETE http://localhost:3100/api/simulaciones/1
```

(El puerto depende de la variable `PORT` de `node/src/.env`; por defecto 3100.)

---

## Notas y trabajo futuro

- **Las constantes de mercado son supuestos del modelo**, no precios oficiales:
  conviene ajustarlas con cotizaciones reales del módulo y del banco de
  baterías antes de presentar resultados como definitivos.
- **`usuario_id`**: la tabla todavía no relaciona las simulaciones con un
  usuario, porque el módulo de autenticación todavía no persiste en MySQL.
  Cuando exista la tabla `usuarios`, se puede agregar la columna y su llave
  foránea, y así cada simulación será del usuario que la creó.
- **El catálogo de municipios** viene de la rama `ObtenerMunicipios` (217
  municipios de Puebla con su macrorregión). Conviene exponer el municipio en la
  respuesta de la simulación (por ejemplo, `municipio: { id, nombre, region }`)
  para que el cliente no tenga que consultar `/api/ubicaciones/municipios`.
- **Precios de la CFE por tipo de tarifa**: el modelo usa un factor de ajuste
  por tipo de tarifa. En una versión posterior se podrían usar las tarifas y
  horarios oficiales por municipio (bandas horarias punta/valle) en lugar de
  factores.
- **Optimización del modelo**: el cálculo depende solo de los datos guardados,
  por lo que se puede recalcular en lote si cambian las constantes de mercado.
- **Historial sin paginación**: el listado actual pagina en memoria desde la
  base de datos con `LIMIT ? OFFSET ?`. Para historiales muy grandes conviene
  paginar por cursor (`fecha_creacion`, `id`) en lugar de por número de página.
- **Seguridad**: los endpoints todavía no tienen autenticación, CORS, limitador
  de peticiones ni manejador global de errores; quedan pendientes del
  `AGENTS.md`.
