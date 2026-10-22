import TipoTarifa = require('../../tipo-tarifa');

/**
 * Reglas de validación compartidas por los DTO del módulo de simulaciones.
 *
 * Todas las compruebas validan el TIPO y la presencia del dato, nunca solo su
 * verdadiness, y normalizan el valor antes de compararlo.
 */
class ValidacionSimulacion
{
    static readonly CONSUMO_MAXIMO_KWH = 10000000;
    static readonly TARIFA_MAXIMA = 1000;
    static readonly AREA_MAXIMA_M2 = 1000000;
    static readonly MUNICIPIO_MAXIMO = 100000;
    static readonly LIMITE_MAXIMO_REGISTROS = 100;

    /**
     * Verifica que el payload sea un objeto plano y devuelve sus campos.
     */
    static comoObjeto(datos: unknown): { [clave: string]: unknown } | undefined
    {
        if (typeof datos !== 'object' || datos === null || Array.isArray(datos))
        {
            return undefined;
        }

        return datos as { [clave: string]: unknown };
    }

    /**
     * Indica si el objeto trae el campo, aunque su valor sea `null`.
     * Permite diferenciar "no enviado" de "enviado vacío".
     */
    static tieneCampo(objeto: { [clave: string]: unknown }, campo: string): boolean
    {
        return Object.prototype.hasOwnProperty.call(objeto, campo);
    }

    /**
     * Entero estrictamente positivo. Se usa en cuerpos JSON, donde el número
     * llega como `number` y no como texto.
     */
    static leerEnteroPositivo(valor: unknown, campo: string): [string | undefined, number | undefined]
    {
        if (typeof valor !== 'number' || !Number.isInteger(valor) || valor <= 0)
        {
            return [`El campo "${campo}" debe ser un número entero mayor que cero`, undefined];
        }

        return [undefined, valor];
    }

    /**
     * Número decimal positivo con tope superior.
     */
    static leerNumeroPositivo(valor: unknown, campo: string, maximo: number): [string | undefined, number | undefined]
    {
        if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0)
        {
            return [`El campo "${campo}" debe ser un número mayor que cero`, undefined];
        }

        if (valor > maximo)
        {
            return [`El campo "${campo}" no puede ser mayor que ${maximo}`, undefined];
        }

        return [undefined, valor];
    }

    /**
     * Booleano opcional. Si no se envía se usa el valor por defecto.
     */
    static leerBooleano(valor: unknown, campo: string, porDefecto: boolean): [string | undefined, boolean | undefined]
    {
        if (valor === undefined || valor === null)
        {
            return [undefined, porDefecto];
        }

        if (typeof valor !== 'boolean')
        {
            return [`El campo "${campo}" debe ser un valor booleano (true o false)`, undefined];
        }

        return [undefined, valor];
    }

    /**
     * Tipo de tarifa opcional. Se normaliza a mayúsculas antes de validar.
     */
    static leerTipoTarifa(valor: unknown, campo: string, porDefecto: TipoTarifa): [string | undefined, TipoTarifa | undefined]
    {
        if (valor === undefined || valor === null)
        {
            return [undefined, porDefecto];
        }

        if (typeof valor !== 'string')
        {
            return [`El campo "${campo}" debe ser un texto`, undefined];
        }

        const normalizado = valor.trim().toUpperCase();

        if (!ValidacionSimulacion.esTipoTarifaValido(normalizado))
        {
            return [`El campo "${campo}" es inválido. Valores permitidos: ${ValidacionSimulacion.tiposTarifaValidos()}`, undefined];
        }

        return [undefined, normalizado];
    }

    /**
     * Entero para la cadena de consulta, donde los valores llegan como texto.
     */
    static leerEnteroConsulta(valor: unknown, campo: string, porDefecto: number, maximo: number): [string | undefined, number | undefined]
    {
        if (valor === undefined || valor === null || valor === '')
        {
            return [undefined, porDefecto];
        }

        const numero = typeof valor === 'number' ? valor : Number(String(valor).trim());

        if (!Number.isInteger(numero) || numero < 1)
        {
            return [`El parámetro "${campo}" debe ser un número entero mayor que cero`, undefined];
        }

        if (numero > maximo)
        {
            return [`El parámetro "${campo}" no puede ser mayor que ${maximo}`, undefined];
        }

        return [undefined, numero];
    }

    static esTipoTarifaValido(valor: string): valor is TipoTarifa
    {
        return (Object.values(TipoTarifa) as string[]).includes(valor);
    }

    static tiposTarifaValidos(): string
    {
        return Object.values(TipoTarifa).join(', ');
    }
}

export = ValidacionSimulacion;
