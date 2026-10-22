import Municipio = require('../entities/municipio.entidad');

abstract class FuenteDatosUbicaciones {
    abstract obtenerMunicipios(): Promise<Municipio[]>;
}

export = FuenteDatosUbicaciones;
