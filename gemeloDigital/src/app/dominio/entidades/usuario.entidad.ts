/**
 * Usuario autenticado del gemelo digital.
 *
 * Entidad de dominio pura: no depende de Angular ni de la API.
 */
export class usuario
{
    constructor
    (
        public readonly id: number,
        public readonly nombre: string,
        public readonly correo: string,
        public readonly roles: readonly string[],
    )
    {
    }

    tieneRol(rol: string): boolean
    {
        return this.roles.includes(rol);
    }
}
