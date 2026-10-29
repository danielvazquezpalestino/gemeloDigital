/**
 * Resultado de evaluar la elegibilidad de un incentivo.
 */
export type estadoEvaluacionIncentivo =
    | 'eligible'
    | 'potentially_eligible'
    | 'ineligible'
    | 'insufficient_data';
