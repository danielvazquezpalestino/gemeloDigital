import express = require('express');
import DtoInicioSesion = require('../../domain/entities/dtos/autenticacion/inicio-sesion.dto');
import DtoRegistroUsuario = require('../../domain/entities/dtos/autenticacion/registro-usuario.dto');
import ErrorPersonalizado = require('../../domain/datasources/errors/custom-error');
import RepositorioAutenticacion = require('../../domain/repositories/repositorio-autenticacion');
import Usuario = require('../../domain/entities/usuario.entidad');

/**
 * Manejo HTTP del módulo de autenticación.
 *
 * Traduce la petición al caso de uso correspondiente y responde siempre con
 * el formato `{ "mensaje": "..." }` en los errores. La contraseña cifrada
 * nunca sale en la respuesta.
 */
class ControladorAutenticacion
{
    constructor(private readonly repositorioAutenticacion: RepositorioAutenticacion)
    {
    }

    registrar = async (solicitud: express.Request, respuesta: express.Response) =>
    {
        const [error, dtoRegistroUsuario] = DtoRegistroUsuario.crear(solicitud.body);

        if (error || !dtoRegistroUsuario)
        {
            return respuesta.status(400).json({ mensaje: error ?? 'Los datos de registro son inválidos' });
        }

        try
        {
            const usuario = await this.repositorioAutenticacion.registrar(dtoRegistroUsuario);

            return respuesta.status(201).json({
                mensaje: 'Usuario registrado correctamente',
                usuario: ControladorAutenticacion.usuarioPublico(usuario),
            });
        }
        catch (excepcion)
        {
            return this.responderError(respuesta, excepcion, 'No se pudo registrar el usuario');
        }
    };

    iniciarSesion = async (solicitud: express.Request, respuesta: express.Response) =>
    {
        const [error, dtoInicioSesion] = DtoInicioSesion.crear(solicitud.body);

        if (error || !dtoInicioSesion)
        {
            return respuesta.status(400).json({ mensaje: error ?? 'Las credenciales son inválidas' });
        }

        try
        {
            const sesion = await this.repositorioAutenticacion.iniciarSesion(dtoInicioSesion);

            return respuesta.status(200).json({
                mensaje: 'Sesión iniciada correctamente',
                token: sesion.token,
                expiraEnSegundos: sesion.expiraEnSegundos,
                usuario: ControladorAutenticacion.usuarioPublico(sesion.usuario),
            });
        }
        catch (excepcion)
        {
            return this.responderError(respuesta, excepcion, 'No se pudo iniciar sesión');
        }
    };

    private responderError(respuesta: express.Response, excepcion: unknown, mensajeGenerico: string)
    {
        if (excepcion instanceof ErrorPersonalizado)
        {
            return respuesta.status(excepcion.codigoEstado).json({ mensaje: excepcion.message });
        }

        console.error('Error en el módulo de autenticación:', excepcion);

        return respuesta.status(500).json({ mensaje: mensajeGenerico });
    }

    private static usuarioPublico(usuario: Usuario)
    {
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            roles: usuario.roles,
        };
    }
}

export = ControladorAutenticacion;
