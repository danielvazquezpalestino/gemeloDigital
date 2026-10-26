import { sesion } from '../../dominio/entidades/sesion.entidad';

/**
 * Puerto de acceso a la API de autenticación.
 *
 * La aplicación depende de esta abstracción; el adaptador HTTP vive en
 * infraestructura y se cablea en la raíz de composición.
 */
export abstract class repositorioAutenticacion
{
    abstract iniciarSesion(correo: string, contrasenia: string): Promise<sesion>;
}
