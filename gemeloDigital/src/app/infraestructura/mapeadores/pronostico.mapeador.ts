import { pronostico } from '../../dominio/entidades/pronostico.entidad';
import { registroMeteorologico } from '../../dominio/entidades/registroMeteorologico.entidad';
import { respuestaPronosticoDto } from '../dto/respuestaPronostico.dto';
import { fechaMapeador } from './fecha.mapeador';

/**
 * Traduce el DTO del pronóstico a entidades de dominio.
 */
export class pronosticoMapeador
{
    static aDominio(dto: respuestaPronosticoDto): pronostico
    {
        const pronosticoDto = dto.pronostico;

        return new pronostico(
            pronosticoDto.proveedor,
            pronosticoDto.latitud,
            pronosticoDto.longitud,
            pronosticoDto.dias,
            pronosticoDto.zonaHoraria,
            fechaMapeador.aFecha(pronosticoDto.fechaConsulta),
            pronosticoDto.registros.map(
                (registro) => new registroMeteorologico(
                    fechaMapeador.aFecha(registro.fecha),
                    registro.temperatura,
                    registro.nubosidad,
                    registro.precipitacion,
                    registro.radiacionSolar,
                ),
            ),
        );
    }
}
