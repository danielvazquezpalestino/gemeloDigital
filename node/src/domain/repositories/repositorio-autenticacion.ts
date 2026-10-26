import DtoInicioSesion = require('../entities/dtos/autenticacion/inicio-sesion.dto');
import DtoRegistroUsuario = require('../entities/dtos/autenticacion/registro-usuario.dto');
import Sesion = require('../entities/sesion.entidad');
import Usuario = require('../entities/usuario.entidad');

/**
 * Casos de uso de autenticación.
 */
abstract class RepositorioAutenticacion
{
    abstract registrar(dtoRegistroUsuario: DtoRegistroUsuario): Promise<Usuario>;

    abstract iniciarSesion(dtoInicioSesion: DtoInicioSesion): Promise<Sesion>;
}

export = RepositorioAutenticacion;
