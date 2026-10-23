import DtoEstimacionFinanciera = require('../entities/dtos/financiero/estimacion-financiera.dto');
import EstimacionFinanciera = require('../entities/estimacion-financiera.entidad');
import FlujoCajaAnual = require('../entities/flujo-caja-anual.entidad');

class CalculadoraFinanciera
{
    calcular(dto: DtoEstimacionFinanciera): EstimacionFinanciera
    {
        const flujosNetos: number[] = [];
        const flujosProyectados: FlujoCajaAnual[] = [];
        let flujoAcumulado = -dto.inversionInicial;
        let sumaFlujosNetos = 0;
        let vpn = -dto.inversionInicial;
        let periodoRecuperacionAnios: number | null = null;

        for (let anio = 1; anio <= dto.aniosProyeccion; anio++)
        {
            const ahorro = dto.ahorroAnualInicial * Math.pow(1 + dto.inflacionEnergiaAnual, anio - 1);
            const flujoNeto = ahorro - dto.costoMantenimientoAnual;
            const flujoDescontado = flujoNeto / Math.pow(1 + dto.tasaDescuento, anio);
            const flujoAcumuladoAnterior = flujoAcumulado;

            flujoAcumulado += flujoNeto;
            sumaFlujosNetos += flujoNeto;
            vpn += flujoDescontado;
            flujosNetos.push(flujoNeto);

            if (periodoRecuperacionAnios === null && flujoAcumuladoAnterior < 0 && flujoAcumulado >= 0 && flujoNeto > 0)
            {
                periodoRecuperacionAnios = (anio - 1) + (-flujoAcumuladoAnterior / flujoNeto);
            }

            flujosProyectados.push(new FlujoCajaAnual
            (
                anio,
                CalculadoraFinanciera.redondear(ahorro),
                CalculadoraFinanciera.redondear(dto.costoMantenimientoAnual),
                CalculadoraFinanciera.redondear(flujoNeto),
                CalculadoraFinanciera.redondear(flujoDescontado),
                CalculadoraFinanciera.redondear(flujoAcumulado),
            ));
        }

        const roi = ((sumaFlujosNetos - dto.inversionInicial) / dto.inversionInicial) * 100;
        const tir = this.calcularTir(dto.inversionInicial, flujosNetos);

        return new EstimacionFinanciera
        (
            CalculadoraFinanciera.redondear(dto.inversionInicial),
            CalculadoraFinanciera.redondear(dto.ahorroAnualInicial),
            CalculadoraFinanciera.redondear(vpn),
            tir === null ? null : CalculadoraFinanciera.redondear(tir, 4),
            CalculadoraFinanciera.redondear(roi),
            periodoRecuperacionAnios === null ? null : CalculadoraFinanciera.redondear(periodoRecuperacionAnios),
            flujosProyectados,
        );
    }

    private calcularTir(inversionInicial: number, flujosNetos: readonly number[]): number | null
    {
        let tasaInferior = -0.9999;
        let tasaSuperior = 1;
        let vpnInferior = CalculadoraFinanciera.calcularVpn(inversionInicial, flujosNetos, tasaInferior);
        let vpnSuperior = CalculadoraFinanciera.calcularVpn(inversionInicial, flujosNetos, tasaSuperior);

        while (vpnSuperior > 0 && tasaSuperior < 1000000)
        {
            tasaSuperior *= 2;
            vpnSuperior = CalculadoraFinanciera.calcularVpn(inversionInicial, flujosNetos, tasaSuperior);
        }

        if (vpnInferior === 0)
        {
            return tasaInferior;
        }

        if (vpnSuperior === 0)
        {
            return tasaSuperior;
        }

        if ((vpnInferior > 0 && vpnSuperior > 0) || (vpnInferior < 0 && vpnSuperior < 0))
        {
            return null;
        }

        for (let iteracion = 0; iteracion < 200; iteracion++)
        {
            const tasaMedia = (tasaInferior + tasaSuperior) / 2;
            const vpnMedio = CalculadoraFinanciera.calcularVpn(inversionInicial, flujosNetos, tasaMedia);

            if (vpnMedio === 0 || (tasaSuperior - tasaInferior) < 0.0000000001)
            {
                return tasaMedia;
            }

            if ((vpnInferior < 0 && vpnMedio > 0) || (vpnInferior > 0 && vpnMedio < 0))
            {
                tasaSuperior = tasaMedia;
                vpnSuperior = vpnMedio;
            }
            else
            {
                tasaInferior = tasaMedia;
                vpnInferior = vpnMedio;
            }
        }

        return (tasaInferior + tasaSuperior) / 2;
    }

    private static calcularVpn(inversionInicial: number, flujosNetos: readonly number[], tasa: number): number
    {
        let vpn = -inversionInicial;

        for (const [indice, flujoNeto] of flujosNetos.entries())
        {
            vpn += flujoNeto / Math.pow(1 + tasa, indice + 1);
        }

        return vpn;
    }

    private static redondear(valor: number, decimales = 2): number
    {
        const factor = Math.pow(10, decimales);

        return Math.round((valor + Number.EPSILON) * factor) / factor;
    }
}

export = CalculadoraFinanciera;
