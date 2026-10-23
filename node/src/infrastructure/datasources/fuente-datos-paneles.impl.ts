import DtoFiltrarPaneles = require('../../domain/entities/dtos/paneles/filtrar-paneles.dto');
import FuenteDatosPaneles = require('../../domain/datasources/fuente-datos-paneles');
import PanelSolar = require('../../domain/entities/panel-solar.entidad');

/**
 * Catálogo configurable de paneles.
 *
 * Los fabricantes y modelos son FICTICIOS y se identifican como datos de
 * demostración. No representan productos reales verificados.
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
        const fabricante = filtros.fabricante?.toLowerCase();

        return this.paneles.filter((panel) =>
        {
            if (fabricante && panel.fabricante.toLowerCase() !== fabricante)
            {
                return false;
            }

            if (filtros.potenciaMinimaWatts !== undefined && panel.potenciaWatts < filtros.potenciaMinimaWatts)
            {
                return false;
            }

            return true;
        });
    }
}

export = FuenteDatosPanelesImpl;
