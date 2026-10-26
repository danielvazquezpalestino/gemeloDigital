import Usuario = require('../entities/usuario.entidad');

/**
 * Puerto de persistencia de usuarios.
 *
 * El SQL vive únicamente en la implementación de infraestructura.
 */
abstract class FuenteDatosAutenticacion
{
    abstract buscarPorCorreo(correo: string): Promise<Usuario | null>;

    abstract insertar(usuario: Usuario): Promise<Usuario>;
}

export = FuenteDatosAutenticacion;
