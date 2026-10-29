import { usuario } from '../../dominio/entidades/usuario.entidad';
import { usuarioDto } from '../dto/usuario.dto';

/**
 * Traduce el DTO público de usuario a la entidad de dominio.
 */
export class usuarioMapeador
{
    static aDominio(dto: usuarioDto): usuario
    {
        return new usuario(dto.id, dto.nombre, dto.correo, dto.roles);
    }
}
