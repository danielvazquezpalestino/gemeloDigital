import Municipio = require('../../domain/entidades/municipio.entidad');
import FuenteDatosUbicaciones = require('../../domain/fuentes-datos/fuente-datos-ubicaciones');
import RepositorioUbicaciones = require('../../domain/repositorios/repositorio-ubicaciones');

class RepositorioUbicacionesImpl implements RepositorioUbicaciones {
    constructor(private readonly fuenteDatos: FuenteDatosUbicaciones) {}

    obtenerMunicipios(): Promise<Municipio[]> {
        return this.fuenteDatos.obtenerMunicipios();
    }
}

export = RepositorioUbicacionesImpl;
