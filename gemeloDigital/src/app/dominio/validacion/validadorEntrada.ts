import { errorApi } from '../errores/errorApi';
import { estadoIncentivo } from '../objetosValor/estadoIncentivo';
import { periodoFacturacion } from '../objetosValor/periodoFacturacion';
import { tipoBeneficiario } from '../objetosValor/tipoBeneficiario';
import { tipoTarifa } from '../objetosValor/tipoTarifa';

interface opcionesNumero
{
    readonly minimo?: number;
    readonly maximo?: number;
    readonly minimoExclusivo?: boolean;
}

/**
 * Validaciones de entrada compartidas por los casos de uso.
 *
 * Normaliza los valores y lanza `errorApi` con mensajes en español para que
 * la presentación no tenga que repetir las mismas reglas.
 */
export class validadorEntrada
{
    private static readonly PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private static readonly TIPOS_TARIFA: readonly tipoTarifa[] = ['PDBT', 'DAC', 'GDBT'];
    private static readonly PERIODOS_FACTURACION: readonly periodoFacturacion[] = [
        'MENSUAL',
        'BIMESTRAL',
        'TRIMESTRAL',
        'SEMESTRAL',
        'ANUAL',
    ];
    private static readonly TIPOS_BENEFICIARIO: readonly tipoBeneficiario[] = ['home', 'business'];
    private static readonly ESTADOS_INCENTIVO: readonly estadoIncentivo[] = [
        'active',
        'expired',
        'upcoming',
        'unverified',
    ];

    static textoObligatorio(valor: unknown, nombre: string, maximo?: number): string
    {
        if (typeof valor !== 'string' || valor.trim() === '')
        {
            throw new errorApi(`${nombre} es obligatorio`);
        }

        return validadorEntrada.validarLongitud(valor.trim(), nombre, maximo);
    }

    static textoOpcional(valor: unknown, nombre: string, maximo?: number): string | null
    {
        if (valor === null || valor === undefined)
        {
            return null;
        }

        if (typeof valor !== 'string')
        {
            throw new errorApi(`${nombre} debe ser un texto`);
        }

        const texto = valor.trim();

        if (texto === '')
        {
            return null;
        }

        return validadorEntrada.validarLongitud(texto, nombre, maximo);
    }

    static correoObligatorio(valor: unknown): string
    {
        const correo = validadorEntrada.textoObligatorio(valor, 'El correo electrónico', 150).toLowerCase();

        if (!validadorEntrada.PATRON_CORREO.test(correo))
        {
            throw new errorApi('El correo electrónico no tiene un formato válido');
        }

        return correo;
    }

    static contraseniaObligatoria(valor: unknown): string
    {
        if (typeof valor !== 'string' || valor.length === 0)
        {
            throw new errorApi('La contraseña es obligatoria');
        }

        if (valor.length < 8 || valor.length > 128)
        {
            throw new errorApi('La contraseña debe tener entre 8 y 128 caracteres');
        }

        return valor;
    }

    static numeroObligatorio(valor: unknown, nombre: string, opciones: opcionesNumero = {}): number
    {
        if (typeof valor !== 'number' || !Number.isFinite(valor))
        {
            throw new errorApi(`${nombre} debe ser un número válido`);
        }

        validadorEntrada.validarRango(valor, nombre, opciones);

        return valor;
    }

    static numeroOpcional(
        valor: unknown,
        nombre: string,
        opciones: opcionesNumero = {},
    ): number | null
    {
        if (valor === null || valor === undefined)
        {
            return null;
        }

        return validadorEntrada.numeroObligatorio(valor, nombre, opciones);
    }

    static enteroObligatorio(valor: unknown, nombre: string, opciones: opcionesNumero = {}): number
    {
        const numero = validadorEntrada.numeroObligatorio(valor, nombre, opciones);

        if (!Number.isInteger(numero))
        {
            throw new errorApi(`${nombre} debe ser un número entero`);
        }

        return numero;
    }

