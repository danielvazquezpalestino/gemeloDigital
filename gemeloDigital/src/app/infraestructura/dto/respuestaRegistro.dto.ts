import { usuarioDto } from './usuario.dto';

/**
 * DTO de la respuesta de `POST /api/Auth/register`.
 */
export interface respuestaRegistroDto
{
    readonly mensaje: string;
    readonly usuario: usuarioDto;
}
