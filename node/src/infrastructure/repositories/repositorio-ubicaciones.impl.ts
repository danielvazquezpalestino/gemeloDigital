import Municipio = require('../../domain/entities/municipio.entidad');
import FuenteDatosUbicaciones = require('../../domain/datasources/fuente-datos-ubicaciones');
import RepositorioUbicaciones = require('../../domain/repositories/repositorio-ubicaciones');

class RepositorioUbicacionesImpl implements RepositorioUbicaciones {
    constructor(private readonly fuenteDatos: FuenteDatosUbicaciones) {}

    obtenerMunicipios(): Promise<Municipio[]> {
        return this.fuenteDatos.obtenerMunicipios();
    }
}

export = RepositorioUbicacionesImpl;
