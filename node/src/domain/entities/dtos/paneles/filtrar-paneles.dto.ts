import ValidacionEntrada = require('../validacion-entrada');

class DtoFiltrarPaneles
{
    private constructor(
        public readonly fabricante: string | undefined,
        public readonly potenciaMinimaWatts: number | undefined,
    )
    {
    }

    static crear(consulta: unknown): [string | undefined, DtoFiltrarPaneles | undefined]
    {
        const objeto = ValidacionEntrada.comoObjeto(consulta);

        if (!objeto)
        {
            return ['Los parámetros de consulta son inválidos', undefined];
        }

        const [errorFabricante, fabricante] = ValidacionEntrada.leerTextoOpcional(objeto['fabricante'], 'fabricante', 80);

        if (errorFabricante)
        {
            return [errorFabricante, undefined];
        }

        let potenciaMinimaWatts: number | undefined;

        if (objeto['potenciaMinimaWatts'] !== undefined && objeto['potenciaMinimaWatts'] !== '')
        {
            const [errorPotencia, potencia] = ValidacionEntrada.leerNumeroConsulta(
                objeto['potenciaMinimaWatts'],
                'potenciaMinimaWatts',
                { minimo: 0, maximo: 100000, incluirMinimo: false },
            );

            if (errorPotencia || potencia === undefined)
            {
                return [errorPotencia, undefined];
            }

            potenciaMinimaWatts = potencia;
        }

        return [undefined, new DtoFiltrarPaneles(fabricante, potenciaMinimaWatts)];
    }
}

export = DtoFiltrarPaneles;
