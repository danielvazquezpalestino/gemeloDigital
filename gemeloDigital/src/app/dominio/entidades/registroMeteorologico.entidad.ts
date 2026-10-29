/**
 * Registro meteorológico puntual devuelto por el pronóstico.
 */
export class registroMeteorologico
{
    constructor
    (
        public readonly fecha: Date,
        public readonly temperatura: number | null,
        public readonly nubosidad: number | null,
        public readonly precipitacion: number | null,
        public readonly radiacionSolar: number | null,
    )
    {
    }
}
