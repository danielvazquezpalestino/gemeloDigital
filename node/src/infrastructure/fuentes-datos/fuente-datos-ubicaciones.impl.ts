import mysql = require('mysql2/promise');
import pool = require('../../config/database');
import Municipio = require('../../domain/entidades/municipio.entidad');
import FuenteDatosUbicaciones = require('../../domain/fuentes-datos/fuente-datos-ubicaciones');
import CustomError = require('../../domain/datasources/errors/custom.error');

class FuenteDatosUbicacionesImpl extends FuenteDatosUbicaciones {
    async obtenerMunicipios(): Promise<Municipio[]> {
        try {
            // Catálogo fijo de los 217 municipios del estado de Puebla (INEGI).
            // No se reciben valores externos, por eso la consulta no lleva parámetros.
            const [filas] = await pool.query(
                'SELECT id, nombre, region FROM municipios ORDER BY nombre ASC',
            );

            return (filas as mysql.RowDataPacket[]).map(
                (fila) => new Municipio(Number(fila['id']), String(fila['nombre']), String(fila['region'])),
            );
        }
        catch (error) {
            if (error instanceof Error) {
                throw CustomError.internalServer(error.message);
            }

            throw CustomError.internalServer('No se pudo consultar el catálogo de municipios');
        }
    }
}

export = FuenteDatosUbicacionesImpl;
