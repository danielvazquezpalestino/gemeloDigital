/**
 * Periodo al que corresponde el consumo declarado en una estimación.
 *
 * El cálculo aplica los bloques de la tarifa sobre el total de kWh recibido;
 * no convierte el consumo entre periodos.
 */
enum PeriodoFacturacion
{
    MENSUAL = 'MENSUAL',
    BIMESTRAL = 'BIMESTRAL',
    TRIMESTRAL = 'TRIMESTRAL',
    SEMESTRAL = 'SEMESTRAL',
    ANUAL = 'ANUAL'
}

export = PeriodoFacturacion;
