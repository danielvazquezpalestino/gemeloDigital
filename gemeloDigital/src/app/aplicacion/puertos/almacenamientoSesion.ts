import { sesion } from '../../dominio/entidades/sesion.entidad';

/**
 * Puerto de persistencia local de la sesión.
 */
export abstract class almacenamientoSesion
{
    abstract guardar(sesion: sesion): void;

    abstract obtener(): sesion | null;

    abstract obtenerToken(): string | null;

    abstract eliminar(): void;

    abstract estaAutenticado(): boolean;
}
