import { respuestaSesionDto } from '../dto/respuestaSesion.dto';
import { sesion } from '../../dominio/entidades/sesion.entidad';
import { usuarioMapeador } from './usuario.mapeador';

/**
 * Traduce el DTO de la API a entidades de dominio.
 */
export class sesionMapeador
{
    static aDominio(dto: respuestaSesionDto): sesion
    {
        return new sesion(
            usuarioMapeador.aDominio(dto.usuario),
            dto.token,
            dto.expiraEnSegundos,
        );
    }
}
