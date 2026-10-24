import CalculadoraEmisionesCarbono = require('../../domain/servicios/calculadora-emisiones-carbono');
import CalculadoraSimulacionSolar = require('../../domain/servicios/calculadora-simulacion-solar');
import DtoConsultarEstadisticas = require('../../domain/entities/dtos/analytics/consultar-estadisticas.dto');
import EstadisticasMunicipios = require('../../domain/entities/estadisticas-municipios.entidad');
import FuenteDatosSimulaciones = require('../../domain/datasources/fuente-datos-simulaciones');
import RepositorioAnalytics = require('../../domain/repositories/repositorio-analytics');

/**
 * Implementación de las estadísticas agregadas por municipio.
 *
 * Las cifras se calculan exclusivamente a partir de las simulaciones persistidas
 * en MySQL; no se asume que una simulación representa una instalación real.
 */
class RepositorioAnalyticsImpl implements RepositorioAnalytics
{
    constructor(private readonly fuenteDatosSimulaciones: FuenteDatosSimulaciones)
    {
    }

    async obtenerEstadisticas(filtros: DtoConsultarEstadisticas): Promise<EstadisticasMunicipios>
    {
        const simulaciones = await this.fuenteDatosSimulaciones.listarTodos(filtros.municipality);

        const desde = filtros.period === null ? null : new Date(Date.now() - filtros.period * 24 * 60 * 60 * 1000);
        const delPeriodo = desde === null ? simulaciones : simulaciones.filter((simulacion) => simulacion.fechaCreacion >= desde);

        const consumoAnual = delPeriodo.reduce((total, simulacion) => total + simulacion.consumoKwh, 0);
        const produccionAnual = delPeriodo.reduce((total, simulacion) => total + simulacion.produccionAnual, 0);
        const ahorroEconomico = delPeriodo.reduce((total, simulacion) => total + simulacion.ahorroEstimado, 0);
        const emisionesCarbono = CalculadoraEmisionesCarbono.calcular(produccionAnual);

        const consumoMensual = consumoAnual / 12;
        const produccionMensual = produccionAnual / 12;
        const capacidadFotovoltaicaRecomendada = delPeriodo.length > 0
            ? consumoAnual / (CalculadoraSimulacionSolar.PRODUCCION_ANUAL_PANEL_KWH * CalculadoraSimulacionSolar.FACTOR_DESEMPENO)
            : 0;

        const municipioId = filtros.municipality;

        return new EstadisticasMunicipios(
            municipioId,
            delPeriodo.length,
            null,
            { mensual: consumoMensual, anual: consumoAnual },
            { mensual: produccionMensual, anual: produccionAnual },
            { recomendada: capacidadFotovoltaicaRecomendada, instalada: null },
            ahorroEconomico,
            { kg: emisionesCarbono, toneladas: emisionesCarbono / 1000 },
            [],
            new Date(),
        );
    }
}

export = RepositorioAnalyticsImpl;
