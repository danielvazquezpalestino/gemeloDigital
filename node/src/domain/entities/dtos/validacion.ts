/**
 * Reglas de validación compartidas por los DTOs de la API.
 *
 * Todas las compras validan el TIPO y la presencia del dato, nunca solo su
 * verdadiness, y normalizan el valor antes de comprobarlo. Las validaciones de
 * tipos (entero, número, texto, enum) devuelven un `[error, valor]` para
 * seguir el patrón de los DTOs de la API.
 */
class Validacion
{
    static readonly LIMITE_MAXIMO_REGISTROS = 100;
    static readonly MAXIMO_PAGINA = 10000;
    static readonly MAXIMO_ID_MUNICIPIO = 100000;
    static readonly MAXIMO_CAPACIDAD_KW = 100;

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
     */
    static tieneCampo(objeto: { [clave: string]: unknown }, campo: string): boolean
    {
        return Object.prototype.hasOwnProperty.call(objeto, campo);
    }

    /**
     * Texto opcional o requerido con su valor por defecto.
     */
    static leerTexto(valor: unknown, campo: string, porDefecto: string | undefined): [string | undefined, string | undefined]
    {
        if (valor === undefined || valor === null || valor === '')
        {
            return [undefined, porDefecto];
        }

        if (typeof valor !== 'string')
        {
            return [`El campo "${campo}" debe ser un texto`, undefined];
        }

        const texto = valor.trim();

        if (texto === '')
        {
            return [undefined, porDefecto];
        }

        return [undefined, texto];
    }

    /**
     * Enumeración opcional con sus valores permitidos.
     */
    static leerEnum<T extends string>(valor: unknown, campo: string, valoresValidos: readonly T[], porDefecto: T | undefined): [string | undefined, T | undefined]
    {
        if (valor === undefined || valor === null || valor === '')
        {
            return [undefined, porDefecto];
        }

        if (typeof valor !== 'string')
        {
            return [`El campo "${campo}" debe ser un texto`, undefined];
        }

        const normalizado = valor.trim().toLowerCase();

        const valoresNormalizados = (valoresValidos as readonly string[]).map((valorValido) => valorValido.toLowerCase());

        if (!valoresNormalizados.includes(normalizado))
        {
            return [`El campo "${campo}" es inválido. Valores permitidos: ${valoresValidos.join(', ')}`, undefined];
        }

        return [undefined, normalizado as T];
    }

    /**
     * Número entero estrictamente positivo. Se usa en cuerpos JSON, donde el
     * número llega como `number` y no como texto.
     */
    static leerEnteroPositivo(valor: unknown, campo: string, maximo: number, porDefecto: number | undefined): [string | undefined, number | undefined]
    {
        if (valor === undefined || valor === null)
        {
            return [undefined, porDefecto];
        }

        if (typeof valor !== 'number' || !Number.isInteger(valor) || valor <= 0)
        {
            return [`El campo "${campo}" debe ser un número entero mayor que cero`, undefined];
        }

        if (valor > maximo)
        {
            return [`El campo "${campo}" no puede ser mayor que ${maximo}`, undefined];
        }

        return [undefined, valor];
    }

    /**
     * Número decimal positivo con tope superior. Se aceptan también números
     * enviados como texto para los parámetros de consulta.
     */
    static leerNumeroPositivo(valor: unknown, campo: string, maximo: number, porDefecto: number | undefined): [string | undefined, number | undefined]
    {
        if (valor === undefined || valor === null)
        {
            return [undefined, porDefecto];
        }

        const numero = typeof valor === 'number' ? valor : Number(String(valor).trim());

        if (Number.isNaN(numero) || !Number.isFinite(numero) || numero <= 0)
        {
            return [`El campo "${campo}" debe ser un número mayor que cero`, undefined];
        }

        if (numero > maximo)
        {
            return [`El campo "${campo}" no puede ser mayor que ${maximo}`, undefined];
        }

        return [undefined, numero];
    }

    /**
     * Entero para la cadena de consulta, donde los valores llegan como texto.
     * Permite un valor por defecto y un máximo.
     */
    static leerEnteroConsulta(valor: unknown, campo: string, porDefecto: number | undefined, maximo: number): [string | undefined, number | undefined]
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

    /**
     * Número dentro de un rango cerrado, aceptando valores numéricos o texto.
     */
    static leerNumeroEnRango(
        valor: unknown,
        campo: string,
        minimo: number,
        maximo: number,
        porDefecto: number | undefined,
    ): [string | undefined, number | undefined]
    {
        if (valor === undefined || valor === null)
        {
            return [undefined, porDefecto];
        }

        const numero = typeof valor === 'number' ? valor : Number(String(valor).trim());

        if (typeof valor !== 'number' && Number.isNaN(numero))
        {
            return [`El campo "${campo}" debe ser un número`, undefined];
        }

        if (numero < minimo || numero > maximo)
        {
            return [`El campo "${campo}" debe ser un número entre ${minimo} y ${maximo}`, undefined];
        }

        return [undefined, numero];
    }
}

export = Validacion;
