import DtoFiltrarPaneles = require('../../domain/entities/dtos/paneles/filtrar-paneles.dto');
import FuenteDatosPaneles = require('../../domain/datasources/fuente-datos-paneles');
import PanelSolar = require('../../domain/entities/panel-solar.entidad');
import pool = require('../../config/database');

interface FilaPanel
{
    id: string;
    fabricante: string;
    modelo: string;
    potencia_watts: string | number;
    eficiencia_porcentaje: string | number;
    tecnologia: string;
    garantia_anios: string | number;
    ancho_metros: string | number;
    alto_metros: string | number;
    descripcion: string;
    es_demostracion: boolean | number | string;
}

interface ConteoPaneles
{
    total: string | number;
}

/**
 * Fuente de datos del catálogo de paneles solares.
 *
 * Intenta leer la tabla `paneles_solares` de MySQL. Si la tabla no existe, está
 * vacía o la consulta falla, devuelve el catálogo formal en memoria. Los
 * fabricantes y modelos del catálogo son FICTICIOS y se identifican como datos
 * de demostración.
 */
class FuenteDatosPanelesImpl extends FuenteDatosPaneles
{
    private readonly paneles: readonly PanelSolar[] =
    [
        new PanelSolar(
            'DEMO-PANEL-001',
            'Fabricante Demo Uno',
            'FD-450M',
            450,
            20.5,
            'Monocristalino',
            12,
            1.13,
            1.76,
            'Panel de demostración para pruebas del gemelo digital.',
            true,
        ),
        new PanelSolar(
            'DEMO-PANEL-002',
            'Fabricante Demo Uno',
            'FD-550M',
            550,
            21.3,
            'Monocristalino',
            12,
            1.13,
            2.09,
            'Panel de demostración de mayor potencia.',
            true,
        ),
        new PanelSolar(
            'DEMO-PANEL-003',
            'Fabricante Demo Dos',
            'FDD-400P',
            400,
            19.2,
            'Policristalino',
            10,
            1.05,
            1.95,
            'Panel de demostración de tecnología policristalina.',
            true,
        ),
    ];

    async listar(filtros: DtoFiltrarPaneles): Promise<PanelSolar[]>
    {
        const { consulta, parametros } = this.construirConsulta(filtros);

        try
        {
            const [filas] = await pool.query(consulta, parametros);
            const paneles = this.mapearPaneles(filas as unknown as FilaPanel[]);

            if (paneles.length > 0)
            {
                return paneles;
            }

            // Una lista vacía puede significar que el filtro no encontró
            // coincidencias. Solo se usa el fallback si la tabla está vacía.
            const [conteo] = await pool.query('SELECT COUNT(*) AS total FROM paneles_solares');
            const total = Number((conteo as unknown as ConteoPaneles[])[0]?.total ?? 0);

            if (total === 0)
            {
                console.warn('No hay paneles solares en MySQL; se usa el catálogo formal en memoria');
                return this.filtrarCatalogo(filtros);
            }

            return [];
        }
        catch (error)
        {
            const detalle = error instanceof Error ? error.message : String(error);
            console.error(
                `No se pudieron leer los paneles solares de MySQL; se usa el catálogo formal en memoria: ${detalle}`,
            );

            return this.filtrarCatalogo(filtros);
        }
    }

    private construirConsulta(filtros: DtoFiltrarPaneles): { consulta: string; parametros: unknown[] }
    {
        const condiciones: string[] = [];
        const parametros: unknown[] = [];

        if (filtros.fabricante !== undefined)
        {
            condiciones.push('fabricante LIKE ?');
            parametros.push(`%${filtros.fabricante}%`);
        }

        if (filtros.potenciaMinimaWatts !== undefined)
        {
            condiciones.push('potencia_watts >= ?');
            parametros.push(filtros.potenciaMinimaWatts);
        }

        const filtro = condiciones.length > 0
            ? `WHERE ${condiciones.join(' AND ')}`
            : '';

        const consulta = `
            SELECT
                id,
                fabricante,
                modelo,
                potencia_watts,
                eficiencia_porcentaje,
                tecnologia,
                garantia_anios,
                ancho_metros,
                alto_metros,
                descripcion,
                es_demostracion
            FROM paneles_solares
            ${filtro}
            ORDER BY potencia_watts ASC, id ASC
        `;

        return { consulta, parametros };
    }

    private mapearPaneles(filas: readonly FilaPanel[]): PanelSolar[]
    {
        return filas.map((fila) => new PanelSolar(
            fila.id,
            fila.fabricante,
            fila.modelo,
            Number(fila.potencia_watts),
            Number(fila.eficiencia_porcentaje),
            fila.tecnologia,
            Number(fila.garantia_anios),
            Number(fila.ancho_metros),
            Number(fila.alto_metros),
            fila.descripcion,
            FuenteDatosPanelesImpl.comoBooleano(fila.es_demostracion),
        ));
    }

    private filtrarCatalogo(filtros: DtoFiltrarPaneles): PanelSolar[]
    {
        const fabricante = filtros.fabricante?.toLowerCase();

        return this.paneles.filter((panel) =>
        {
            if (fabricante && !panel.fabricante.toLowerCase().includes(fabricante))
            {
                return false;
            }

            if (
                filtros.potenciaMinimaWatts !== undefined
                && panel.potenciaWatts < filtros.potenciaMinimaWatts
            )
            {
                return false;
            }

            return true;
        }).sort((primero, segundo) =>
            primero.potenciaWatts - segundo.potenciaWatts
            || primero.id.localeCompare(segundo.id));
    }

    private static comoBooleano(valor: boolean | number | string): boolean
    {
        return valor === true || Number(valor) === 1;
    }
}

export = FuenteDatosPanelesImpl;
