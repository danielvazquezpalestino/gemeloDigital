# Radiación y Producción Solar — Módulo del Gemelo Digital

## Descripción

Módulo de la API que permite **estimar la radiación solar promedio** de una
ubicación y **calcular la producción eléctrica** de una instalación
fotovoltaica a partir de su capacidad instalada.

La radiación se obtiene con un modelo local de estimación basado en el
promedio del estado de Puebla (~5.2 kWh/m²/día) y en un ajuste suave por
latitud. La producción se calcula reutilizando la lógica del dominio solar
existente (`CalculadoraSimulacionSolar`).

El módulo **no consulta MySQL**: la estimación es local y determinista para
que los endpoints respondan aunque la base de datos no esté disponible o no
exista todavía una tabla de radiación.

## Método y rutas

| Método | Ruta | Controlador | Método del controlador | Estado |
|---|---|---|---|---|
| GET | `/api/v1/solar/radiation` | `ControladorSolar` | `obtenerRadiacion` | Implementado |
| GET | `/api/v1/solar/production` | `ControladorSolar` | `calcularProduccion` | Implementado |

## Autenticación

No requerida.

---

## 1. GET /api/v1/solar/radiation — Estimar la radiación solar

Calcula la radiación solar promedio diaria para una ubicación expresada con
coordenadas o con un identificador de municipio.

### Parámetros de consulta

| Parámetro | Tipo | Obligatorio | Restricciones | Descripción |
|---|---|---|---|---|
| `latitud` | número | Condicional | Entre -90 y 90 | Latitud de la ubicación. Debe enviarse junto con `longitud` |
| `longitud` | número | Condicional | Entre -180 y 180 | Longitud de la ubicación. Debe enviarse junto con `latitud` |
| `municipioId` | número | Condicional | Entero entre 1 y 100000 | Identificador del municipio. Alternativa a las coordenadas |

Debe enviarse **el par `latitud` + `longitud`** o bien **`municipioId`**. Si se
envían las dos formas, las coordenadas tienen prioridad para el cálculo y el
`municipioId` solo se devuelve como referencia.

### Ejemplo — coordenadas

```
GET /api/v1/solar/radiation?latitud=19.04&longitud=-98.2
```

### Ejemplo — municipio

```
GET /api/v1/solar/radiation?municipioId=25
```

### Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Radiación solar estimada correctamente",
    "radiacion": {
        "latitud": 19.04,
        "longitud": -98.2,
        "municipioId": null,
        "radiacionKwhM2Dia": 5.2,
        "esEstimacion": true,
        "fuente": "ESTIMACION_COORDENADAS"
    }
}
```

### Campos de la radiación

| Campo | Tipo | Descripción |
|---|---|---|
| `latitud` | número o `null` | Latitud usada para la estimación |
| `longitud` | número o `null` | Longitud usada para la estimación |
| `municipioId` | número o `null` | Municipio enviado como referencia |
| `radiacionKwhM2Dia` | número | Radiación solar promedio en kWh/m²/día |
| `esEstimacion` | booleano | Siempre `true`: el valor es una estimación, no una medición |
| `fuente` | texto | Origen del cálculo: `ESTIMACION_COORDENADAS` o `PROMEDIO_PUEBLA` |

---

## 2. GET /api/v1/solar/production — Estimar la producción solar

Calcula la producción eléctrica mensual y anual de una instalación
fotovoltaica a partir de su capacidad instalada y de la radiación estimada.

### Parámetros de consulta

| Parámetro | Tipo | Obligatorio | Restricciones | Descripción |
|---|---|---|---|---|
| `capacidadKwp` | número | Sí | > 0 y ≤ 100000 | Capacidad instalada en kilovatios pico (kWp) |
| `latitud` | número | No | Entre -90 y 90 | Latitud de la ubicación. Debe enviarse junto con `longitud` |
| `longitud` | número | No | Entre -180 y 180 | Longitud de la ubicación. Debe enviarse junto con `latitud` |
| `municipioId` | número | No | Entero entre 1 y 100000 | Identificador del municipio |
| `eficiencia` | número | No | > 0 y ≤ 1 (por defecto `0.80`) | Rendimiento global del sistema |

Si no se envía ninguna ubicación, se usa el promedio de Puebla
(~5.2 kWh/m²/día). Si se envía solo una de las coordenadas, la petición se
rechaza con `400`.

### Ejemplo — parámetros básicos

```
GET /api/v1/solar/production?capacidadKwp=5
```

### Ejemplo — parámetros avanzados

```
GET /api/v1/solar/production?capacidadKwp=5&latitud=19.04&longitud=-98.2&eficiencia=0.75
```

### Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Producción solar estimada correctamente",
    "produccion": {
        "capacidadKwp": 5,
        "eficiencia": 0.8,
        "radiacionKwhM2Dia": 5.2,
        "produccionMensualKwh": 632.67,
        "produccionAnualKwh": 7592,
        "esEstimacion": true,
        "fuenteRadiacion": "ESTIMACION_COORDENADAS"
    }
}
```

