import RadiacionSolar = require('../entities/radiacion-solar.entidad');
import ResultadoCalculoSolar = require('../entities/resultado-calculo-solar.entidad');
import ResultadoProduccionSolar = require('../entities/resultado-produccion-solar.entidad');
import TipoTarifa = require('../entities/tipo-tarifa');

/**
 * Modelo de cálculo solar.
 *
 * Todas las constantes de mercado están agrupadas aquí para que el supuesto
 * técnico sea auditable y ajustable en un solo lugar. La lógica vive en el
 * dominio: la capa de infraestructura solo la persiste.
 */
class CalculadoraSimulacionSolar
{
    /** kWh que genera un panel al año en condiciones de la región. */
    static readonly PRODUCCION_ANUAL_PANEL_KWH = 1500;

    /** Pérdidas por orientación, suciedad y temperatura. */
    static readonly FACTOR_DESEMPENO = 0.85;

    /** Días considerados para anualizar la producción solar. */
    static readonly DIAS_POR_ANIO = 365;

    /** Superficie que ocupa cada panel (módulo + separación y margen). */
    static readonly AREA_PANEL_M2 = 1.7;

    /** Costo del panel con estructura, en pesos. */
    static readonly COSTO_PANEL_MXN = 4500;

    /** Costo fijo de mano de obra e instalación, en pesos. */
    static readonly COSTO_INSTALACION_MXN = 8000;

    /** Costo estimado de un banco de baterías, en pesos. */
    static readonly COSTO_BANCO_BATERIAS_MXN = 18000;

    /**
     * Ajuste del ahorro según el tipo de tarifa: la generación solar coincide
     * mejor con las horas de mayor precio en las tarifas diurnas y por hora.
     */
    static readonly FACTORES_TARIFA: { [clave in TipoTarifa]: number } =
    {
        [TipoTarifa.PDBT]: 1,
        [TipoTarifa.DAC]: 1.05,
        [TipoTarifa.GDBT]: 1.03
    };

