import DtoFiltrarPaneles = require('../../domain/entities/dtos/paneles/filtrar-paneles.dto');
import FuenteDatosPaneles = require('../../domain/datasources/fuente-datos-paneles');
import PanelSolar = require('../../domain/entities/panel-solar.entidad');
import RepositorioPaneles = require('../../domain/repositories/repositorio-paneles');

class RepositorioPanelesImpl implements RepositorioPaneles
{
    constructor(private readonly fuenteDatos: FuenteDatosPaneles)
    {
    }

    listar(filtros: DtoFiltrarPaneles): Promise<PanelSolar[]>
    {
        return this.fuenteDatos.listar(filtros);
    }
}

export = RepositorioPanelesImpl;