### Campos de la producción

| Campo | Tipo | Descripción |
|---|---|---|
| `capacidadKwp` | número | Capacidad instalada declarada por el cliente |
| `eficiencia` | número | Eficiencia global aplicada al cálculo |
| `radiacionKwhM2Dia` | número | Radiación solar promedio usada en el cálculo |
| `produccionMensualKwh` | número | Producción eléctrica estimada en kWh/mes |
| `produccionAnualKwh` | número | Producción eléctrica estimada en kWh/año |
| `esEstimacion` | booleano | Siempre `true`: el resultado es una estimación |
| `fuenteRadiacion` | texto | Origen de la radiación: `ESTIMACION_COORDENADAS` o `PROMEDIO_PUEBLA` |

---

## Modelo de cálculo

El modelo vive en el dominio, en
`node/src/domain/servicios/estimador-radiacion-solar.ts` y
`node/src/domain/servicios/calculadora-simulacion-solar.ts`. Todas las
constantes están agrupadas en esas clases para que los supuestos sean
auditables y ajustables en un solo lugar.

### Constantes

| Constante | Valor | Significado |
|---|---|---|
| `RADIACION_PROMEDIO_PUEBLA_KWH_M2_DIA` | 5.2 | Radiación promedio estatal usada como base |
| `LATITUD_PROMEDIO_PUEBLA` | 19 | Latitud de referencia para el ajuste |
| `GRADIENTE_POR_GRADO_LATITUD` | 0.018 | Ajuste de radiación por grado de latitud |
| `RADIACION_MINIMA_KWH_M2_DIA` | 3.5 | Límite inferior de la estimación |
| `RADIACION_MAXIMA_KWH_M2_DIA` | 7.5 | Límite superior de la estimación |
| `DIAS_POR_ANIO` | 365 | Días usados para anualizar la producción |
| `eficiencia` por defecto | 0.80 | Rendimiento global del sistema |

### Fórmulas

```
ajuste por latitud        = (LATITUD_PROMEDIO_PUEBLA - |latitud|) * GRADIENTE_POR_GRADO_LATITUD
radiación estimada        = limitar(5.2 + ajuste, 3.5, 7.5)
producción anual          = capacidadKwp * radiación estimada * 365 * eficiencia
producción mensual        = producción anual / 12
```

Todos los resultados derivados se redondean a dos decimales.

Cuando la ubicación se expresa solo con `municipioId`, no se aplica el ajuste
por latitud y se devuelve el promedio estatal de 5.2 kWh/m²/día.

### Fuentes de estimación

| Valor de `fuente` / `fuenteRadiacion` | Situación |
|---|---|
| `ESTIMACION_COORDENADAS` | Se recibieron latitud y longitud válidas |
| `PROMEDIO_PUEBLA` | Solo se recibió `municipioId`, o producción sin ubicación |

> Los endpoints no devuelven advertencias. El indicador `esEstimacion` siempre
> es `true` porque el valor no proviene de una medición ni de una fuente
> oficial verificada.