    /**
     * Calcula la simulación solar.
     *
     * @param consumoKwh Consumo eléctrico anual en kWh.
     * @param tarifaCfe Costo de la energía en pesos por kWh.
     * @param areaDisponibleM2 Superficie del techo; `null` significa que no se
     *                          conoce y no se restringe la instalación.
     * @param incluyeBaterias Si se agrega el costo de un banco de baterías.
     * @param tipoTarifa Tipo de tarifa de la CFE.
     */
    calcular
    (
        consumoKwh: number,
        tarifaCfe: number,
        areaDisponibleM2: number | null,
        incluyeBaterias: boolean,
        tipoTarifa: TipoTarifa,
    ): ResultadoCalculoSolar
    {
        const advertencias: string[] = [];
        const produccionPorPanel = CalculadoraSimulacionSolar.PRODUCCION_ANUAL_PANEL_KWH * CalculadoraSimulacionSolar.FACTOR_DESEMPENO;
        const panelesRequeridos = Math.max(1, Math.ceil(consumoKwh / produccionPorPanel));

        let panelesNecesarios = panelesRequeridos;

        if (areaDisponibleM2 !== null)
        {
            const panelesMaximos = Math.floor(areaDisponibleM2 / CalculadoraSimulacionSolar.AREA_PANEL_M2);

            if (panelesMaximos < panelesRequeridos)
            {
                panelesNecesarios = Math.max(0, panelesMaximos);

                if (panelesMaximos < 1)
                {
                    advertencias.push(`El área disponible (${areaDisponibleM2} m²) no alcanza para instalar un panel solar: cada panel ocupa ${CalculadoraSimulacionSolar.AREA_PANEL_M2} m².`);
                }
                else
                {
                    const textoPaneles = panelesMaximos === 1 ? 'panel' : 'paneles';
                    const textoInstalacion = panelesMaximos === 1 ? 'se instalará' : 'se instalarán';

                    advertencias.push(`El área disponible (${areaDisponibleM2} m²) permite instalar como máximo ${panelesMaximos} ${textoPaneles}, por lo que ${textoInstalacion} ${panelesMaximos} de los ${panelesRequeridos} necesarios para cubrir todo el consumo.`);
                }
            }
        }

        const produccionAnual = panelesNecesarios * produccionPorPanel;
        const energiaCubierta = Math.min(produccionAnual, consumoKwh);
        const factorTarifa = CalculadoraSimulacionSolar.FACTORES_TARIFA[tipoTarifa] ?? 1;
        const ahorroEstimado = energiaCubierta * tarifaCfe * factorTarifa;

        if (panelesNecesarios > 0 && produccionAnual < consumoKwh)
        {
            const cobertura = (produccionAnual / consumoKwh) * 100;

            advertencias.push(`La producción anual estimada (${CalculadoraSimulacionSolar.redondear(produccionAnual)} kWh) no cubre todo el consumo anual (${CalculadoraSimulacionSolar.redondear(consumoKwh)} kWh): la cobertura estimada es del ${CalculadoraSimulacionSolar.redondear(cobertura)} %.`);
        }

        const costoPaneles = panelesNecesarios * CalculadoraSimulacionSolar.COSTO_PANEL_MXN;
        const costoInstalacion = panelesNecesarios > 0 ? CalculadoraSimulacionSolar.COSTO_INSTALACION_MXN : 0;
        let costoBaterias = 0;

        if (incluyeBaterias)
        {
            if (panelesNecesarios > 0)
            {
                costoBaterias = CalculadoraSimulacionSolar.COSTO_BANCO_BATERIAS_MXN;

                advertencias.push(`Se incluye un banco de baterías estimado en ${costoBaterias} MXN: el retorno de inversión aumenta frente a una instalación sin baterías.`);
            }
            else
            {
                advertencias.push('No se incluye banco de baterías porque el área disponible no permite instalar paneles que generen energía para almacenar.');
            }
        }

        const costoInversionTotal = costoPaneles + costoInstalacion + costoBaterias;
        const retornoInversionAnios = ahorroEstimado > 0 ? costoInversionTotal / ahorroEstimado : 0;

        return new ResultadoCalculoSolar(
            panelesNecesarios,
            CalculadoraSimulacionSolar.redondear(produccionAnual),
            CalculadoraSimulacionSolar.redondear(ahorroEstimado),
            CalculadoraSimulacionSolar.redondear(costoInversionTotal),
            CalculadoraSimulacionSolar.redondear(retornoInversionAnios),
            advertencias,
        );
    }

    /**
     * Estima la producción eléctrica de una capacidad instalada.
     *
     * Se reutiliza la convención de anualizar la radiación diaria y se aplica
     * la eficiencia global del sistema enviada por el cliente.
     */
    calcularProduccion
    (
        capacidadKwp: number,
        radiacion: RadiacionSolar,
        eficiencia: number,
    ): ResultadoProduccionSolar
    {
        const produccionAnualKwh = capacidadKwp
            * radiacion.radiacionKwhM2Dia
            * CalculadoraSimulacionSolar.DIAS_POR_ANIO
            * eficiencia;
        const produccionMensualKwh = produccionAnualKwh / 12;

        return new ResultadoProduccionSolar(
            CalculadoraSimulacionSolar.redondear(capacidadKwp),
            CalculadoraSimulacionSolar.redondear(eficiencia),
            CalculadoraSimulacionSolar.redondear(radiacion.radiacionKwhM2Dia),
            CalculadoraSimulacionSolar.redondear(produccionMensualKwh),
            CalculadoraSimulacionSolar.redondear(produccionAnualKwh),
            radiacion.esEstimacion,
            radiacion.fuente,
        );
    }

    private static redondear(valor: number): number
    {
        return Math.round((valor + Number.EPSILON) * 100) / 100;
    }
}

export = CalculadoraSimulacionSolar;
