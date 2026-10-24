/**
 * Estados de la evaluación de elegibilidad de un incentivo.
 *
 * - `eligible`: el solicitante cumple con los requisitos documentados.
 * - `potentially_eligible`: cumple los requisitos verificados, pero el programa
 *   aún tiene requisitos adicionales pendientes de verificación.
 * - `ineligible`: el solicitante no cumple con un requisito verificado.
 * - `insufficient_data`: faltan datos del solicitante o el programa no tiene
 *   sus requisitos completos o verificados.
 */
enum EstadoEvaluacion
{
    ELEGIBLE = 'eligible',
    POTENTIALLY_ELIGIBLE = 'potentially_eligible',
    INELIGIBLE = 'ineligible',
    INSUFFICIENT_DATA = 'insufficient_data',
}

export = EstadoEvaluacion;
