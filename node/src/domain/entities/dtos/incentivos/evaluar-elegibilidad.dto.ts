import ValidacionEntrada = require('../validacion-entrada');

class DtoElegibilidadIncentivo
{
    private constructor(
        public readonly incentivoId: string,
        public readonly tipoUsuario: string | undefined,
        public readonly region: string | undefined,
        public readonly ingresoMensualMxn: number | undefined,
        public readonly consumoPromedioMensualKwh: number | undefined,
        public readonly inversionProyectoMxn: number | undefined,
    )
    {
    }

    static crear(consulta: unknown): [string | undefined, DtoElegibilidadIncentivo | undefined]
    {
        const objeto = ValidacionEntrada.comoObjeto(consulta);

        if (!objeto)
        {
            return ['Los parámetros de elegibilidad son inválidos', undefined];
        }

        const [errorId, incentivoId] = ValidacionEntrada.leerTextoRequerido(objeto['incentivoId'], 'incentivoId', 80);

        if (errorId || incentivoId === undefined)
        {
            return [errorId, undefined];
        }

        const [errorTipo, tipoUsuario] = ValidacionEntrada.leerTextoOpcional(objeto['tipoUsuario'], 'tipoUsuario', 40);
        const [errorRegion, region] = ValidacionEntrada.leerTextoOpcional(objeto['region'], 'region', 80);

        if (errorTipo || errorRegion)
        {
            return [errorTipo ?? errorRegion, undefined];
        }

        const [errorIngreso, ingresoMensualMxn] = DtoElegibilidadIncentivo.leerNumeroOpcional(
            objeto['ingresoMensualMxn'],
            'ingresoMensualMxn',
            100000000,
        );

        if (errorIngreso)
        {
            return [errorIngreso, undefined];
        }

        const [errorConsumo, consumoPromedioMensualKwh] = DtoElegibilidadIncentivo.leerNumeroOpcional(
            objeto['consumoPromedioMensualKwh'],
            'consumoPromedioMensualKwh',
            10000000,
        );

        if (errorConsumo)
        {
            return [errorConsumo, undefined];
        }

        const [errorInversion, inversionProyectoMxn] = DtoElegibilidadIncentivo.leerNumeroOpcional(
            objeto['inversionProyectoMxn'],
            'inversionProyectoMxn',
            1000000000,
        );

        if (errorInversion)
        {
            return [errorInversion, undefined];
        }

        return [undefined, new DtoElegibilidadIncentivo(
            incentivoId,
            tipoUsuario?.toUpperCase(),
            region?.toUpperCase(),
            ingresoMensualMxn,
            consumoPromedioMensualKwh,
            inversionProyectoMxn,
        )];
    }

    comoDatos(): { [campo: string]: string | number | undefined }
    {
        return {
            tipoUsuario: this.tipoUsuario,
            region: this.region,
            ingresoMensualMxn: this.ingresoMensualMxn,
            consumoPromedioMensualKwh: this.consumoPromedioMensualKwh,
            inversionProyectoMxn: this.inversionProyectoMxn,
        };
    }

    private static leerNumeroOpcional(
        valor: unknown,
        campo: string,
        maximo: number,
    ): [string | undefined, number | undefined]
    {
        if (valor === undefined || valor === null || valor === '')
        {
            return [undefined, undefined];
        }

        return ValidacionEntrada.leerNumeroConsulta(valor, campo, { minimo: 0, maximo });
    }
}

export = DtoElegibilidadIncentivo;
