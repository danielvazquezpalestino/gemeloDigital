import Municipio = require('../entidades/municipio.entidad');

abstract class RepositorioUbicaciones {
    abstract obtenerMunicipios(): Promise<Municipio[]>;
}

export = RepositorioUbicaciones;
