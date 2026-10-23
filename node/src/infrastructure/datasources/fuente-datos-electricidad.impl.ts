import BloqueConsumoTarifa = require('../../domain/entities/bloque-consumo-tarifa.entidad');
import FuenteDatosElectricidad = require('../../domain/datasources/fuente-datos-electricidad');
import pool = require('../../config/database');
import TarifaElectrica = require('../../domain/entities/tarifa-electrica.entidad');

interface FilaTarifa
{
    codigo: string;
    nombre: string;
    descripcion: string;
    tipo_usuario: string;
    es_demostracion: boolean | number | string;
    bloque_id: number | string | null;
    hasta_kwh: string | number | null;
    precio_kwh: string | number | null;
}

interface TarifaAgrupada
{
    codigo: string;
    nombre: string;
    descripcion: string;
    tipoUsuario: string;
    esDemostracion: boolean;
    bloques: BloqueConsumoTarifa[];
}

/**
 * Fuente de datos de las tarifas eléctricas.
 *
 * Intenta leer el catálogo desde MySQL. Si la tabla no existe, está vacía o
 * ocurre un error de conexión, devuelve el catálogo formal en memoria para que
 * los endpoints sigan funcionando. Todos los precios del catálogo en memoria
 * son DATOS DE DEMOSTRACIÓN, no tarifas oficiales de la CFE.
 */
class FuenteDatosElectricidadImpl extends FuenteDatosElectricidad
{
    private static readonly ORDEN_CATALOGO = ['PDBT', 'DAC', 'GDBT'];

    private static readonly CONSULTA_TARIFAS = `
        SELECT
            t.codigo,
            t.nombre,
            t.descripcion,
            t.tipo_usuario,
            t.es_demostracion,
            b.id AS bloque_id,
            b.hasta_kwh,
            b.precio_kwh
        FROM tarifas_electricas AS t
        LEFT JOIN bloques_consumo_tarifa AS b
            ON b.tarifa_codigo = t.codigo
        ORDER BY t.codigo ASC, b.orden ASC
    `;

    async listarTarifas(): Promise<TarifaElectrica[]>
    {
        try
        {
            const [filas] = await pool.query(FuenteDatosElectricidadImpl.CONSULTA_TARIFAS);
            const tarifas = this.mapearTarifas(filas as unknown as FilaTarifa[]);

            if (tarifas.length > 0)
            {
                return tarifas;
            }

            console.warn('No hay tarifas eléctricas en MySQL; se usa el catálogo formal en memoria');
        }
        catch (error)
        {
            const detalle = error instanceof Error ? error.message : String(error);
            console.error(
                `No se pudieron leer las tarifas eléctricas de MySQL; se usa el catálogo formal en memoria: ${detalle}`,
            );
        }

        return this.obtenerCatalogoFormal();
    }

    async buscarTarifa(codigo: string): Promise<TarifaElectrica | null>
    {
        const normalizado = codigo.trim().toUpperCase();
        const tarifas = await this.listarTarifas();

        return tarifas.find((tarifa) => tarifa.codigo === normalizado) ?? null;
    }

    private mapearTarifas(filas: readonly FilaTarifa[]): TarifaElectrica[]
    {
        const agrupadas = new Map<string, TarifaAgrupada>();

        for (const fila of filas)
        {
            let tarifa = agrupadas.get(fila.codigo);

            if (!tarifa)
            {
                tarifa = {
                    codigo: fila.codigo,
                    nombre: fila.nombre,
                    descripcion: fila.descripcion,
                    tipoUsuario: fila.tipo_usuario,
                    esDemostracion: FuenteDatosElectricidadImpl.comoBooleano(fila.es_demostracion),
                    bloques: [],
                };
                agrupadas.set(fila.codigo, tarifa);
            }

            if (fila.bloque_id !== null && fila.precio_kwh !== null)
            {
                tarifa.bloques.push(new BloqueConsumoTarifa(
                    fila.hasta_kwh === null ? null : Number(fila.hasta_kwh),
                    Number(fila.precio_kwh),
                ));
            }
        }

        return [...agrupadas.values()]
            .filter((tarifa) => tarifa.bloques.length > 0)
            .sort((primera, segunda) =>
                FuenteDatosElectricidadImpl.posicionCatalogo(primera.codigo)
                - FuenteDatosElectricidadImpl.posicionCatalogo(segunda.codigo))
            .map((tarifa) => new TarifaElectrica(
                tarifa.codigo,
                tarifa.nombre,
                tarifa.descripcion,
                tarifa.tipoUsuario,
                tarifa.bloques,
                tarifa.esDemostracion,
            ));
    }

    private obtenerCatalogoFormal(): TarifaElectrica[]
    {
        return [
            new TarifaElectrica(
                'PDBT',
                'Tarifa doméstica de demostración',
                'Tarifa plana de baja tensión con bloques de consumo. Datos de demostración, no oficiales.',
                'HOGAR',
                [
                    new BloqueConsumoTarifa(75, 1.05),
                    new BloqueConsumoTarifa(125, 1.25),
                    new BloqueConsumoTarifa(null, 1.45),
                ],
                true,
            ),
            new TarifaElectrica(
                'DAC',
                'Tarifa de alto consumo de demostración',
                'Tarifa de alto consumo con precio único. Datos de demostración, no oficiales.',
                'HOGAR',
                [
                    new BloqueConsumoTarifa(null, 2.1),
                ],
                true,
            ),
            new TarifaElectrica(
                'GDBT',
                'Tarifa general de baja tensión de demostración',
                'Tarifa general por bloques para pequeños comercios. Datos de demostración, no oficiales.',
                'COMERCIO',
                [
                    new BloqueConsumoTarifa(100, 1.1),
                    new BloqueConsumoTarifa(null, 1.6),
                ],
                true,
            ),
        ];
    }

    private static comoBooleano(valor: boolean | number | string): boolean
    {
        return valor === true || Number(valor) === 1;
    }

    private static posicionCatalogo(codigo: string): number
    {
        const posicion = FuenteDatosElectricidadImpl.ORDEN_CATALOGO.indexOf(codigo);

        return posicion === -1 ? Number.MAX_SAFE_INTEGER : posicion;
    }
}

export = FuenteDatosElectricidadImpl;
