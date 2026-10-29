/**
 * Panel solar del catálogo comercial.
 */
export class panelSolar
{
    constructor
    (
        public readonly id: string,
        public readonly fabricante: string,
        public readonly modelo: string,
        public readonly potenciaWatts: number,
        public readonly eficienciaPorcentaje: number,
        public readonly tecnologia: string,
        public readonly garantiaAnios: number,
        public readonly anchoMetros: number,
        public readonly altoMetros: number,
        public readonly descripcion: string,
        public readonly esDemostracion: boolean,
    )
    {
    }
}
