import express = require('express');
import swaggerUi = require('swagger-ui-express');

/**
 * Documento OpenAPI de la API del Gemelo Digital.
 *
 * Describe los endpoints de autenticación, incentivos, pronóstico
 * meteorológico, analítica, tarifas eléctricas, facturación, riesgo DAC,
 * financiamiento, catálogo de paneles y producción solar.
 */
const swaggerDocumento = {
    openapi: '3.0.0',
    info: {
        title: 'API REST del Gemelo Digital',
        description: 'API del Gemelo Digital: incentivos para la generación distribuida, pronóstico meteorológico y analítica por municipio.',
        version: '1.0.0',
    },
    servers: [
        {
            url: '/',
            description: 'Servidor local',
        },
    ],
    tags: [
        {
            name: 'Autenticacion',
            description: 'Autenticación y registro de usuarios.',
        },
        {
            name: 'Incentivos',
            description: 'Incentivos y programas de apoyo para la generación distribuida y la instalación de sistemas solares.',
        },
        {
            name: 'Clima',
            description: 'Pronóstico meteorológico para la estimación de producción solar.',
        },
        {
            name: 'Analítica',
            description: 'Estadísticas agregadas del uso y potencial de la energía solar.',
        },
        {
            name: 'Electricidad',
            description: 'Tarifas de la CFE, estimación de factura y evaluación de riesgo DAC.',
        },
        {
            name: 'Financiero',
            description: 'Estimación financiera de la inversión en sistemas solares.',
        },
        {
            name: 'Paneles',
            description: 'Catálogo de paneles solares.',
        },
        {
            name: 'Solar',
            description: 'Radiación solar y producción estimada.',
        },
    ],
    paths: {
        '/api/Auth/login': {
            post: {
                tags: ['Autenticacion'],
                summary: 'Iniciar sesión',
                description: 'Inicia la sesión de un usuario del Gemelo Digital.',
                operationId: 'login',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginRequest' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Inicio de sesión exitoso',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginResponse' },
                            },
                        },
                    },
                    '400': {
                        description: 'Credenciales inválidas o petición incorrecta',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/Auth/register': {
            post: {
                tags: ['Autenticacion'],
                summary: 'Registrar usuario',
                description: 'Registra un nuevo usuario en el Gemelo Digital.',
                operationId: 'register',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegistroRequest' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Usuario registrado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UserResponse' },
                            },
                        },
                    },
                    '400': {
                        description: 'Datos de registro inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/weather/forecast': {
            get: {
                tags: ['Clima'],
                summary: 'Consultar el pronóstico meteorológico',
                description: 'Obtiene el pronóstico meteorológico para una ubicación y lo normaliza al formato de la API.',
                operationId: 'consultarPronosticoMeteorologico',
                parameters: [
                    {
                        name: 'latitude',
                        in: 'query',
                        required: true,
                        schema: { type: 'number', minimum: -90, maximum: 90 },
                        description: 'Latitud geográfica.',
                    },
                    {
                        name: 'longitude',
                        in: 'query',
                        required: true,
                        schema: { type: 'number', minimum: -180, maximum: 180 },
                        description: 'Longitud geográfica.',
                    },
                    {
                        name: 'days',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', minimum: 1, maximum: 16, default: 7 },
                        description: 'Cantidad de días solicitados (máximo admitido por el proveedor).',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Pronóstico meteorológico obtenido correctamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mensaje: { type: 'string' },
                                        pronostico: { $ref: '#/components/schemas/Pronostico' },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Parámetros de consulta inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/analytics/municipalities': {
            get: {
                tags: ['Analítica'],
                summary: 'Obtener estadísticas agregadas por municipio',
                description: 'Obtiene estadísticas agregadas del uso y potencial de la energía solar por municipio.',
                operationId: 'obtenerEstadisticasMunicipios',
                parameters: [
                    {
                        name: 'municipality',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', minimum: 1, maximum: 100000 },
                        description: 'Identificador del municipio a analizar.',
                    },
                    {
                        name: 'period',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', minimum: 1, maximum: 3650 },
                        description: 'Periodo de análisis en días.',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Estadísticas de municipios obtenidas correctamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mensaje: { type: 'string' },
                                        estadisticas: { $ref: '#/components/schemas/EstadisticasMunicipios' },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Parámetros de consulta inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/electricity/tariffs': {
            get: {
                tags: ['Electricidad'],
                summary: 'Consultar tarifas de la CFE',
                description: 'Obtiene el catálogo de tarifas eléctricas (PDBT, DAC, GDBT) disponibles para el cálculo.',
                operationId: 'listarTarifas',
                responses: {
                    '200': {
                        description: 'Tarifas obtenidas correctamente',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Tarifas' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/electricity/estimate-bill': {
            post: {
                tags: ['Electricidad'],
                summary: 'Estimar factura eléctrica',
                description: 'Calcula la factura eléctrica a partir del consumo y la tarifa aplicable.',
                operationId: 'estimarFactura',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/EstimacionFactura' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Factura estimada correctamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mensaje: { type: 'string' },
                                        factura: { $ref: '#/components/schemas/FacturaEstimada' },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Datos de estimación inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/electricity/dac-risk': {
            get: {
                tags: ['Electricidad'],
                summary: 'Evaluar riesgo DAC',
                description: 'Evalúa el riesgo de cambio a tarifa DAC (DAC) con una regla de demostración.',
                operationId: 'evaluarRiesgoDac',
                parameters: [
                    {
                        name: 'consumoPromedioMensualKwh',
                        in: 'query',
                        required: true,
                        schema: { type: 'number', minimum: 0 },
                        description: 'Consumo promedio mensual en kWh.',
                    },
                    {
                        name: 'tipoTarifa',
                        in: 'query',
                        required: false,
                        schema: { type: 'string', default: 'PDBT' },
                        description: 'Tipo de tarifa aplicable: PDBT, DAC o GDBT.',
                    },
                    {
                        name: 'mesesHistoricos',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', minimum: 1, maximum: 120, default: 12 },
                        description: 'Cantidad de meses históricos considerados.',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Riesgo DAC evaluado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mensaje: { type: 'string' },
                                        evaluacion: { $ref: '#/components/schemas/RiesgoDac' },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Parámetros de evaluación inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/financial/estimate': {
            post: {
                tags: ['Financiero'],
                summary: 'Estimar financiamiento solar',
                description: 'Calcula la estimación financiera de un sistema solar (VPN, TIR, ROI, recuperación).',
                operationId: 'estimarFinanciero',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Financiero' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Estimación financiera calculada',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mensaje: { type: 'string' },
                                        resultado: { $ref: '#/components/schemas/ResultadoFinanciero' },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Datos de estimación inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/incentives': {
            get: {
                tags: ['Incentivos'],
                summary: 'Consultar incentivos y programas de apoyo',
                description: 'Consulta los incentivos y programas de apoyo relacionados con la generación distribuida y la instalación de sistemas solares fotovoltaicos aplicables a hogares y PyMEs de Puebla.',
                operationId: 'consultarIncentivos',
                parameters: [
                    {
                        name: 'beneficiaryType',
                        in: 'query',
                        required: false,
                        schema: { type: 'string', enum: ['home', 'business'] },
                        description: 'Tipo de beneficiario del programa: home u business.',
                    },
                    {
                        name: 'municipality',
                        in: 'query',
                        required: false,
                        schema: { type: 'string' },
                        description: 'Municipio de interés: identificador o nombre.',
                    },
                    {
                        name: 'status',
                        in: 'query',
                        required: false,
                        schema: { type: 'string', enum: ['active', 'expired', 'upcoming', 'unverified'] },
                        description: 'Estado del programa: active, expired, upcoming o unverified.',
                    },
                    {
                        name: 'pagina',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', minimum: 1, default: 1 },
                        description: 'Página solicitada (paginación).',
                    },
                    {
                        name: 'limite',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
                        description: 'Cantidad de registros por página (máximo 100).',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Incentivos obtenidos correctamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mensaje: { type: 'string' },
                                        total: { type: 'integer' },
                                        pagina: { type: 'integer' },
                                        limite: { type: 'integer' },
                                        incentivos: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Incentivo' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Parámetros de consulta inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/incentives/eligibility': {
            get: {
                tags: ['Incentivos'],
                summary: 'Evaluar la elegibilidad de incentivos',
                description: 'Evalúa qué incentivos registrados podrían corresponder a un hogar o una PyME según sus características.',
                operationId: 'evaluarElegibilidadIncentivos',
                parameters: [
                    {
                        name: 'beneficiaryType',
                        in: 'query',
                        required: true,
                        schema: { type: 'string', enum: ['home', 'business'] },
                        description: 'Tipo de beneficiario: home u business.',
                    },
                    {
                        name: 'municipality',
                        in: 'query',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Municipio de Puebla del solicitante.',
                    },
                    {
                        name: 'systemCapacityKw',
                        in: 'query',
                        required: false,
                        schema: { type: 'number', minimum: 0 },
                        description: 'Capacidad instalada o proyectada del sistema solar en kW.',
                    },
                    {
                        name: 'installationType',
                        in: 'query',
                        required: false,
                        schema: { type: 'string' },
                        description: 'Tipo de instalación, cuando corresponda.',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Evaluación de elegibilidad solicitada correctamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mensaje: { type: 'string' },
                                        datos: { type: 'object' },
                                        fechaEvaluacion: { type: 'string', format: 'date-time' },
                                        evaluaciones: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/EvaluacionIncentivo' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Parámetros de consulta inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/panels': {
            get: {
                tags: ['Paneles'],
                summary: 'Consultar catálogo de paneles solares',
                description: 'Obtiene el catálogo de paneles solares con sus filtros.',
                operationId: 'listarPaneles',
                parameters: [
                    {
                        name: 'fabricante',
                        in: 'query',
                        required: false,
                        schema: { type: 'string' },
                        description: 'Fabricante del panel a buscar.',
                    },
                    {
                        name: 'potenciaMinimaWatts',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', minimum: 1 },
                        description: 'Potencia mínima en watts.',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Paneles obtenidos correctamente',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Paneles' },
                            },
                        },
                    },
                    '400': {
                        description: 'Parámetros de consulta inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/solar/radiation': {
            get: {
                tags: ['Solar'],
                summary: 'Consultar radiación solar',
                description: 'Obtiene la radiación solar para una ubicación.',
                operationId: 'obtenerRadiacionSolar',
                parameters: [
                    {
                        name: 'latitude',
                        in: 'query',
                        required: true,
                        schema: { type: 'number', minimum: -90, maximum: 90 },
                        description: 'Latitud geográfica.',
                    },
                    {
                        name: 'longitude',
                        in: 'query',
                        required: true,
                        schema: { type: 'number', minimum: -180, maximum: 180 },
                        description: 'Longitud geográfica.',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Radiación solar obtenida correctamente',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Solar' },
                            },
                        },
                    },
                    '400': {
                        description: 'Parámetros de consulta inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/solar/production': {
            get: {
                tags: ['Solar'],
                summary: 'Consultar producción solar',
                description: 'Calcula la producción solar estimada a partir de la radiación.',
                operationId: 'calcularProduccionSolar',
                parameters: [
                    {
                        name: 'latitude',
                        in: 'query',
                        required: true,
                        schema: { type: 'number', minimum: -90, maximum: 90 },
                        description: 'Latitud geográfica.',
                    },
                    {
                        name: 'longitude',
                        in: 'query',
                        required: true,
                        schema: { type: 'number', minimum: -180, maximum: 180 },
                        description: 'Longitud geográfica.',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Producción solar calculada correctamente',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Solar' },
                            },
                        },
                    },
                    '400': {
                        description: 'Parámetros de cálculo inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    '500': {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    mensaje: { type: 'string', description: 'Descripción del error en español.' },
                },
            },
            LoginRequest: {
                type: 'object',
                properties: {
                    usuario: { type: 'string', description: 'Correo electrónico o identificador del usuario.' },
                    contrasenia: { type: 'string', description: 'Contraseña del usuario.' },
                },
            },
            LoginResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', description: 'Mensaje de respuesta.' },
                },
            },
            RegistroRequest: {
                type: 'object',
                properties: {
                    nombre: { type: 'string' },
                    correoElectronico: { type: 'string' },
                    contrasenia: { type: 'string' },
                },
            },
            UserResponse: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    nombre: { type: 'string' },
                    correoElectronico: { type: 'string' },
                    imagen: { type: 'string', nullable: true },
                    roles: { type: 'array', items: { type: 'string' } },
                },
            },
            Incentivo: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    programa: { type: 'string' },
                    nombre: { type: 'string' },
                    descripcion: { type: 'string' },
                    beneficiarios: { type: 'array', items: { type: 'string' } },
                    municipioId: { type: 'integer', nullable: true },
                    requisitos: { type: 'array', items: { $ref: '#/components/schemas/Requisito' } },
                    beneficios: { type: 'array', items: { $ref: '#/components/schemas/Beneficio' } },
                    vigenciaDesde: { type: 'string', format: 'date', nullable: true },
                    vigenciaHasta: { type: 'string', format: 'date', nullable: true },
                    organismoResponsable: { type: 'string', nullable: true },
                    fuenteOficial: { type: 'string', nullable: true },
                    verificado: { type: 'boolean' },
                    estado: { type: 'string', enum: ['active', 'expired', 'upcoming', 'unverified'] },
                },
            },
            Requisito: {
                type: 'object',
                properties: {
                    campo: { type: 'string' },
                    descripcion: { type: 'string' },
                    verificado: { type: 'boolean' },
                    requerido: { type: 'boolean' },
                    valor: { type: 'number', nullable: true },
                },
            },
            Beneficio: {
                type: 'object',
                properties: {
                    tipo: { type: 'string' },
                    monto: { type: 'number', nullable: true },
                    porcentaje: { type: 'number', nullable: true },
                    moneda: { type: 'string' },
                },
            },
            EvaluacionIncentivo: {
                type: 'object',
                properties: {
                    incentivo: { $ref: '#/components/schemas/Incentivo' },
                    estado: { type: 'string', enum: ['eligible', 'potentially_eligible', 'ineligible', 'insufficient_data'] },
                    requisitosCumplidos: { type: 'array', items: { $ref: '#/components/schemas/Requisito' } },
                    requisitosPendientes: { type: 'array', items: { $ref: '#/components/schemas/Requisito' } },
                    datosFaltantes: { type: 'array', items: { type: 'string' } },
                    explicacion: { type: 'string' },
                },
            },
            Pronostico: {
                type: 'object',
                properties: {
                    proveedor: { type: 'string' },
                    latitud: { type: 'number' },
                    longitud: { type: 'number' },
                    dias: { type: 'integer' },
                    zonaHoraria: { type: 'string' },
                    fechaConsulta: { type: 'string', format: 'date-time' },
                    registros: { type: 'array', items: { $ref: '#/components/schemas/RegistroMeteorologico' } },
                },
            },
            RegistroMeteorologico: {
                type: 'object',
                properties: {
                    fecha: { type: 'string', format: 'date-time' },
                    temperatura: { type: 'number', nullable: true },
                    nubosidad: { type: 'number', nullable: true },
                    precipitacion: { type: 'number', nullable: true },
                    radiacionSolar: { type: 'number', nullable: true },
                },
            },
            EstadisticasMunicipios: {
                type: 'object',
                properties: {
                    municipioId: { type: 'integer', nullable: true },
                    simulaciones: { type: 'integer' },
                    instalacionesRegistradas: { type: 'integer', nullable: true },
                    consumoElectrico: { type: 'object', properties: { mensual: { type: 'number' }, anual: { type: 'number' } } },
                    produccionSolar: { type: 'object', properties: { mensual: { type: 'number' }, anual: { type: 'number' } } },
                    capacidadFotovoltaica: { type: 'object', properties: { recomendada: { type: 'number' }, instalada: { type: 'number', nullable: true } } },
                    ahorroEconomico: { type: 'number' },
                    emisionesCarbono: { type: 'object', properties: { kg: { type: 'number' }, toneladas: { type: 'number' } } },
                    simulacionesPorTipoBeneficiario: { type: 'array', items: { type: 'object', properties: { beneficiario: { type: 'string' }, total: { type: 'integer' } } } },
                    fechaActualizacion: { type: 'string', format: 'date-time' },
                },
            },
            Tarifas: {
                type: 'object',
                properties: {
                    mensaje: { type: 'string' },
                    esDemostracion: { type: 'boolean' },
                    advertencia: { type: 'string', nullable: true },
                    tarifas: { type: 'array', items: { type: 'object' } },
                },
            },
            EstimacionFactura: {
                type: 'object',
                properties: {
                    tipoTarifa: { type: 'string' },
                    consumoKwh: { type: 'number' },
                    periodo: { type: 'string' },
                },
            },
            FacturaEstimada: {
                type: 'object',
                properties: {
                    mensaje: { type: 'string' },
                    factura: { type: 'object', properties: { moneda: { type: 'string' }, periodo: { type: 'string' }, totalEstimado: { type: 'number' }, esDemostracion: { type: 'boolean' } } },
                },
            },
            RiesgoDac: {
                type: 'object',
                properties: {
                    nivelRiesgo: { type: 'string' },
                    tipoTarifa: { type: 'string' },
                    puedeDeterminarse: { type: 'boolean' },
                    motivo: { type: 'string' },
                    consumoPromedioMensualKwh: { type: 'number' },
                    mesesHistoricos: { type: 'integer' },
                    umbralMensualKwh: { type: 'number' },
                    indiceSobreUmbral: { type: 'number' },
                    esDemostracion: { type: 'boolean' },
                    determinacionOficial: { type: 'boolean' },
                    advertencias: { type: 'array', items: { type: 'string' } },
                },
            },
            Financiero: {
                type: 'object',
                properties: {
                    inversionInicial: { type: 'number' },
                    ahorroAnual: { type: 'number' },
                    mantenimientoAnual: { type: 'number' },
                    horizonteAnios: { type: 'integer' },
                    tasaDescuento: { type: 'number' },
                },
            },
            ResultadoFinanciero: {
                type: 'object',
                properties: {
                    inversionInicial: { type: 'number' },
                    ahorroAnual: { type: 'number' },
                    mantenimientoAnual: { type: 'number' },
                    flujoNetoAnual: { type: 'number' },
                    horizonteAnios: { type: 'integer' },
                    tasaDescuento: { type: 'number' },
                    moneda: { type: 'string' },
                    incluyeIva: { type: 'boolean' },
                    convencionFlujos: { type: 'string' },
                    flujosAnuales: { type: 'array', items: { type: 'object' } },
                    recuperacionAnios: { type: 'number', nullable: true },
                    roiPorcentaje: { type: 'number' },
                    vpn: { type: 'number' },
                    tirPorcentaje: { type: 'number', nullable: true },
                    advertencias: { type: 'array', items: { type: 'string' } },
                },
            },
            Paneles: {
                type: 'object',
                properties: {
                    mensaje: { type: 'string' },
                    esDemostracion: { type: 'boolean' },
                    advertencia: { type: 'string', nullable: true },
                    paneles: { type: 'array', items: { type: 'object' } },
                },
            },
            Solar: {
                type: 'object',
                properties: {
                    mensaje: { type: 'string' },
                    resultado: { type: 'object' },
                },
            },
        },
    },
};

class Swagger {
    public readonly documento = swaggerDocumento;

    montar(en: express.Application): void
    {
        en.use('/api-docs', swaggerUi.serve, swaggerUi.setup(this.documento));
    }
}

export = Swagger;
