/**
 * Conversión de fechas ISO de la API a fechas de dominio.
 */
export class fechaMapeador
{
    static aFecha(valor: string): Date
    {
        return new Date(valor);
    }

    static aFechaOpcional(valor: string | null): Date | null
    {
        return valor === null ? null : new Date(valor);
    }
}
