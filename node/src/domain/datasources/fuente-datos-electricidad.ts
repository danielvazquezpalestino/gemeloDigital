import TarifaElectrica = require('../entities/tarifa-electrica.entidad');

abstract class FuenteDatosElectricidad
{
    abstract listarTarifas(): Promise<TarifaElectrica[]>;

    abstract buscarTarifa(codigo: string): Promise<TarifaElectrica | null>;
}

export = FuenteDatosElectricidad;
