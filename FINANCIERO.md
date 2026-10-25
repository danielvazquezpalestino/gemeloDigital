# Módulo Financiero — Gemelo Digital

## 1. Resumen del módulo

El módulo financiero estima la **viabilidad económica de una instalación solar**
a partir de la inversión inicial, el ahorro anual esperado y una serie de
supuestos opcionales (tasa de descuento, horizonte de proyección, inflación
energética y mantenimiento).

A diferencia del módulo de simulaciones solares, **este módulo es un cálculo
puro**:

- No utiliza MySQL.
- No crea ni modifica registros.
- No tiene fuente de datos ni consultas SQL.
- El resultado se calcula en memoria y se devuelve directamente al cliente.

El cálculo vive en el dominio (`CalculadoraFinanciera`); el repositorio solo
actúa como caso de uso que delega en la calculadora, y el controlador se limita
a validar el DTO y construir la respuesta HTTP.

```
POST /api/financiero/estimacion
   │
   ├─▶ presentation/routes.ts                      AppRoutes
   │      └─▶ presentation/financiero/rutas.ts     RutasFinanciero
   │             └─▶ presentation/financiero/controlador.ts
   │                    ControladorFinanciero.estimar
   │                          ▼
   │                  domain/repositories/repositorio-financiero.ts
   │                    RepositorioFinanciero              (puerto, abstracto)
   │                          ▼
   │                  infrastructure/repositories/repositorio-financiero.impl.ts
   │                    RepositorioFinancieroImpl
   │                          ▼
   │                  domain/servicios/calculadora-financiera.ts
   │                    CalculadoraFinanciera               (VPN, TIR, ROI y payback)
   │
   └─▶ 200 { "mensaje": "...", "estimacion": { ... } }
```

### Archivos del módulo

| Capa | Archivo | Símbolo |
|---|---|---|
| Dominio (entidad) | `node/src/domain/entities/estimacion-financiera.entidad.ts` | `EstimacionFinanciera` |
| Dominio (entidad) | `node/src/domain/entities/flujo-caja-anual.entidad.ts` | `FlujoCajaAnual` |
| Dominio (DTO) | `node/src/domain/entities/dtos/financiero/estimacion-financiera.dto.ts` | `DtoEstimacionFinanciera` |
| Dominio (validación) | `node/src/domain/entities/dtos/financiero/validacion-financiera.ts` | `ValidacionFinanciera` |
| Dominio (servicio) | `node/src/domain/servicios/calculadora-financiera.ts` | `CalculadoraFinanciera` |
| Dominio (puerto repositorio) | `node/src/domain/repositories/repositorio-financiero.ts` | `RepositorioFinanciero` |
| Infraestructura (repositorio) | `node/src/infrastructure/repositories/repositorio-financiero.impl.ts` | `RepositorioFinancieroImpl` |
| Presentación (controlador) | `node/src/presentation/financiero/controlador.ts` | `ControladorFinanciero` |
| Presentación (rutas del módulo) | `node/src/presentation/financiero/rutas.ts` | `RutasFinanciero` |
| Presentación (rutas raíz) | `node/src/presentation/routes.ts` | `AppRoutes` (monta `/api/financiero`) |

No existe `domain/datasources` para este módulo porque no hay persistencia que
abstraer.

## 2. Endpoint

| Método | Ruta | Controlador | Método del controlador | Estado |
|---|---|---|---|---|
| POST | `/api/financiero/estimacion` | `ControladorFinanciero` | `estimar` | Implementado |

### Autenticación

No requerida.

## 3. Cuerpo de la petición (DTO)

El cuerpo debe ser un objeto JSON. Los campos monetarios se expresan en pesos y
las tasas como fracción decimal (`0.10` equivale a 10 %).

| Campo | Tipo | Obligatorio | Restricciones | Valor por defecto | Descripción |
|---|---|---|---|---|---|
| `inversionInicial` | número | Sí | > 0 y ≤ 1 000 000 000 000 | — | Costo total inicial de la instalación |
| `ahorroAnualInicial` | número | Sí | > 0 y ≤ 1 000 000 000 000 | — | Ahorro bruto estimado durante el primer año |
| `tasaDescuento` | número | No | ≥ 0 y < 1 | `0.10` | Tasa usada para descontar los flujos futuros |
| `aniosProyeccion` | número | No | Entero entre 1 y 50 | `25` | Horizonte de evaluación en años |
| `inflacionEnergiaAnual` | número | No | ≥ 0 y < 1 | `0` | Incremento anual esperado del ahorro energético |
| `costoMantenimientoAnual` | número | No | ≥ 0 y ≤ 1 000 000 000 000 | `0` | Costo anual de mantenimiento, constante durante la proyección |

Notas:

- Los campos opcionales aceptan `null` o ausencia; en ambos casos se aplica el
  valor por defecto.
- Los campos obligatorios no aceptan `null`.
- No se aceptan números enviados como texto.

### Ejemplo mínimo

```json
{
    "inversionInicial": 100000,
    "ahorroAnualInicial": 25000
}
```

Con este cuerpo se usan `tasaDescuento = 0.10`, `aniosProyeccion = 25`,
`inflacionEnergiaAnual = 0` y `costoMantenimientoAnual = 0`.

### Ejemplo completo

```json
{
    "inversionInicial": 100000,
    "ahorroAnualInicial": 25000,
    "tasaDescuento": 0.10,
    "aniosProyeccion": 5,
    "inflacionEnergiaAnual": 0.03,
    "costoMantenimientoAnual": 1500
}
```

