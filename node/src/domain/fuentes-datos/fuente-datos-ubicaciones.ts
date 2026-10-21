import Municipio = require('../entidades/municipio.entidad');

abstract class FuenteDatosUbicaciones {
    abstract obtenerMunicipios(): Promise<Municipio[]>;
}

export = FuenteDatosUbicaciones;
