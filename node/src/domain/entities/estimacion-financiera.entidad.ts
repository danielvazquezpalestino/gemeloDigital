import FlujoCajaAnual = require('./flujo-caja-anual.entidad');

class EstimacionFinanciera
{
    constructor
    (
        public readonly inversionInicial: number,
        public readonly ahorroAnual: number,
        public readonly vpn: number,
        public readonly tir: number | null,
        public readonly roi: number,
        public readonly periodoRecuperacionAnios: number | null,
        public readonly flujoCajaProyectado: readonly FlujoCajaAnual[],
    )
    {
    }
}

export = EstimacionFinanciera;
