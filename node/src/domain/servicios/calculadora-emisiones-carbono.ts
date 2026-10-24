/**
 * Calculadora de emisiones de CO₂ evitadas por la energía solar.
 *
 * El factor de emisión es configurable y se documenta aquí: se trata de la
 * cantidad de kilogramos de dióxido de carbono evitado por cada kilovatiohora
 * de energía que la generación solar inyecta a la red eléctrica.
 */
class CalculadoraEmisionesCarbono
{
    /** Factor de emisión en kilogramos de CO₂ por kWh evitado. */
    static readonly FACTOR_CO2_KG_KWH = 0.5;

    /**
     * Calcula las emisiones evitadas en kilogramos de CO₂ por los
     * kilovatioshora de producción solar evitada.
     */
    static calcular(kwh: number): number
    {
        if (kwh <= 0)
        {
            return 0;
        }

        return kwh * CalculadoraEmisionesCarbono.FACTOR_CO2_KG_KWH;
    }
}

export = CalculadoraEmisionesCarbono;
