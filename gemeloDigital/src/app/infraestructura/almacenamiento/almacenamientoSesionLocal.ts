import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { almacenamientoSesion } from '../../aplicacion/puertos/almacenamientoSesion';
import { sesion } from '../../dominio/entidades/sesion.entidad';
import { usuario } from '../../dominio/entidades/usuario.entidad';

/**
 * Representación serializada de la sesión en `localStorage`.
 */
interface sesionGuardada
{
    readonly token: string;
    readonly expiraEnSegundos: number;
    readonly guardadaEn: number;
    readonly usuario: {
        readonly id: number;
        readonly nombre: string;
        readonly correo: string;
        readonly roles: readonly string[];
    };
}

/**
 * Adaptador de almacenamiento local.
 *
 * En el servidor (SSR/prerender) no hay `localStorage`, así que todas las
 * operaciones son seguras y devuelven vacío.
 */
@Injectable({ providedIn: 'root' })
export class almacenamientoSesionLocal extends almacenamientoSesion
{
    private static readonly CLAVE = 'gemeloDigital.sesion';
    private readonly plataforma = inject(PLATFORM_ID);

    guardar(sesion: sesion): void
    {
        if (!isPlatformBrowser(this.plataforma))
        {
            return;
        }

        const guardada: sesionGuardada = {
            token: sesion.token,
            expiraEnSegundos: sesion.expiraEnSegundos,
            guardadaEn: Date.now(),
            usuario: {
                id: sesion.usuario.id,
                nombre: sesion.usuario.nombre,
                correo: sesion.usuario.correo,
                roles: [...sesion.usuario.roles],
            },
        };

        try
        {
            localStorage.setItem(almacenamientoSesionLocal.CLAVE, JSON.stringify(guardada));
        }
        catch
        {
            // Si el navegador bloquea el almacenamiento, la sesión vive solo
            // en memoria y el guardia rechazará el acceso: no se fuerza nada.
        }
    }

    obtener(): sesion | null
    {
        const guardada = this.leer();

        if (!guardada)
        {
            return null;
        }

        if (!this.estaVigente(guardada))
        {
            this.eliminar();
            return null;
        }

        return new sesion(
            new usuario(
                guardada.usuario.id,
                guardada.usuario.nombre,
                guardada.usuario.correo,
                guardada.usuario.roles,
            ),
            guardada.token,
            guardada.expiraEnSegundos,
        );
    }

    obtenerToken(): string | null
    {
        return this.obtener()?.token ?? null;
    }

    eliminar(): void
    {
        if (!isPlatformBrowser(this.plataforma))
        {
            return;
        }

        try
        {
            localStorage.removeItem(almacenamientoSesionLocal.CLAVE);
        }
        catch
        {
            // Nada que hacer: el almacenamiento no está disponible.
        }
    }

    estaAutenticado(): boolean
    {
        return this.obtener() !== null;
    }

    private leer(): sesionGuardada | null
    {
        if (!isPlatformBrowser(this.plataforma))
        {
            return null;
        }

        let texto: string | null;

        try
        {
            texto = localStorage.getItem(almacenamientoSesionLocal.CLAVE);
        }
        catch
        {
            return null;
        }

        if (!texto)
        {
            return null;
        }

        try
        {
            const valor: unknown = JSON.parse(texto);

            return this.esSesionGuardada(valor) ? valor : null;
        }
        catch
        {
            return null;
        }
    }

    private estaVigente(guardada: sesionGuardada): boolean
    {
        return guardada.guardadaEn + guardada.expiraEnSegundos * 1000 > Date.now();
    }

    private esSesionGuardada(valor: unknown): valor is sesionGuardada
    {
        if (typeof valor !== 'object' || valor === null)
        {
            return false;
        }

        const candidata = valor as Record<string, unknown>;
        const usuarioGuardado = candidata['usuario'];

        return typeof candidata['token'] === 'string'
            && typeof candidata['expiraEnSegundos'] === 'number'
            && typeof candidata['guardadaEn'] === 'number'
            && typeof usuarioGuardado === 'object'
            && usuarioGuardado !== null
            && typeof (usuarioGuardado as Record<string, unknown>)['id'] === 'number'
            && typeof (usuarioGuardado as Record<string, unknown>)['nombre'] === 'string'
            && typeof (usuarioGuardado as Record<string, unknown>)['correo'] === 'string'
            && Array.isArray((usuarioGuardado as Record<string, unknown>)['roles']);
    }
}
