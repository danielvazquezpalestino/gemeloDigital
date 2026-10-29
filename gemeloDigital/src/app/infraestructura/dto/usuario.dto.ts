/**
 * DTO del usuario público que devuelve la API.
 */
export interface usuarioDto
{
    readonly id: number;
    readonly nombre: string;
    readonly correo: string;
    readonly roles: readonly string[];
}
