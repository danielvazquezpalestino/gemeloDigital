/**
 * Tipos de tarifa de la CFE que el modelo de simulación solar reconoce.
 *
 * - PDBT: tarifa plana de baja tensión (referencia del modelo).
 * - DAC: tarifa de alto consumo en horario diurno.
 * - GDBT: tarifa general de baja tensión con precios por hora (punta/valle).
 */
enum TipoTarifa
{
    PDBT = 'PDBT',
    DAC = 'DAC',
    GDBT = 'GDBT'
}

export = TipoTarifa;
