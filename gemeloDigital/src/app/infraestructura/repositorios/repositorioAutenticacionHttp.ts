import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { errorAutenticacion } from '../../dominio/errores/errorAutenticacion';
import { repositorioAutenticacion } from '../../aplicacion/puertos/repositorioAutenticacion';
import { respuestaErrorDto } from '../dto/respuestaError.dto';
import { respuestaSesionDto } from '../dto/respuestaSesion.dto';
import { sesion } from '../../dominio/entidades/sesion.entidad';
import { sesionMapeador } from '../mapeadores/sesion.mapeador';
import { urlBaseApi } from '../../nucleo/configuracion/entorno';

/**
 * Adaptador HTTP del puerto de autenticación.
 *
 * Traduce los errores de la API al error de dominio y devuelve siempre
 * entidades mapeadas, nunca DTO crudos.
 */
@Injectable({ providedIn: 'root' })
export class repositorioAutenticacionHttp extends repositorioAutenticacion
{
    private readonly http = inject(HttpClient);
    private readonly urlBaseApi = inject(urlBaseApi);

    async iniciarSesion(correo: string, contrasenia: string): Promise<sesion>
    {
        try
        {
            const respuesta = await firstValueFrom(
                this.http.post<respuestaSesionDto>(`${this.urlBaseApi}/Auth/login`, { correo, contrasenia }),
            );

            return sesionMapeador.aDominio(respuesta);
        }
        catch (excepcion)
        {
            throw this.traducirError(excepcion);
        }
    }

    private traducirError(excepcion: unknown): errorAutenticacion
    {
        if (excepcion instanceof HttpErrorResponse)
        {
            if (excepcion.status === 0)
            {
                return new errorAutenticacion(
                    'No se pudo conectar con el servidor. Verifica que la API esté disponible.',
                );
            }

            return new errorAutenticacion(
                this.extraerMensaje(excepcion.error) ?? 'No se pudo iniciar sesión',
            );
        }

        return new errorAutenticacion('Ocurrió un error inesperado al iniciar sesión');
    }

    private extraerMensaje(cuerpo: unknown): string | null
    {
        if (typeof cuerpo !== 'object' || cuerpo === null)
        {
            return null;
        }

        const mensaje = (cuerpo as respuestaErrorDto).mensaje;

        return typeof mensaje === 'string' && mensaje.trim() !== '' ? mensaje : null;
    }
}
