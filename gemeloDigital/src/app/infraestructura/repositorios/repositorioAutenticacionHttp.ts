import { inject, Injectable } from '@angular/core';
import { errorApi } from '../../dominio/errores/errorApi';
import { errorAutenticacion } from '../../dominio/errores/errorAutenticacion';
import { sesion } from '../../dominio/entidades/sesion.entidad';
import { usuario } from '../../dominio/entidades/usuario.entidad';
import { repositorioAutenticacion } from '../../aplicacion/puertos/repositorioAutenticacion';
import { respuestaRegistroDto } from '../dto/respuestaRegistro.dto';
import { respuestaSesionDto } from '../dto/respuestaSesion.dto';
import { clienteApi } from '../http/clienteApi';
import { sesionMapeador } from '../mapeadores/sesion.mapeador';
import { usuarioMapeador } from '../mapeadores/usuario.mapeador';

/**
 * Adaptador HTTP del puerto de autenticación.
 *
 * Traduce los errores de la API al error de dominio y devuelve siempre
 * entidades mapeadas, nunca DTO crudos.
 */
@Injectable({ providedIn: 'root' })
export class repositorioAutenticacionHttp extends repositorioAutenticacion
{
    private readonly cliente = inject(clienteApi);

    async registrar(nombre: string, correo: string, contrasenia: string): Promise<usuario>
    {
        try
        {
            const respuesta = await this.cliente.enviar<respuestaRegistroDto>(
                '/Auth/register',
                { nombre, correo, contrasenia },
                'No se pudo registrar el usuario',
            );

            return usuarioMapeador.aDominio(respuesta.usuario);
        }
        catch (excepcion)
        {
            throw this.traducirError(excepcion, 'No se pudo registrar el usuario');
        }
    }

    async iniciarSesion(correo: string, contrasenia: string): Promise<sesion>
    {
        try
        {
            const respuesta = await this.cliente.enviar<respuestaSesionDto>(
                '/Auth/login',
                { correo, contrasenia },
                'No se pudo iniciar sesión',
            );

            return sesionMapeador.aDominio(respuesta);
        }
        catch (excepcion)
        {
            throw this.traducirError(excepcion, 'No se pudo iniciar sesión');
        }
    }

    private traducirError(excepcion: unknown, mensajePorDefecto: string): errorAutenticacion
    {
        if (excepcion instanceof errorAutenticacion)
        {
            return excepcion;
        }

        if (excepcion instanceof errorApi)
        {
            return new errorAutenticacion(excepcion.message);
        }

        return new errorAutenticacion(mensajePorDefecto);
    }
}