    static enteroOpcional(
        valor: unknown,
        nombre: string,
        opciones: opcionesNumero = {},
    ): number | null
    {
        if (valor === null || valor === undefined)
        {
            return null;
        }

        return validadorEntrada.enteroObligatorio(valor, nombre, opciones);
    }

    static booleanoOpcional(valor: unknown, nombre: string, porDefecto: boolean): boolean
    {
        if (valor === null || valor === undefined)
        {
            return porDefecto;
        }

        if (typeof valor !== 'boolean')
        {
            throw new errorApi(`${nombre} debe ser verdadero o falso`);
        }

        return valor;
    }

    static tipoTarifaObligatorio(valor: unknown): tipoTarifa
    {
        const texto = validadorEntrada.textoObligatorio(valor, 'El tipo de tarifa').toUpperCase();

        if (!validadorEntrada.TIPOS_TARIFA.includes(texto as tipoTarifa))
        {
            throw new errorApi('El tipo de tarifa debe ser PDBT, DAC o GDBT');
        }

        return texto as tipoTarifa;
    }

    static periodoFacturacionOpcional(valor: unknown): periodoFacturacion
    {
        if (valor === null || valor === undefined)
        {
            return 'MENSUAL';
        }

        const texto = validadorEntrada.textoObligatorio(valor, 'El periodo').toUpperCase();

        if (!validadorEntrada.PERIODOS_FACTURACION.includes(texto as periodoFacturacion))
        {
            throw new errorApi(
                'El periodo debe ser MENSUAL, BIMESTRAL, TRIMESTRAL, SEMESTRAL o ANUAL',
            );
        }

        return texto as periodoFacturacion;
    }

    static tipoBeneficiarioObligatorio(valor: unknown): tipoBeneficiario
    {
        const texto = validadorEntrada.textoObligatorio(valor, 'El tipo de beneficiario').toLowerCase();

        if (!validadorEntrada.TIPOS_BENEFICIARIO.includes(texto as tipoBeneficiario))
        {
            throw new errorApi('El tipo de beneficiario debe ser home o business');
        }

        return texto as tipoBeneficiario;
    }

    static tipoBeneficiarioOpcional(valor: unknown): tipoBeneficiario | null
    {
        if (valor === null || valor === undefined)
        {
            return null;
        }

        return validadorEntrada.tipoBeneficiarioObligatorio(valor);
    }

    static estadoIncentivoOpcional(valor: unknown): estadoIncentivo | null
    {
        if (valor === null || valor === undefined)
        {
            return null;
        }

        const texto = validadorEntrada.textoObligatorio(valor, 'El estado del incentivo').toLowerCase();

        if (!validadorEntrada.ESTADOS_INCENTIVO.includes(texto as estadoIncentivo))
        {
            throw new errorApi(
                'El estado del incentivo debe ser active, expired, upcoming o unverified',
            );
        }

        return texto as estadoIncentivo;
    }

    private static validarLongitud(texto: string, nombre: string, maximo?: number): string
    {
        if (maximo !== undefined && texto.length > maximo)
        {
            throw new errorApi(`${nombre} no debe exceder ${maximo} caracteres`);
        }

        return texto;
    }

    private static validarRango(valor: number, nombre: string, opciones: opcionesNumero): void
    {
        if (opciones.minimo !== undefined)
        {
            const fueraDeRango = opciones.minimoExclusivo
                ? valor <= opciones.minimo
                : valor < opciones.minimo;

            if (fueraDeRango)
            {
                const comparacion = opciones.minimoExclusivo ? 'mayor que' : 'mayor o igual que';

                throw new errorApi(`${nombre} debe ser ${comparacion} ${opciones.minimo}`);
            }
        }

        if (opciones.maximo !== undefined && valor > opciones.maximo)
        {
            throw new errorApi(`${nombre} no debe ser mayor que ${opciones.maximo}`);
        }
    }
}
