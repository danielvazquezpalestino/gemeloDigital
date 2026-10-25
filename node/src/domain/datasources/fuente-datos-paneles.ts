import DtoFiltrarPaneles = require('../entities/dtos/paneles/filtrar-paneles.dto');
import PanelSolar = require('../entities/panel-solar.entidad');

abstract class FuenteDatosPaneles
{
    abstract listar(filtros: DtoFiltrarPaneles): Promise<PanelSolar[]>;
}

export = FuenteDatosPaneles;
