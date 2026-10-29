/**
 * DTO de un bloque de consumo de una tarifa eléctrica.
 */
export interface bloqueConsumoTarifaDto
{
    readonly hastaKwh: number | null;
    readonly precioKwh: number;
}

/**
 * DTO de una tarifa eléctrica.
 */
export interface tarifaElectricaDto
{
    readonly codigo: string;
    readonly nombre: string;
    readonly descripcion: string;
    readonly tipoUsuario: string;
    readonly bloques: readonly bloqueConsumoTarifaDto[];
    readonly esDemostracion: boolean;
}

/**
 * DTO de la respuesta de `GET /api/v1/electricity/tariffs`.
 */
export interface respuestaTarifasDto
{
    readonly mensaje: string;
    readonly esDemostracion: boolean;
    readonly advertencia: string | null;
    readonly tarifas: readonly tarifaElectricaDto[];
}
