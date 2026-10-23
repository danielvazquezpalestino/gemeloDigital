import ValidacionFinanciera = require('./validacion-financiera');

class DtoEstimacionFinanciera
{
    private constructor
    (
        public readonly inversionInicial: number,
        public readonly ahorroAnualInicial: number,
        public readonly tasaDescuento: number,
        public readonly aniosProyeccion: number,
        public readonly inflacionEnergiaAnual: number,
        public readonly costoMantenimientoAnual: number,
    )
    {
    }

    static crear(datos: unknown): [string | undefined, DtoEstimacionFinanciera | undefined]
    {
        const objeto = ValidacionFinanciera.comoObjeto(datos);

        if (!objeto)
        {
            return ['Los datos de la estimación financiera son inválidos', undefined];
        }

        if (objeto['inversionInicial'] === undefined || objeto['inversionInicial'] === null)
        {
            return ['El campo "inversionInicial" es obligatorio', undefined];
        }

        const [errorInversion, inversionInicial] = ValidacionFinanciera.leerNumeroPositivo
        (
            objeto['inversionInicial'],
            'inversionInicial',
            ValidacionFinanciera.INVERSION_MAXIMA,
        );

        if (errorInversion || inversionInicial === undefined)
        {
            return [errorInversion ?? 'El campo "inversionInicial" es inválido', undefined];
        }

        if (objeto['ahorroAnualInicial'] === undefined || objeto['ahorroAnualInicial'] === null)
        {
            return ['El campo "ahorroAnualInicial" es obligatorio', undefined];
        }

        const [errorAhorro, ahorroAnualInicial] = ValidacionFinanciera.leerNumeroPositivo
        (
            objeto['ahorroAnualInicial'],
            'ahorroAnualInicial',
            ValidacionFinanciera.AHORRO_MAXIMO,
        );

        if (errorAhorro || ahorroAnualInicial === undefined)
        {
            return [errorAhorro ?? 'El campo "ahorroAnualInicial" es inválido', undefined];
        }

        const [errorTasa, tasaDescuento] = ValidacionFinanciera.leerTasa
        (
            objeto['tasaDescuento'],
            'tasaDescuento',
            ValidacionFinanciera.TASA_POR_DEFECTO,
        );

        if (errorTasa || tasaDescuento === undefined)
        {
            return [errorTasa ?? 'El campo "tasaDescuento" es inválido', undefined];
        }

        const [errorAnios, aniosProyeccion] = ValidacionFinanciera.leerAnios
        (
            objeto['aniosProyeccion'],
            'aniosProyeccion',
            ValidacionFinanciera.ANIOS_POR_DEFECTO,
        );

        if (errorAnios || aniosProyeccion === undefined)
        {
            return [errorAnios ?? 'El campo "aniosProyeccion" es inválido', undefined];
        }

        const [errorInflacion, inflacionEnergiaAnual] = ValidacionFinanciera.leerTasa
        (
            objeto['inflacionEnergiaAnual'],
            'inflacionEnergiaAnual',
            ValidacionFinanciera.INFLACION_POR_DEFECTO,
        );

        if (errorInflacion || inflacionEnergiaAnual === undefined)
        {
            return [errorInflacion ?? 'El campo "inflacionEnergiaAnual" es inválido', undefined];
        }

        const [errorMantenimiento, costoMantenimientoAnual] = ValidacionFinanciera.leerNumeroNoNegativo
        (
            objeto['costoMantenimientoAnual'],
            'costoMantenimientoAnual',
            0,
            ValidacionFinanciera.MANTENIMIENTO_MAXIMO,
        );

        if (errorMantenimiento || costoMantenimientoAnual === undefined)
        {
            return [errorMantenimiento ?? 'El campo "costoMantenimientoAnual" es inválido', undefined];
        }

        return [undefined, new DtoEstimacionFinanciera
        (
            inversionInicial,
            ahorroAnualInicial,
            tasaDescuento,
            aniosProyeccion,
            inflacionEnergiaAnual,
            costoMantenimientoAnual,
        )];
    }
}

export = DtoEstimacionFinanciera;
