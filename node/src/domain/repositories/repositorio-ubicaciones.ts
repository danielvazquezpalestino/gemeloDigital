import Municipio = require('../entities/municipio.entidad');

abstract class RepositorioUbicaciones {
    abstract obtenerMunicipios(): Promise<Municipio[]>;
}

export = RepositorioUbicaciones;
