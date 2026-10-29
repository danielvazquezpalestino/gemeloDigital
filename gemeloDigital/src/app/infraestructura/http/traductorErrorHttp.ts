import { HttpErrorResponse } from '@angular/common/http';
import { errorApi } from '../../dominio/errores/errorApi';
import { respuestaErrorDto } from '../dto/respuestaError.dto';

/**
 * Traduce las excepciones de `HttpClient` a errores de dominio.
 */
export class traductorErrorHttp
{
    static traducir(excepcion: unknown, mensajePorDefecto: string): errorApi
    {
        if (excepcion instanceof errorApi)
        {
            return excepcion;
        }

        if (excepcion instanceof HttpErrorResponse)
        {
            if (excepcion.status === 0)
            {
                return new errorApi(
                    'No se pudo conectar con el servidor. Verifica que la API esté disponible.',
                    0,
                );
            }

            return new errorApi(
                traductorErrorHttp.extraerMensaje(excepcion.error) ?? mensajePorDefecto,
                excepcion.status,
            );
        }

        return new errorApi(mensajePorDefecto);
    }

    private static extraerMensaje(cuerpo: unknown): string | null
    {
        if (typeof cuerpo !== 'object' || cuerpo === null)
        {
            return null;
        }

        const mensaje = (cuerpo as respuestaErrorDto).mensaje;

        return typeof mensaje === 'string' && mensaje.trim() !== '' ? mensaje : null;
    }
}