---

## Códigos de respuesta

| Código | Cuerpo | Descripción |
|---|---|---|
| 200 | `{ "mensaje": "...", "radiacion": {...} }` | Radiación estimada correctamente |
| 200 | `{ "mensaje": "...", "produccion": {...} }` | Producción estimada correctamente |
| 400 | `{ "mensaje": "..." }` | Parámetros ausentes, mal formados o fuera de rango |
| 500 | `{ "mensaje": "..." }` | Error interno. El detalle real solo se registra en el servidor con `console.error` |

Ejemplos de errores `400`:

```json
{ "mensaje": "Debe indicar \"latitud\" y \"longitud\", o bien \"municipioId\"" }
```

```json
{ "mensaje": "Debe enviar \"latitud\" y \"longitud\" juntos, o bien \"municipioId\"" }
```

```json
{ "mensaje": "El campo \"latitud\" debe ser un número válido" }
```

```json
{ "mensaje": "El parámetro \"capacidadKwp\" es obligatorio" }
```

```json
{ "mensaje": "El campo \"capacidadKwp\" debe ser mayor que 0" }
```

```json
{ "mensaje": "El campo \"eficiencia\" no puede ser mayor que 1" }
```

---

## Arquitectura (capas y archivos)

```
GET /api/v1/solar/radiation
   │
   ├─▶ presentation/routes.ts                       AppRoutes           → monta /api/v1
   │      └─▶ presentation/rutas-v1.ts              RutasV1             → monta /solar
   │             └─▶ presentation/solar/rutas.ts    RutasSolar          → declara método + ruta
   │                    └─▶ presentation/solar/controlador.ts
   │                           ControladorSolar     → valida el DTO, invoca el puerto,
   │                                                │ mapea el resultado a la respuesta
   │                                                ▼
   │                  domain/repositories/repositorio-solar.ts
   │                    RepositorioSolar             (puerto, abstracto)
   │                                                ▼
   │                  infrastructure/repositories/repositorio-solar.impl.ts
   │                    RepositorioSolarImpl         → orquesta radiación y producción
   │                                                ▼
   │                  domain/servicios/calculadora-simulacion-solar.ts
   │                    CalculadoraSimulacionSolar   → calcula la producción
   │                                                ▼
   │                  domain/datasources/fuente-datos-solar.ts
   │                    FuenteDatosSolar             (puerto, abstracto)
   │                                                ▼
   │                  infrastructure/datasources/fuente-datos-solar.impl.ts
   │                    FuenteDatosSolarImpl         → obtiene la radiación
   │                                                ▼
   │                  domain/servicios/estimador-radiacion-solar.ts
   │                    EstimadorRadiacionSolar      → estimación local por ubicación
   │
   └─▶ Respuesta JSON  ◀── controlador mapea entidad/error → { ... } o { "mensaje": "..." }
```

| Capa | Archivo | Símbolo |
|---|---|---|
| Dominio (entidad) | `node/src/domain/entities/radiacion-solar.entidad.ts` | `RadiacionSolar` |
| Dominio (entidad) | `node/src/domain/entities/resultado-produccion-solar.entidad.ts` | `ResultadoProduccionSolar` |
| Dominio (DTO) | `node/src/domain/entities/dtos/solar/consultar-radiacion.dto.ts` | `DtoConsultarRadiacion` |
| Dominio (DTO) | `node/src/domain/entities/dtos/solar/calcular-produccion.dto.ts` | `DtoCalcularProduccion` |
| Dominio (servicio) | `node/src/domain/servicios/estimador-radiacion-solar.ts` | `EstimadorRadiacionSolar` |
| Dominio (servicio) | `node/src/domain/servicios/calculadora-simulacion-solar.ts` | `CalculadoraSimulacionSolar` |
| Dominio (puerto repositorio) | `node/src/domain/repositories/repositorio-solar.ts` | `RepositorioSolar` |
| Dominio (puerto fuente de datos) | `node/src/domain/datasources/fuente-datos-solar.ts` | `FuenteDatosSolar` |
| Infraestructura (fuente de datos) | `node/src/infrastructure/datasources/fuente-datos-solar.impl.ts` | `FuenteDatosSolarImpl` |
| Infraestructura (repositorio) | `node/src/infrastructure/repositories/repositorio-solar.impl.ts` | `RepositorioSolarImpl` |
| Presentación (controlador) | `node/src/presentation/solar/controlador.ts` | `ControladorSolar` |
| Presentación (rutas del módulo) | `node/src/presentation/solar/rutas.ts` | `RutasSolar` |
| Presentación (rutas raíz) | `node/src/presentation/rutas-v1.ts` | `RutasV1` (monta `/solar`) |

