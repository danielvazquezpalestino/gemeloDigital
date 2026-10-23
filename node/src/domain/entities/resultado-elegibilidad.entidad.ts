class ResultadoElegibilidad
{
    constructor(
        public readonly incentivoId: string,
        public readonly nombre: string,
        public readonly elegible: boolean | null,
        public readonly razones: readonly string[],
        public readonly requisitosFaltantes: readonly string[],
        public readonly esDemostracion: boolean,
        public readonly determinacionOficial: boolean,
        public readonly advertencia: string,
    )
    {
    }
}

export = ResultadoElegibilidad;
