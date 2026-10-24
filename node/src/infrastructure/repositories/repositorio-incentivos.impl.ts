import EvaluadorElegibilidadIncentivos = require('../../domain/servicios/evaluador-elegibilidad-incentivos');
import DtoConsultarIncentivos = require('../../domain/entities/dtos/incentivos/consultar-incentivos.dto');
import DtoEvaluarElegibilidad = require('../../domain/entities/dtos/incentivos/evaluar-elegibilidad.dto');
import FuenteDatosIncentivos = require('../../domain/datasources/fuente-datos-incentivos');
import EvaluacionIncentivo = require('../../domain/entities/evaluacion-incentivo.entidad');
import HistorialIncentivos = require('../../domain/entities/historial-incentivos.entidad');
import DatosSolicitudIncentivo = require('../../domain/entities/datos-solicitud-incentivo.entidad');
import RepositorioIncentivos = require('../../domain/repositories/repositorio-incentivos');
import RepositorioUbicaciones = require('../../domain/repositories/repositorio-ubicaciones');

/**
 * Implementación de los casos de uso del módulo de incentivos.
 *
 * Orquesta la fuente de datos (persistencia) con el evaluador de elegibilidad
 * (lógica de negocio).
 */
class RepositorioIncentivosImpl implements RepositorioIncentivos
{
    constructor
    (
        private readonly fuenteDatos: FuenteDatosIncentivos,
        private readonly evaluador: EvaluadorElegibilidadIncentivos,
        private readonly repositorioUbicaciones: RepositorioUbicaciones,
    )
    {
    }

    async listar(filtros: DtoConsultarIncentivos): Promise<HistorialIncentivos>
    {
        const municipioId = await RepositorioIncentivosImpl.obtenerMunicipioId(filtros.municipio, this.repositorioUbicaciones);
        const incentivos = await this.fuenteDatos.listar(municipioId);
        const conFiltro = incentivos.filter((incentivo) =>
        {
            const cumpleBeneficiario = filtros.beneficiaryType === null || incentivo.beneficiarios.includes(filtros.beneficiaryType);
            const estado = incentivo.obtenerEstado();
            const cumpleStatus = filtros.status === null || estado === filtros.status;

            return cumpleBeneficiario && cumpleStatus;
        });

        const desde = (filtros.pagina - 1) * filtros.limite;

        return new HistorialIncentivos(conFiltro.length, filtros.pagina, filtros.limite, conFiltro.slice(desde, desde + filtros.limite));
    }

    async evaluarElegibilidad(dto: DtoEvaluarElegibilidad): Promise<EvaluacionIncentivo[]>
    {
        const incentivos = await this.fuenteDatos.listar(null);
        const delBeneficiario = dto.beneficiaryType
            ? incentivos.filter((incentivo) => incentivo.beneficiarios.includes(dto.beneficiaryType))
            : incentivos;

        const municipioId = await RepositorioIncentivosImpl.obtenerMunicipioId(dto.municipality, this.repositorioUbicaciones);
        const datos = new DatosSolicitudIncentivo(dto.beneficiaryType, municipioId, dto.systemCapacityKw, dto.installationType);

        return this.evaluador.evaluar(delBeneficiario, datos);
    }

    /**
     * Resuelve el municipio por identificador o por nombre a partir del
     * catálogo de municipios.
     */
    private static async obtenerMunicipioId(municipio: string | number | null, repositorioUbicaciones: RepositorioUbicaciones): Promise<number | null>
    {
        if (municipio === null)
        {
            return null;
        }

        if (typeof municipio === 'number')
        {
            return municipio;
        }

        const catalogo = await repositorioUbicaciones.obtenerMunicipios();
        const buscado = catalogo.find((municipioActual) => municipioActual.nombre.toLowerCase() === municipio.trim().toLowerCase());

        return buscado ? buscado.id : null;
    }
}

export = RepositorioIncentivosImpl;
