import { sesion } from '../../dominio/entidades/sesion.entidad';
import { usuario } from '../../dominio/entidades/usuario.entidad';

/**
 * Puerto de acceso a la API de autenticación.
 *
 * La aplicación depende de esta abstracción; el adaptador HTTP vive en
 * infraestructura y se cablea en la raíz de composición.
 */
export abstract class repositorioAutenticacion
{
    abstract registrar(nombre: string, correo: string, contrasenia: string): Promise<usuario>;

    abstract iniciarSesion(correo: string, contrasenia: string): Promise<sesion>;
}
