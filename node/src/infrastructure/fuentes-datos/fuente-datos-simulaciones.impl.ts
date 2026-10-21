import mysql = require('mysql2/promise');
import ErrorPersonalizado = require('../../domain/fuentes-datos/errores/error-personalizado');
import FuenteDatosSimulaciones = require('../../domain/fuentes-datos/fuente-datos-simulaciones');
import Simulacion = require('../../domain/entidades/simulacion.entidad');
import TipoTarifa = require('../../domain/entidades/tipo-tarifa');
import pool = require('../../config/database');

/**
 * Implementación de la persistencia de simulaciones sobre MySQL.
 *
 * Es la única capa del módulo que contiene SQL. Todas las consultas usan
 * marcadores de posición (`?`), nunca concatenación de valores.
 */
class FuenteDatosSimulacionesImpl implements FuenteDatosSimulaciones
{
    private static readonly COLUMNAS =
        'id, municipio_id, consumo_kwh, tarifa_cfe, area_disponible_m2, tipo_tarifa, ' +
        'incluye_baterias, paneles_necesarios, produccion_anual, ahorro_estimado, ' +
        'costo_inversion_total, retorno_inversion_anios, advertencias, fecha_creacion, fecha_actualizacion';

    async insertar(simulacion: Simulacion): Promise<Simulacion>
    {
        try
        {
            const [resultado] = await pool.execute<mysql.ResultSetHeader>
            (
                'INSERT INTO simulaciones ' +
                '(municipio_id, consumo_kwh, tarifa_cfe, area_disponible_m2, tipo_tarifa, incluye_baterias, ' +
                'paneles_necesarios, produccion_anual, ahorro_estimado, costo_inversion_total, ' +
                'retorno_inversion_anios, advertencias) ' +
                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    simulacion.municipioId,
                    simulacion.consumoKwh,
                    simulacion.tarifaCfe,
                    simulacion.areaDisponibleM2,
                    simulacion.tipoTarifa,
                    simulacion.incluyeBaterias,
                    simulacion.panelesNecesarios,
                    simulacion.produccionAnual,
                    simulacion.ahorroEstimado,
                    simulacion.costoInversionTotal,
                    simulacion.retornoInversionAnios,
                    JSON.stringify(simulacion.advertencias)
                ]
            );

            const insertada = await this.buscarPorId(resultado.insertId);

            if (!insertada)
            {
                throw ErrorPersonalizado.errorInterno('No se pudo recuperar la simulación guardada');
            }

            return insertada;
        }
        catch (error)
        {
            throw this.traducirError(error, 'No se pudo guardar la simulación solar');
        }
    }

    async buscarPorId(id: number): Promise<Simulacion | null>
    {
        try
        {
            const [filas] = await pool.execute<mysql.RowDataPacket[]>
            (
                `SELECT ${FuenteDatosSimulacionesImpl.COLUMNAS} FROM simulaciones WHERE id = ?`,
                [id]
            );

            const fila = filas[0];

            return fila ? FuenteDatosSimulacionesImpl.mapearFila(fila) : null;
        }
        catch (error)
        {
            throw this.traducirError(error, 'No se pudo consultar la simulación solar');
        }
    }

    async listar(municipioId: number | null, limite: number, desplazamiento: number): Promise<Simulacion[]>
    {
        try
        {
            const condiciones = municipioId === null ? '' : 'WHERE municipio_id = ?';
            const parametros = municipioId === null ? [limite, desplazamiento] : [municipioId, limite, desplazamiento];

            const [filas] = await pool.execute<mysql.RowDataPacket[]>
            (
                `SELECT ${FuenteDatosSimulacionesImpl.COLUMNAS} FROM simulaciones ${condiciones} ` +
                'ORDER BY fecha_creacion DESC, id DESC LIMIT ? OFFSET ?',
                parametros
            );

            return filas.map((fila) => FuenteDatosSimulacionesImpl.mapearFila(fila));
        }
        catch (error)
        {
            throw this.traducirError(error, 'No se pudo obtener el historial de simulaciones');
        }
    }

    async contar(municipioId: number | null): Promise<number>
    {
        try
        {
            const condiciones = municipioId === null ? '' : 'WHERE municipio_id = ?';
            const parametros = municipioId === null ? [] : [municipioId];

            const [filas] = await pool.execute<mysql.RowDataPacket[]>
            (
                `SELECT COUNT(*) AS total FROM simulaciones ${condiciones}`,
                parametros
            );

            return Number(filas[0]?.['total'] ?? 0);
        }
        catch (error)
        {
            throw this.traducirError(error, 'No se pudo obtener el total de simulaciones');
        }
    }

    async actualizar(simulacion: Simulacion): Promise<Simulacion>
    {
        try
        {
            // `fecha_actualizacion` no se incluye en el SET para que MySQL la
            // actualice sola mediante ON UPDATE CURRENT_TIMESTAMP.
            const [resultado] = await pool.execute<mysql.ResultSetHeader>
            (
                'UPDATE simulaciones SET ' +
                'municipio_id = ?, consumo_kwh = ?, tarifa_cfe = ?, area_disponible_m2 = ?, ' +
                'tipo_tarifa = ?, incluye_baterias = ?, paneles_necesarios = ?, produccion_anual = ?, ' +
                'ahorro_estimado = ?, costo_inversion_total = ?, retorno_inversion_anios = ?, advertencias = ? ' +
                'WHERE id = ?',
                [
                    simulacion.municipioId,
                    simulacion.consumoKwh,
                    simulacion.tarifaCfe,
                    simulacion.areaDisponibleM2,
                    simulacion.tipoTarifa,
                    simulacion.incluyeBaterias,
                    simulacion.panelesNecesarios,
                    simulacion.produccionAnual,
                    simulacion.ahorroEstimado,
                    simulacion.costoInversionTotal,
                    simulacion.retornoInversionAnios,
                    JSON.stringify(simulacion.advertencias),
                    simulacion.id
                ]
            );

            if (resultado.affectedRows === 0)
            {
                throw ErrorPersonalizado.noEncontrado('La simulación solicitada no existe');
            }

            const actualizada = await this.buscarPorId(simulacion.id);

            if (!actualizada)
            {
                throw ErrorPersonalizado.errorInterno('No se pudo recuperar la simulación actualizada');
            }

            return actualizada;
        }
        catch (error)
        {
            throw this.traducirError(error, 'No se pudo recalcular la simulación solar');
        }
    }

    async eliminarPorId(id: number): Promise<boolean>
    {
        try
        {
            const [resultado] = await pool.execute<mysql.ResultSetHeader>
            (
                'DELETE FROM simulaciones WHERE id = ?',
                [id]
            );

            return resultado.affectedRows > 0;
        }
        catch (error)
        {
            throw this.traducirError(error, 'No se pudo eliminar la simulación solar');
        }
    }

    /**
     * Convierte una fila de MySQL en la entidad de dominio.
     * MySQL entrega los DECIMAL como texto, por eso se convierten a número.
     */
    private static mapearFila(fila: mysql.RowDataPacket): Simulacion
    {
        return new Simulacion(
            Number(fila['id']),
            Number(fila['municipio_id']),
            Number(fila['consumo_kwh']),
            Number(fila['tarifa_cfe']),
            fila['area_disponible_m2'] === null ? null : Number(fila['area_disponible_m2']),
            fila['tipo_tarifa'] as TipoTarifa,
            Boolean(fila['incluye_baterias']),
            Number(fila['paneles_necesarios']),
            Number(fila['produccion_anual']),
            Number(fila['ahorro_estimado']),
            Number(fila['costo_inversion_total']),
            Number(fila['retorno_inversion_anios']),
            FuenteDatosSimulacionesImpl.mapearAdvertencias(fila['advertencias']),
            new Date(fila['fecha_creacion']),
            new Date(fila['fecha_actualizacion']),
        );
    }

    private static mapearAdvertencias(valor: unknown): string[]
    {
        if (typeof valor !== 'string' || valor.trim() === '')
        {
            return [];
        }

        try
        {
            const advertencias = JSON.parse(valor);

            return Array.isArray(advertencias) ? advertencias.map((advertencia) => String(advertencia)) : [];
        }
        catch
        {
            return [];
        }
    }

    /**
     * Traduce los errores de MySQL a errores de negocio comprensibles.
     */
    private traducirError(error: unknown, mensajeGenerico: string): ErrorPersonalizado
    {
        if (error instanceof ErrorPersonalizado)
        {
            return error;
        }

        const codigo = (error as { code?: string } | undefined)?.code;

        if (codigo === 'ER_NO_REFERENCED_ROW_2' || codigo === 'ER_NO_REFERENCED_ROW')
        {
            return ErrorPersonalizado.peticionIncorrecta('El municipio indicado no existe');
        }

        if (codigo === 'ER_ROW_IS_REFERENCED_2' || codigo === 'ER_ROW_IS_REFERENCED')
        {
            return ErrorPersonalizado.peticionIncorrecta('La simulación está siendo usada por otro registro');
        }

        console.error('Error al trabajar con las simulaciones solares:', error);

        return ErrorPersonalizado.errorInterno(mensajeGenerico);
    }
}

export = FuenteDatosSimulacionesImpl;