## 4. Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Estimación financiera calculada correctamente",
    "estimacion": {
        "inversionInicial": 100000,
        "ahorroAnual": 25000,
        "vpn": -5621.18,
        "tir": 0.0782,
        "roi": 25.23,
        "periodoRecuperacionAnios": 4.05,
        "flujoCajaProyectado": [
            {
                "anio": 1,
                "ahorro": 25000,
                "mantenimiento": 1500,
                "flujoNeto": 23500,
                "flujoDescontado": 21363.64,
                "flujoAcumulado": -76500
            },
            {
                "anio": 2,
                "ahorro": 25750,
                "mantenimiento": 1500,
                "flujoNeto": 24250,
                "flujoDescontado": 20041.32,
                "flujoAcumulado": -52250
            },
            {
                "anio": 3,
                "ahorro": 26522.5,
                "mantenimiento": 1500,
                "flujoNeto": 25022.5,
                "flujoDescontado": 18799.77,
                "flujoAcumulado": -27227.5
            },
            {
                "anio": 4,
                "ahorro": 27318.18,
                "mantenimiento": 1500,
                "flujoNeto": 25818.18,
                "flujoDescontado": 17634.16,
                "flujoAcumulado": -1409.33
            },
            {
                "anio": 5,
                "ahorro": 28137.72,
                "mantenimiento": 1500,
                "flujoNeto": 26637.72,
                "flujoDescontado": 16539.93,
                "flujoAcumulado": 25228.4
            }
        ]
    }
}
```

### Indicadores de la respuesta

| Campo | Tipo | Descripción |
|---|---|---|
| `inversionInicial` | número | Inversión inicial confirmada por el servidor |
| `ahorroAnual` | número | Ahorro bruto del primer año, sin restar mantenimiento |
| `vpn` | número | Valor Presente Neto: suma de los flujos netos descontados menos la inversión inicial |
| `tir` | número o `null` | Tasa Interna de Retorno expresada como decimal (`0.0782` = 7.82 %). Es `null` si no existe una raíz real en el horizonte proyectado |
| `roi` | número | Retorno de Inversión expresado como porcentaje (`25.23` = 25.23 %) |
| `periodoRecuperacionAnios` | número o `null` | Payback exacto en años, con fracción decimal. Es `null` si la inversión no se recupera dentro del horizonte |
| `flujoCajaProyectado` | arreglo | Flujos anuales desde el año 1 hasta `aniosProyeccion` |

### Flujo de caja por año

| Campo | Tipo | Descripción |
|---|---|---|
| `anio` | número | Año de la proyección, desde 1 hasta `aniosProyeccion` |
| `ahorro` | número | Ahorro bruto del año, ya ajustado por inflación energética |
| `mantenimiento` | número | Costo de mantenimiento del año |
| `flujoNeto` | número | `ahorro - mantenimiento` |
| `flujoDescontado` | número | `flujoNeto / (1 + tasaDescuento)^anio` |
| `flujoAcumulado` | número | Suma acumulada de los flujos netos. En el año 1 parte de `-inversionInicial` |

### Fórmulas aplicadas

El ahorro del año `t` se calcula con:

```
ahorro(t) = ahorroAnualInicial * (1 + inflacionEnergiaAnual)^(t - 1)
flujoNeto(t) = ahorro(t) - costoMantenimientoAnual
flujoDescontado(t) = flujoNeto(t) / (1 + tasaDescuento)^t
flujoAcumulado(t) = -inversionInicial + Σ flujoNeto(1..t)
```

Los indicadores se obtienen así:

```
VPN = -inversionInicial + Σ flujoDescontado(1..N)
TIR = tasa que hace VPN = 0, resuelta por bisección
ROI = ((Σ flujoNeto(1..N) - inversionInicial) / inversionInicial) * 100
Payback = año anterior a la recuperación + (flujo acumulado pendiente / flujo neto del año)
```

Consideraciones:

- El mantenimiento se mantiene constante; no se infla.
- La inflación energética se aplica a partir del segundo año; el año 1 usa el
  `ahorroAnualInicial` sin incremento.
- El payback es simple, no descontado: usa los flujos netos acumulados.
- Los importes se redondean a dos decimales, la TIR a cuatro decimales y el ROI
  y el payback a dos decimales.
- En el ejemplo, el VPN es negativo porque la TIR (7.82 %) es menor que la tasa
  de descuento solicitada (10 %).

## 5. Códigos de error HTTP

| Código | Cuerpo | Descripción |
|---|---|---|
| 400 | `{ "mensaje": "..." }` | El cuerpo no es un objeto válido, falta un campo obligatorio, un tipo de dato es incorrecto o un valor está fuera de rango |
| 500 | `{ "mensaje": "No se pudo calcular la estimación financiera" }` | Error interno inesperado. El detalle real solo se registra en el servidor con `console.error` |

### Ejemplos de 400 Bad Request

Campo obligatorio ausente:

```json
{
    "mensaje": "El campo \"inversionInicial\" es obligatorio"
}
```

Tipo de dato incorrecto:

```json
{
    "mensaje": "El campo \"ahorroAnualInicial\" debe ser un número mayor que cero"
}
```

Tasa fuera de rango:

```json
{
    "mensaje": "El campo \"tasaDescuento\" debe ser un número mayor o igual que 0 y menor que 1"
}
```

Horizonte inválido:

```json
{
    "mensaje": "El campo \"aniosProyeccion\" debe ser un número entero entre 1 y 50"
}
```

Mantenimiento negativo:

```json
{
    "mensaje": "El campo \"costoMantenimientoAnual\" debe ser un número mayor o igual que cero"
}
```

### Ejemplo de 500 Internal Server Error

```json
{
    "mensaje": "No se pudo calcular la estimación financiera"
}
```

El cliente nunca recibe un stack trace ni el mensaje crudo de una excepción
interna.
