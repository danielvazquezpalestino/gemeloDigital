import mysql = require('mysql2/promise');
import ErrorPersonalizado = require('../../domain/datasources/errors/custom-error');
import FuenteDatosIncentivos = require('../../domain/datasources/fuente-datos-incentivos');
import Incentivo = require('../../domain/entities/incentivo.entidad');
import BeneficioIncentivo = require('../../domain/entities/beneficio-incentivo.entidad');
import RequisitoIncentivo = require('../../domain/entities/requisito-incentivo.entidad');
import EstadoIncentivo = require('../../domain/entities/estado-incentivo');
import pool = require('../../config/database');

/**
 * Implementación de la persistencia de incentivos sobre MySQL.
 *
 * Es la única capa del módulo que contiene SQL. Todas las consultas usan
 * marcadores de posición (`?`), nunca concatenación de valores.
 */
class FuenteDatosIncentivosImpl implements FuenteDatosIncentivos
{
    private static readonly COLUMNAS =
        'id, programa, nombre, descripcion, beneficiarios, municipio_id, requisitos, ' +
        'beneficios, vigencia_desde, vigencia_hasta, organismo_responsable, fuente_oficial, estado_verificacion';

    async listar(municipioId: number | null): Promise<Incentivo[]>
    {
        try
        {
            const condiciones = municipioId === null ? '' : 'WHERE municipio_id = ?';
            const [filas] = await pool.execute<mysql.RowDataPacket[]>
            (
                `SELECT ${FuenteDatosIncentivosImpl.COLUMNAS} FROM incentivos ${condiciones}`,
                municipioId === null ? [] : [municipioId],
            );

            return filas.map((fila) => FuenteDatosIncentivosImpl.mapearFila(fila));
        }
        catch (error)
        {
            throw FuenteDatosIncentivosImpl.traducirError(error, 'No se pudo obtener los incentivos');
        }
    }

    async contar(municipioId: number | null): Promise<number>
    {
        try
        {
            const condiciones = municipioId === null ? '' : 'WHERE municipio_id = ?';
            const [filas] = await pool.execute<mysql.RowDataPacket[]>
            (
                `SELECT COUNT(*) AS total FROM incentivos ${condiciones}`,
                municipioId === null ? [] : [municipioId],
            );

            return Number(filas[0]?.['total'] ?? 0);
        }
        catch (error)
        {
            throw FuenteDatosIncentivosImpl.traducirError(error, 'No se pudo obtener el total de incentivos');
        }
    }

    /**
     * Convierte una fila de MySQL en la entidad de dominio.
     *
     * Las columnas JSON se devuelven como texto u objeto según el driver, por
     * eso se normaliza antes de armar el dominio.
     */
    private static mapearFila(fila: mysql.RowDataPacket): Incentivo
    {
        const requisitos = FuenteDatosIncentivosImpl.mapearRequisitos(fila['requisitos']);
        const beneficios = FuenteDatosIncentivosImpl.mapearBeneficios(fila['beneficios']);

        const beneficiarios = FuenteDatosIncentivosImpl.mapearBeneficiarios(fila['beneficiarios']);

        return new Incentivo(
            Number(fila['id']),
            String(fila['programa'] ?? ''),
            String(fila['nombre'] ?? ''),
            String(fila['descripcion'] ?? ''),
            beneficiarios,
            fila['municipio_id'] === null || fila['municipio_id'] === undefined ? null : Number(fila['municipio_id']),
            requisitos,
            beneficios,
            fila['vigencia_desde'] ? new Date(String(fila['vigencia_desde'])) : null,
            fila['vigencia_hasta'] ? new Date(String(fila['vigencia_hasta'])) : null,
            fila['organismo_responsable'] ? String(fila['organismo_responsable']) : null,
            fila['fuente_oficial'] ? String(fila['fuente_oficial']) : null,
            FuenteDatosIncentivosImpl.esVerificado(fila['estado_verificacion']),
        );
    }

    private static mapearRequisitos(valor: unknown): RequisitoIncentivo[]
    {
        const documento = FuenteDatosIncentivosImpl.leerJson(valor);

        if (!Array.isArray(documento))
        {
            return [];
        }

        return documento.map((item) =>
        {
            const requisito = (typeof item === 'object' && item !== null ? item as { [clave: string]: unknown } : {}) as { [clave: string]: unknown };

            return new RequisitoIncentivo(
                String(requisito['campo'] ?? ''),
                String(requisito['descripcion'] ?? ''),
                Boolean(requisito['verificado']),
                Boolean(requisito['requerido']),
                requisito['valor'] === null || requisito['valor'] === undefined ? null : Number(requisito['valor']),
            );
        });
    }

    private static mapearBeneficios(valor: unknown): BeneficioIncentivo[]
    {
        const documento = FuenteDatosIncentivosImpl.leerJson(valor);

        if (!Array.isArray(documento))
        {
            return [];
        }

        return documento.map((item) =>
        {
            const beneficio = (typeof item === 'object' && item !== null ? item as { [clave: string]: unknown } : {}) as { [clave: string]: unknown };

            return new BeneficioIncentivo(
                String(beneficio['tipo'] ?? ''),
                beneficio['monto'] === null || beneficio['monto'] === undefined ? null : Number(beneficio['monto']),
                beneficio['porcentaje'] === null || beneficio['porcentaje'] === undefined ? null : Number(beneficio['porcentaje']),
                String(beneficio['moneda'] ?? 'MXN'),
            );
        });
    }

    private static mapearBeneficiarios(valor: unknown): string[]
    {
        const documento = FuenteDatosIncentivosImpl.leerJson(valor);

        if (!Array.isArray(documento))
        {
            return [];
        }

        return documento.map((beneficiario) => String(beneficiario));
    }

    private static leerJson(valor: unknown): unknown[]
    {
        if (typeof valor === 'string')
        {
            try
            {
                const documento = JSON.parse(valor);

                return Array.isArray(documento) ? documento : [];
            }
            catch
            {
                return [];
            }
        }

        if (Array.isArray(valor))
        {
            return valor;
        }

        return [];
    }

    private static esVerificado(valor: unknown): boolean
    {
        return valor === 'verified' || valor === 1 || valor === true;
    }

    private static traducirError(error: unknown, mensajeGenerico: string): ErrorPersonalizado
    {
        if (error instanceof ErrorPersonalizado)
        {
            return error;
        }

        console.error('Error al trabajar con los incentivos:', error);

        return ErrorPersonalizado.errorInterno(mensajeGenerico);
    }
}

export = FuenteDatosIncentivosImpl;
