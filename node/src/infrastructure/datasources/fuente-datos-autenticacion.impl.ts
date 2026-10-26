import mysql = require('mysql2/promise');
import ErrorPersonalizado = require('../../domain/datasources/errors/custom-error');
import FuenteDatosAutenticacion = require('../../domain/datasources/fuente-datos-autenticacion');
import Usuario = require('../../domain/entities/usuario.entidad');
import pool = require('../../config/database');

/**
 * Persistencia de usuarios sobre MySQL.
 *
 * Es la única clase del módulo que contiene SQL y todas las consultas usan
 * marcadores de posición.
 */
class FuenteDatosAutenticacionImpl implements FuenteDatosAutenticacion
{
    private static readonly COLUMNAS =
        'id, nombre, correo, contrasenia_cifrada, roles, fecha_creacion, fecha_actualizacion';

    async buscarPorCorreo(correo: string): Promise<Usuario | null>
    {
        try
        {
            const [filas] = await pool.execute<mysql.RowDataPacket[]>(
                `SELECT ${FuenteDatosAutenticacionImpl.COLUMNAS} FROM usuarios WHERE correo = ? LIMIT 1`,
                [correo],
            );

            const fila = filas[0];

            return fila ? FuenteDatosAutenticacionImpl.mapearFila(fila) : null;
        }
        catch (error)
        {
            throw FuenteDatosAutenticacionImpl.traducirError(error, 'No se pudo consultar el usuario');
        }
    }

    async insertar(usuario: Usuario): Promise<Usuario>
    {
        try
        {
            const [resultado] = await pool.execute<mysql.ResultSetHeader>(
                'INSERT INTO usuarios (nombre, correo, contrasenia_cifrada, roles) VALUES (?, ?, ?, ?)',
                [
                    usuario.nombre,
                    usuario.correo,
                    usuario.contraseniaCifrada,
                    JSON.stringify(usuario.roles),
                ],
            );

            return new Usuario(
                resultado.insertId,
                usuario.nombre,
                usuario.correo,
                usuario.contraseniaCifrada,
                usuario.roles,
            );
        }
        catch (error)
        {
            throw FuenteDatosAutenticacionImpl.traducirError(error, 'No se pudo registrar el usuario');
        }
    }

    private static mapearFila(fila: mysql.RowDataPacket): Usuario
    {
        return new Usuario(
            Number(fila['id']),
            String(fila['nombre']),
            String(fila['correo']),
            String(fila['contrasenia_cifrada']),
            FuenteDatosAutenticacionImpl.mapearRoles(fila['roles']),
            fila['fecha_creacion'] ? new Date(String(fila['fecha_creacion'])) : undefined,
            fila['fecha_actualizacion'] ? new Date(String(fila['fecha_actualizacion'])) : undefined,
        );
    }

    /**
     * MySQL devuelve las columnas JSON como texto u objeto según el driver.
     */
    private static mapearRoles(valor: unknown): string[]
    {
        if (Array.isArray(valor))
        {
            return valor.map((rol) => String(rol));
        }

        if (typeof valor === 'string')
        {
            try
            {
                const documento = JSON.parse(valor);

                return Array.isArray(documento) ? documento.map((rol) => String(rol)) : [];
            }
            catch
            {
                return [];
            }
        }

        return [];
    }

    private static traducirError(error: unknown, mensajeGenerico: string): ErrorPersonalizado
    {
        if (error instanceof ErrorPersonalizado)
        {
            return error;
        }

        const codigo = (error as { code?: string } | undefined)?.code;

        if (codigo === 'ER_DUP_ENTRY')
        {
            return ErrorPersonalizado.peticionIncorrecta('El correo electrónico ya está registrado');
        }

        console.error('Error al trabajar con los usuarios:', error);

        return ErrorPersonalizado.errorInterno(mensajeGenerico);
    }
}

export = FuenteDatosAutenticacionImpl;
