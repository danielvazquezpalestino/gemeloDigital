/**
 * Radiación solar promedio estimada para una ubicación.
 *
 * `fuente` indica de dónde proviene el valor. Mientras no exista una tabla de
 * radiación en MySQL, la fuente siempre será una estimación local.
 */
class RadiacionSolar
{
    constructor(
        public readonly latitud: number | null,
        public readonly longitud: number | null,
        public readonly municipioId: number | null,
        public readonly radiacionKwhM2Dia: number,
        public readonly esEstimacion: boolean,
        public readonly fuente: string,
    )
    {
    }
}

export = RadiacionSolar;