El módulo respeta la regla de dependencia: `domain` no conoce Express ni
MySQL; la composición de dependencias se hace en
`presentation/solar/rutas.ts`.

---

## Base de datos

- **No requiere MySQL.** La radiación se estima localmente y la producción se
  calcula con esa estimación.
- Los endpoints funcionan aunque no exista una tabla de radiación, aunque el
  servidor completo (`app.ts`) sigue necesitando MySQL para arrancar porque
  `Database.connect()` es una dependencia dura del punto de entrada.
- Si en el futuro se agrega una tabla de radiación, el único archivo que debe
  cambiar es
  `node/src/infrastructure/datasources/fuente-datos-solar.impl.ts`.

---

## Prueba rápida

Con el servidor levantado (`npm run dev` dentro de `node/`), y asumiendo que
MySQL está disponible para el arranque:

```bash
# 1. Radiación por coordenadas
curl "http://localhost:3100/api/v1/solar/radiation?latitud=19.04&longitud=-98.2"

# 2. Radiación por municipio
curl "http://localhost:3100/api/v1/solar/radiation?municipioId=25"

# 3. Radiación sin ubicación (debe responder 400)
curl "http://localhost:3100/api/v1/solar/radiation"

# 4. Producción básica con el promedio de Puebla
curl "http://localhost:3100/api/v1/solar/production?capacidadKwp=5"

# 5. Producción con coordenadas y eficiencia
curl "http://localhost:3100/api/v1/solar/production?capacidadKwp=5&latitud=19.04&longitud=-98.2&eficiencia=0.75"

# 6. Producción sin capacidad (debe responder 400)
curl "http://localhost:3100/api/v1/solar/production"
```

(El puerto depende de la variable `PORT` de `node/src/.env`; por defecto 3100.)

---

## Notas y trabajo futuro

- **La radiación es una estimación**, no una medición ni un dato oficial. El
  modelo usa el promedio de Puebla y un ajuste conservador por latitud.
- **Integración con MySQL**: si se cuenta con una tabla de radiación por
  municipio o por coordenadas, se puede reemplazar
  `FuenteDatosSolarImpl` sin modificar el dominio ni el controlador.
- **Fuentes externas**: en una versión posterior se podría consultar un
  servicio meteorológico o una base de datos solar verificada, manteniendo el
  mismo contrato `FuenteDatosSolar`.
- **Longitud**: actualmente la longitud se valida y se devuelve, pero no altera
  la estimación; el ajuste solo depende de la latitud.
- **Orientación e inclinación**: el modelo no considera la inclinación de los
  paneles ni la orientación del techo. La eficiencia enviada por el cliente
  puede usarse para aproximar esas pérdidas.
- **Eficiencia por tecnología**: el valor por defecto es `0.80`; conviene
  ajustarlo según el inversor, el cableado y las condiciones del sitio.
- **Seguridad**: los endpoints todavía no tienen autenticación, CORS, limitador
  de peticiones ni manejador global de errores; quedan pendientes del
  `AGENTS.md`.
- **Pruebas**: no hay pruebas automatizadas específicas para el módulo solar.
  Se recomienda cubrir la validación de coordenadas, los rangos de eficiencia
  y los cálculos de producción mensual y anual.
