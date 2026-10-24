import EstadoIncentivo = require('../../estado-incentivo');
import TipoBeneficiario = require('../../tipo-beneficiario');
import Validacion = require('../validacion');

/**
 * Parámetros de consulta para listar los incentivos.
 *
 * - `beneficiaryType` filtra por tipo de beneficiario (`home` o `business`).
 * - `municipality` filtra por municipio (identificador numérico o nombre).
 * - `status` filtra por estado del programa (`active`, `expired`, `upcoming`
 *   o `unverified`).
 * - `pagina` y `limite` controlan la paginación (por defecto 1 y 20, con un
 *   máximo de 100 registros por página).
 */
class DtoConsultarIncentivos
{
    private constructor
    (
        public readonly beneficiaryType: string | null,
        public readonly municipio: string | number | null,
        public readonly status: string | null,
        public readonly pagina: number,
        public readonly limite: number,
    )
    {
    }

    static crear(consulta: unknown): [string | undefined, DtoConsultarIncentivos | undefined]
    {
        const objeto = Validacion.comoObjeto(consulta);

        if (!objeto)
        {
            return ['Los parámetros de consulta son inválidos', undefined];
        }

        let beneficiaryType: string | null = null;

        if (Validacion.tieneCampo(objeto, 'beneficiaryType') && objeto['beneficiaryType'] !== null && objeto['beneficiaryType'] !== '')
        {
            const [error, valor] = Validacion.leerEnum(objeto['beneficiaryType'], 'beneficiaryType', [TipoBeneficiario.HOME, TipoBeneficiario.BUSINESS], undefined);

            if (error || valor === undefined)
            {
                return [error ?? 'El parámetro "beneficiaryType" es inválido', undefined];
            }

            beneficiaryType = valor;
        }

        let municipio: string | number | null = null;

        if (Validacion.tieneCampo(objeto, 'municipality') && objeto['municipality'] !== null && objeto['municipality'] !== '')
        {
            const valor = objeto['municipality'];

            if (typeof valor === 'number')
            {
                if (!Number.isInteger(valor) || valor < 1 || valor > Validacion.MAXIMO_ID_MUNICIPIO)
                {
                    return ['El parámetro "municipality" debe ser un identificador de municipio válido', undefined];
                }

                municipio = valor;
            }
            else if (typeof valor === 'string')
            {
                const normalizado = valor.trim();

                if (normalizado !== '')
                {
                    const numero = Number(normalizado);

                    if (!Number.isNaN(numero) && Number.isInteger(numero) && numero >= 1 && numero <= Validacion.MAXIMO_ID_MUNICIPIO)
                    {
                        municipio = numero;
                    }
                    else
                    {
                        municipio = normalizado;
                    }
                }
            }
        }

        let status: string | null = null;

        if (Validacion.tieneCampo(objeto, 'status') && objeto['status'] !== null && objeto['status'] !== '')
        {
            const [error, valor] = Validacion.leerEnum(objeto['status'], 'status', [EstadoIncentivo.ACTIVO, EstadoIncentivo.VENCIDO, EstadoIncentivo.PROXIMO, EstadoIncentivo.NO_VERIFICADO], undefined);

            if (error || valor === undefined)
            {
                return [error ?? 'El parámetro "status" es inválido', undefined];
            }

            status = valor;
        }

        const [errorPagina, pagina] = Validacion.leerEnteroConsulta(objeto['pagina'], 'pagina', 1, Validacion.MAXIMO_PAGINA);

        if (errorPagina || pagina === undefined)
        {
            return [errorPagina ?? 'El parámetro "pagina" es inválido', undefined];
        }

        const [errorLimite, limite] = Validacion.leerEnteroConsulta(objeto['limite'], 'limite', 20, Validacion.LIMITE_MAXIMO_REGISTROS);

        if (errorLimite || limite === undefined)
        {
            return [errorLimite ?? 'El parámetro "limite" es inválido', undefined];
        }

        return [undefined, new DtoConsultarIncentivos(beneficiaryType, municipio, status, pagina, limite)];
    }
}

export = DtoConsultarIncentivos;
