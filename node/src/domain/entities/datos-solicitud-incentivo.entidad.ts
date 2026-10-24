class DatosSolicitudIncentivo
{
    constructor
    (
        public readonly beneficiarioTipo: string,
        public readonly municipioId: number | null,
        public readonly capacidadKw: number | null,
        public readonly tipoInstalacion: string | null,
    )
    {
    }
}

export = DatosSolicitudIncentivo;
