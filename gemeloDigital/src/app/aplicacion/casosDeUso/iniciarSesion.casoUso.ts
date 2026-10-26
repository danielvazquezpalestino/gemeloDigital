import { inject, Injectable } from '@angular/core';
import { almacenamientoSesion } from '../puertos/almacenamientoSesion';
import { errorAutenticacion } from '../../dominio/errores/errorAutenticacion';
import { repositorioAutenticacion } from '../puertos/repositorioAutenticacion';
import { sesion } from '../../dominio/entidades/sesion.entidad';

/**
 * Caso de uso: iniciar sesión.
 *
 * Normaliza el correo, delega la validación de credenciales en el puerto y
 * persiste la sesión resultante.
 */
@Injectable({ providedIn: 'root' })
export class iniciarSesion
{
    private readonly repositorio = inject(repositorioAutenticacion);
    private readonly almacenamiento = inject(almacenamientoSesion);

    async ejecutar(correo: string, contrasenia: string): Promise<sesion>
    {
        const correoNormalizado = correo.trim().toLowerCase();

        if (correoNormalizado === '' || contrasenia === '')
        {
            throw new errorAutenticacion('El correo electrónico y la contraseña son obligatorios');
        }

        const sesionIniciada = await this.repositorio.iniciarSesion(correoNormalizado, contrasenia);
        this.almacenamiento.guardar(sesionIniciada);

        return sesionIniciada;
    }
}
