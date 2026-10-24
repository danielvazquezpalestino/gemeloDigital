import EstadoEvaluacion = require('../../estado-evaluacion');
import TipoBeneficiario = require('../../tipo-beneficiario');
import Validacion = require('../validacion');

/**
 * Parámetros de consulta para evaluar la elegibilidad de incentivos.
 *
 * - `beneficiaryType` es obligatorio: `home` o `business`.
 * - `municipality` es el municipio de Puebla del solicitante y es obligatorio.
 * - `systemCapacityKw` es la capacidad instalada o proyectada del sistema en kW.
 * - `installationType` es el tipo de instalación, cuando corresponda.
 */
class DtoEvaluarElegibilidad
{
    private constructor
    (
        public readonly beneficiaryType: string,
        public readonly municipality: string,
        public readonly systemCapacityKw: number | null,
        public readonly installationType: string | null,
    )
    {
    }

    static crear(consulta: unknown): [string | undefined, DtoEvaluarElegibilidad | undefined]
    {
        const objeto = Validacion.comoObjeto(consulta);

        if (!objeto)
        {
            return ['Los parámetros de consulta son inválidos', undefined];
        }

        const [errorBeneficiario, beneficiaryType] = Validacion.leerEnum(objeto['beneficiaryType'], 'beneficiaryType', [TipoBeneficiario.HOME, TipoBeneficiario.BUSINESS], undefined);

        if (errorBeneficiario || beneficiaryType === undefined)
        {
            return [errorBeneficiario ?? 'El parámetro "beneficiaryType" es obligatorio y debe ser "home" o "business"', undefined];
        }

        const [errorMunicipio, municipality] = Validacion.leerTexto(objeto['municipality'], 'municipality', undefined);

        if (errorMunicipio || municipality === undefined)
        {
            return [errorMunicipio ?? 'El parámetro "municipality" es obligatorio', undefined];
        }

        let systemCapacityKw: number | null = null;

        if (objeto['systemCapacityKw'] !== undefined && objeto['systemCapacityKw'] !== null && objeto['systemCapacityKw'] !== '')
        {
            const [errorCapacidad, capacidad] = Validacion.leerNumeroPositivo(objeto['systemCapacityKw'], 'systemCapacityKw', Validacion.MAXIMO_CAPACIDAD_KW, undefined);

            if (errorCapacidad || capacidad === undefined)
            {
                return [errorCapacidad ?? 'El parámetro "systemCapacityKw" es inválido', undefined];
            }

            systemCapacityKw = capacidad;
        }

        let installationType: string | null = null;

        if (objeto['installationType'] !== undefined && objeto['installationType'] !== null && objeto['installationType'] !== '')
        {
            const [errorInstalacion, tipo] = Validacion.leerTexto(objeto['installationType'], 'installationType', undefined);

            if (errorInstalacion || tipo === undefined)
            {
                return [errorInstalacion ?? 'El parámetro "installationType" es inválido', undefined];
            }

            installationType = tipo;
        }

        return [undefined, new DtoEvaluarElegibilidad(beneficiaryType, municipality!, systemCapacityKw, installationType)];
    }
}

export = DtoEvaluarElegibilidad;
