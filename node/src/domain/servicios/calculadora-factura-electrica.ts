import FacturaEstimada = require('../entities/factura-estimada.entidad');
import LineaFacturaEstimada = require('../entities/linea-factura-estimada.entidad');
import TarifaElectrica = require('../entities/tarifa-electrica.entidad');

/**
 * Aplica los bloques de consumo de una tarifa configurada.
 *
 * Los precios y límites provienen del catálogo de demostración: este cálculo
 * es transparente, pero no representa una tarifa oficial de la CFE.
 */
class CalculadoraFacturaElectrica
{
    calcular(tarifa: TarifaElectrica, consumoKwh: number): FacturaEstimada
    {
        const desglose: LineaFacturaEstimada[] = [];
        let restante = consumoKwh;
        let numeroBloque = 1;

        for (const bloque of tarifa.bloques)
        {
            if (restante <= 0)
            {
                break;
            }

            const cantidadKwh = bloque.hastaKwh === null ? restante : Math.min(restante, bloque.hastaKwh);

            if (cantidadKwh <= 0)
            {
                continue;
            }

            const concepto = bloque.hastaKwh === null
                ? `Consumo adicional (bloque ${numeroBloque})`
                : `Bloque ${numeroBloque} (hasta ${bloque.hastaKwh} kWh)`;

            desglose.push(new LineaFacturaEstimada(
                concepto,
                CalculadoraFacturaElectrica.redondear(cantidadKwh),
                bloque.precioKwh,
                CalculadoraFacturaElectrica.redondear(cantidadKwh * bloque.precioKwh),
            ));

            restante = CalculadoraFacturaElectrica.redondear(restante - cantidadKwh);
            numeroBloque += 1;
        }

        const totalEstimado = CalculadoraFacturaElectrica.redondear(
            desglose.reduce((total, linea) => total + linea.subtotal, 0),
        );

        return new FacturaEstimada(
            tarifa.codigo,
            tarifa.nombre,
            CalculadoraFacturaElectrica.redondear(consumoKwh),
            'MXN',
            desglose,
            totalEstimado,
            tarifa.esDemostracion,
            [
                'Los precios y límites usados son datos de DEMOSTRACIÓN y no tarifas oficiales de la CFE.',
                'La estimación no incluye IVA, cargos fijos, ajustes, recargos ni subsidios.',
                'El resultado es informativo y no sustituye un recibo o una determinación oficial.',
            ],
        );
    }

    private static redondear(valor: number): number
    {
        return Math.round((valor + Number.EPSILON) * 100) / 100;
    }
}

export = CalculadoraFacturaElectrica;
