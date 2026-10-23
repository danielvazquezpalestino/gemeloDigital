import DtoEstimarFinanciero = require('../entities/dtos/financiero/estimar-financiero.dto');
import FlujoFinancieroAnual = require('../entities/flujo-financiero-anual.entidad');
import ResultadoFinanciero = require('../entities/resultado-financiero.entidad');

/**
 * Calculadora financiera del proyecto solar.
 *
 * Convención: la inversión inicial ocurre en el año 0 y se registra como
 * salida de efectivo; cada flujo neto anual (ahorro menos mantenimiento)
 * ocurre al final del año correspondiente. Los valores están en MXN y NO
 * incluyen IVA, porque el DTO no recibe impuestos.
 */
class CalculadoraFinanciera
{
    calcular(dto: DtoEstimarFinanciero): ResultadoFinanciero
    {
        const flujoNetoAnual = dto.ahorroAnual - dto.mantenimientoAnual;
        const flujosAnuales: FlujoFinancieroAnual[] = [];
        let acumulado = 0;
        let vpn = -dto.inversionInicial;
        let recuperacionAnios: number | null = null;

        for (let anio = 1; anio <= dto.horizonteAnios; anio += 1)
        {
            const flujoDescontado = flujoNetoAnual / Math.pow(1 + dto.tasaDescuento, anio);
            const acumuladoAnterior = acumulado;
            acumulado += flujoNetoAnual;
            vpn += flujoDescontado;

            if (recuperacionAnios === null && flujoNetoAnual > 0 && acumulado >= dto.inversionInicial)
            {
                recuperacionAnios = (anio - 1) + ((dto.inversionInicial - acumuladoAnterior) / flujoNetoAnual);
            }

            flujosAnuales.push(new FlujoFinancieroAnual(
                anio,
                CalculadoraFinanciera.redondear(flujoNetoAnual),
                CalculadoraFinanciera.redondear(flujoDescontado),
                CalculadoraFinanciera.redondear(acumulado),
            ));
        }

        const roiPorcentaje = ((flujoNetoAnual * dto.horizonteAnios) - dto.inversionInicial) / dto.inversionInicial * 100;
        const tirPorcentaje = CalculadoraFinanciera.calcularTir(dto.inversionInicial, flujoNetoAnual, dto.horizonteAnios);
        const advertencias: string[] = [];

        if (flujoNetoAnual <= 0)
        {
            advertencias.push('El flujo neto anual no es positivo: la inversión no se recupera con estos supuestos.');
        }
        else if (recuperacionAnios === null)
        {
            advertencias.push('La inversión no se recupera dentro del horizonte de análisis configurado.');
        }

        if (vpn < 0)
        {
            advertencias.push('El VPN es negativo: el proyecto no crea valor con la tasa de descuento indicada.');
        }

        if (tirPorcentaje === null)
        {
            advertencias.push('No se pudo calcular una TIR real en el rango [-99.99 %, 1000 %] con estos flujos.');
        }

        advertencias.push('Los valores están en MXN y no incluyen IVA.');
        advertencias.push('La estimación es informativa y depende de los supuestos capturados por el cliente.');

        return new ResultadoFinanciero(
            CalculadoraFinanciera.redondear(dto.inversionInicial),
            CalculadoraFinanciera.redondear(dto.ahorroAnual),
            CalculadoraFinanciera.redondear(dto.mantenimientoAnual),
            CalculadoraFinanciera.redondear(flujoNetoAnual),
            dto.horizonteAnios,
            dto.tasaDescuento,
            'MXN',
            false,
            'Inversión en el año 0 como salida de efectivo; flujos netos anuales al final de cada año; flujo neto = ahorro anual - mantenimiento anual.',
            flujosAnuales,
            recuperacionAnios === null ? null : CalculadoraFinanciera.redondear(recuperacionAnios),
            CalculadoraFinanciera.redondear(roiPorcentaje),
            CalculadoraFinanciera.redondear(vpn),
            tirPorcentaje === null ? null : CalculadoraFinanciera.redondear(tirPorcentaje),
            advertencias,
        );
    }

    private static calcularTir(inversionInicial: number, flujoNetoAnual: number, horizonteAnios: number): number | null
    {
        if (flujoNetoAnual <= 0)
        {
            return null;
        }

        const calcularVpn = (tasa: number): number =>
        {
            let valor = -inversionInicial;

            for (let anio = 1; anio <= horizonteAnios; anio += 1)
            {
                valor += flujoNetoAnual / Math.pow(1 + tasa, anio);
            }

            return valor;
        };

        let inferior = -0.9999;
        let superior = 10;
        let vpnInferior = calcularVpn(inferior);
        const vpnSuperior = calcularVpn(superior);

        if (vpnInferior * vpnSuperior > 0)
        {
            return null;
        }

        for (let iteracion = 0; iteracion < 200; iteracion += 1)
        {
            const medio = (inferior + superior) / 2;
            const vpnMedio = calcularVpn(medio);

            if (Math.abs(vpnMedio) < 0.0000001)
            {
                return medio * 100;
            }

            if (vpnInferior * vpnMedio <= 0)
            {
                superior = medio;
            }
            else
            {
                inferior = medio;
                vpnInferior = vpnMedio;
            }
        }

        return ((inferior + superior) / 2) * 100;
    }

    private static redondear(valor: number): number
    {
        return Math.round((valor + Number.EPSILON) * 100) / 100;
    }
}

export = CalculadoraFinanciera;
