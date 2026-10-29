import { registroMeteorologico } from './registroMeteorologico.entidad';

/**
 * Pronóstico meteorológico normalizado de la API.
 */
export class pronostico
{
    constructor
    (
        public readonly proveedor: string,
        public readonly latitud: number,
        public readonly longitud: number,
        public readonly dias: number,
        public readonly zonaHoraria: string,
        public readonly fechaConsulta: Date,
        public readonly registros: readonly registroMeteorologico[],
    )
    {
    }
}
