import DtoInicioSesion = require('./entities/dtos/autenticacion/inicio-sesion.dto');
import DtoRegistroUsuario = require('./entities/dtos/autenticacion/registro-usuario.dto');
import ErrorPersonalizado = require('./datasources/errors/custom-error');
import FuenteDatosAutenticacion = require('./datasources/fuente-datos-autenticacion');
import Municipio = require('./entities/municipio.entidad');
import RepositorioAutenticacion = require('./repositories/repositorio-autenticacion');
import Sesion = require('./entities/sesion.entidad');
import Usuario = require('./entities/usuario.entidad');

const dominio = {
    DtoInicioSesion,
    DtoRegistroUsuario,
    ErrorPersonalizado,
    FuenteDatosAutenticacion,
    Municipio,
    RepositorioAutenticacion,
    Sesion,
    Usuario,
};

export = dominio;
