import { incentivoDto, requisitoIncentivoDto } from './respuestaIncentivos.dto';

/**
 * DTO de una evaluación de elegibilidad.
 */
export interface evaluacionIncentivoDto
{
    readonly incentivo: incentivoDto;
    readonly estado: string;
    readonly requisitosCumplidos: readonly requisitoIncentivoDto[];
    readonly requisitosPendientes: readonly requisitoIncentivoDto[];
    readonly datosFaltantes: readonly string[];
    readonly explicacion: string;
}

/**
 * DTO de los datos usados en la evaluación de elegibilidad.
 */
export interface datosElegibilidadDto
{
    readonly beneficiaryType: string;
    readonly municipality: string;
    readonly systemCapacityKw: number | null;
    readonly installationType: string | null;
}

/**
 * DTO de la respuesta de `GET /api/v1/incentives/eligibility`.
 */
export interface respuestaElegibilidadDto
{
    readonly mensaje: string;
    readonly datos: datosElegibilidadDto;
    readonly fechaEvaluacion: string;
    readonly evaluaciones: readonly evaluacionIncentivoDto[];
}
