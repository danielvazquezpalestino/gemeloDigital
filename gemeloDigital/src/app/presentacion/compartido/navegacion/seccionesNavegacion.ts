/**
 * Secciones del panel del gemelo digital.
 *
 * Vive fuera de los componentes para que la barra lateral y el encabezado
 * compartan la misma fuente de verdad sobre rutas y etiquetas.
 */
export type tipoIconoSeccion =
    | 'resumen'
    | 'solar'
    | 'clima'
    | 'tarifas'
    | 'incentivos'
    | 'financiero'
    | 'simulaciones';

export interface seccionNavegacion
{
    readonly etiqueta: string;
    readonly ruta: string;
    readonly icono: tipoIconoSeccion;
}

export class navegacionPanel
{
    static readonly secciones: readonly seccionNavegacion[] = [
        {
            etiqueta: 'Resumen',
            ruta: '/panel',
            icono: 'resumen',
        },
        {
            etiqueta: 'Producción solar',
            ruta: '/panel/produccion-solar',
            icono: 'solar',
        },
        {
            etiqueta: 'Clima',
            ruta: '/panel/clima',
            icono: 'clima',
        },
        {
            etiqueta: 'Tarifas y consumo',
            ruta: '/panel/tarifas',
            icono: 'tarifas',
        },
        {
            etiqueta: 'Incentivos',
            ruta: '/panel/incentivos',
            icono: 'incentivos',
        },
        {
            etiqueta: 'Financiero',
            ruta: '/panel/financiero',
            icono: 'financiero',
        },
        {
            etiqueta: 'Simulaciones',
            ruta: '/panel/simulaciones',
            icono: 'simulaciones',
        },
    ];

    /**
     * Devuelve la sección que corresponde a la URL activa.
     *
     * Si la URL no pertenece a ninguna sección conocida se usa la primera,
     * de modo que el encabezado siempre tenga un título que mostrar.
     */
    static seccionActual(url: string): seccionNavegacion
    {
        const ruta = url.split('?')[0];
        const coincidencia = navegacionPanel.secciones.find((seccion) => seccion.ruta === ruta);

        return coincidencia ?? navegacionPanel.secciones[0];
    }
}
