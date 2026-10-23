import BloqueConsumoTarifa = require('../../domain/entities/bloque-consumo-tarifa.entidad');
import FuenteDatosElectricidad = require('../../domain/datasources/fuente-datos-electricidad');
import TarifaElectrica = require('../../domain/entities/tarifa-electrica.entidad');

/**
 * Catálogo configurable de tarifas.
 *
 * Todos los precios y límites son DATOS DE DEMOSTRACIÓN: no provienen de una
 * fuente oficial verificada y no deben presentarse como tarifas de la CFE.
 * Para sustituirlos por datos reales basta editar este arreglo (o reemplazar
 * esta implementación por una que consulte MySQL).
 */
class FuenteDatosElectricidadImpl extends FuenteDatosElectricidad
{
    private readonly tarifas: readonly TarifaElectrica[] =
    [
        new TarifaElectrica(
            'PDBT',
            'Tarifa doméstica de demostración',
            'Tarifa plana de baja tensión con bloques de consumo. Datos de demostración, no oficiales.',
            'HOGAR',
            [
                new BloqueConsumoTarifa(75, 1.05),
                new BloqueConsumoTarifa(125, 1.25),
                new BloqueConsumoTarifa(null, 1.45),
            ],
            true,
        ),
        new TarifaElectrica(
            'DAC',
            'Tarifa de alto consumo de demostración',
            'Tarifa de alto consumo con precio único. Datos de demostración, no oficiales.',
            'HOGAR',
            [
                new BloqueConsumoTarifa(null, 2.1),
            ],
            true,
        ),
        new TarifaElectrica(
            'GDBT',
            'Tarifa general de baja tensión de demostración',
            'Tarifa general por bloques para pequeños comercios. Datos de demostración, no oficiales.',
            'COMERCIO',
            [
                new BloqueConsumoTarifa(100, 1.1),
                new BloqueConsumoTarifa(null, 1.6),
            ],
            true,
        ),
    ];

    async listarTarifas(): Promise<TarifaElectrica[]>
    {
        return [...this.tarifas];
    }

    async buscarTarifa(codigo: string): Promise<TarifaElectrica | null>
    {
        const normalizado = codigo.trim().toUpperCase();
        const tarifa = this.tarifas.find((candidata) => candidata.codigo === normalizado);

        return tarifa ?? null;
    }
}

export = FuenteDatosElectricidadImpl;
