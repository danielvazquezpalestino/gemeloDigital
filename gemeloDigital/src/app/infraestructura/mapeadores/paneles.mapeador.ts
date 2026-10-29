import { catalogoPaneles } from '../../dominio/entidades/catalogoPaneles.entidad';
import { panelSolar } from '../../dominio/entidades/panelSolar.entidad';
import { respuestaPanelesDto } from '../dto/respuestaPaneles.dto';

/**
 * Traduce el DTO del catálogo de paneles a entidades de dominio.
 */
export class panelesMapeador
{
    static aDominio(dto: respuestaPanelesDto): catalogoPaneles
    {
        return new catalogoPaneles(
            dto.esDemostracion,
            dto.advertencia,
            dto.paneles.map(
                (panel) => new panelSolar(
                    panel.id,
                    panel.fabricante,
                    panel.modelo,
                    panel.potenciaWatts,
                    panel.eficienciaPorcentaje,
                    panel.tecnologia,
                    panel.garantiaAnios,
                    panel.anchoMetros,
                    panel.altoMetros,
                    panel.descripcion,
                    panel.esDemostracion,
                ),
            ),
        );
    }
}
