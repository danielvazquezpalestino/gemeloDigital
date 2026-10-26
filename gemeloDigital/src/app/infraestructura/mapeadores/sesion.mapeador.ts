import { respuestaSesionDto } from '../dto/respuestaSesion.dto';
import { sesion } from '../../dominio/entidades/sesion.entidad';
import { usuario } from '../../dominio/entidades/usuario.entidad';

/**
 * Traduce el DTO de la API a entidades de dominio.
 */
export class sesionMapeador
{
    static aDominio(dto: respuestaSesionDto): sesion
    {
        return new sesion(
            new usuario(
                dto.usuario.id,
                dto.usuario.nombre,
                dto.usuario.correo,
                dto.usuario.roles,
            ),
            dto.token,
            dto.expiraEnSegundos,
        );
    }
}
