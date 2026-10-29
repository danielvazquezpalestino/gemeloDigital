/**
 * Radiación solar estimada para una ubicación.
 */
export class radiacionSolar
{
    constructor
    (
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
