import RegistroMeteorologico = require('./registro-meteorologico.entidad');

/**
 * Pronóstico meteorológico calculado para una ubicación durante un número
 * determinado de días.
 *
 * `registros` contiene uno por día cuando el proveedor lo permite; cada
 * variable climática es `null` cuando el proveedor no la reporta.
 */
class Pronostico
{
    constructor
    (
        public readonly proveedor: string,
        public readonly latitud: number,
        public readonly longitud: number,
        public readonly dias: number,
        public readonly zonaHoraria: string,
        public readonly fechaConsulta: Date,
        public readonly registros: readonly RegistroMeteorologico[],
    )
    {
    }
}

export = Pronostico;
