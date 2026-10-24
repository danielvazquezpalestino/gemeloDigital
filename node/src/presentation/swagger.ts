import express = require('express');
import swaggerUi = require('swagger-ui-express');

/**
 * Documento OpenAPI de la API del Gemelo Digital.
 *
 * Describe los endpoints de incentivos, pronóstico meteorológico y
 * analítica por municipio que expone la API REST.
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
    ],
    paths: {
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
                                        incentivos: { type: 'array', items: { $ref: '#/components/schemas/Incentivo' } },
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
                                        evaluaciones: { type: 'array', items: { $ref: '#/components/schemas/EvaluacionIncentivo' } },
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
        '/api/v1/weather/forecast': {
            get: {
                tags: ['Clima'],
                summary: 'Consultar el pronóstico meteorológico',
                description: 'Obtiene el pronóstico meteorológico para una ubicación de Puebla y lo normaliza al formato de la API.',
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
    },
    components: {
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    mensaje: { type: 'string', description: 'Descripción del error en español.' },
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
