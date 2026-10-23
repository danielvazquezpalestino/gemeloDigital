/**
 * Utilidades de validación compartidas por los DTO de los nuevos módulos.
 *
 * Se valida el tipo y la presencia de cada dato, nunca solo su verdadiness.
 * Los mensajes están en español y se devuelven como primer elemento de la
 * tupla para que el controlador los traduzca a un 400.
 */
class ValidacionEntrada
{
    static comoObjeto(datos: unknown): { [clave: string]: unknown } | undefined
    {
        if (typeof datos !== 'object' || datos === null || Array.isArray(datos))
        {
            return undefined;
        }

        return datos as { [clave: string]: unknown };
    }

    static tieneCampo(objeto: { [clave: string]: unknown }, campo: string): boolean
    {
        return Object.prototype.hasOwnProperty.call(objeto, campo);
    }

    static leerTextoRequerido(valor: unknown, campo: string, maximo = 120): [string | undefined, string | undefined]
    {
        if (typeof valor !== 'string' || valor.trim() === '')
        {
            return [`El campo "${campo}" es obligatorio y debe ser un texto`, undefined];
        }

        const normalizado = valor.trim();

        if (normalizado.length > maximo)
        {
            return [`El campo "${campo}" no puede superar ${maximo} caracteres`, undefined];
        }

        return [undefined, normalizado];
    }

    static leerTextoOpcional(valor: unknown, campo: string, maximo = 120): [string | undefined, string | undefined]
    {
        if (valor === undefined || valor === null || valor === '')
        {
            return [undefined, undefined];
        }

        if (typeof valor !== 'string')
        {
            return [`El campo "${campo}" debe ser un texto`, undefined];
        }

        const normalizado = valor.trim();

        if (normalizado.length > maximo)
        {
            return [`El campo "${campo}" no puede superar ${maximo} caracteres`, undefined];
        }

        return [undefined, normalizado === '' ? undefined : normalizado];
    }

    static leerNumero(
        valor: unknown,
        campo: string,
        opciones: { minimo: number; maximo: number; entero?: boolean; incluirMinimo?: boolean },
    ): [string | undefined, number | undefined]
    {
        if (typeof valor !== 'number' || !Number.isFinite(valor))
        {
            return [`El campo "${campo}" debe ser un número válido`, undefined];
        }

        if (opciones.entero === true && !Number.isInteger(valor))
        {
            return [`El campo "${campo}" debe ser un número entero`, undefined];
        }

        const incluirMinimo = opciones.incluirMinimo ?? true;
        const cumpleMinimo = incluirMinimo ? valor >= opciones.minimo : valor > opciones.minimo;

        if (!cumpleMinimo)
        {
            const comparador = incluirMinimo ? 'mayor o igual' : 'mayor';
            return [`El campo "${campo}" debe ser ${comparador} que ${opciones.minimo}`, undefined];
        }

        if (valor > opciones.maximo)
        {
            return [`El campo "${campo}" no puede ser mayor que ${opciones.maximo}`, undefined];
        }

        return [undefined, valor];
    }

    static leerNumeroOpcional(
        valor: unknown,
        campo: string,
        opciones: { minimo: number; maximo: number; porDefecto: number; entero?: boolean; incluirMinimo?: boolean },
    ): [string | undefined, number | undefined]
    {
        if (valor === undefined || valor === null)
        {
            return [undefined, opciones.porDefecto];
        }

        return ValidacionEntrada.leerNumero(valor, campo, opciones);
    }

    /**
     * Lee un número que llega como cadena en `req.query`. Un valor vacío o
     * ausente usa el valor por defecto cuando se proporciona.
     */
    static leerNumeroConsulta(
        valor: unknown,
        campo: string,
        opciones: { minimo: number; maximo: number; porDefecto?: number; entero?: boolean; incluirMinimo?: boolean },
    ): [string | undefined, number | undefined]
    {
        if (valor === undefined || valor === null || valor === '')
        {
            if (opciones.porDefecto !== undefined)
            {
                return [undefined, opciones.porDefecto];
            }

            return [`El parámetro "${campo}" es obligatorio`, undefined];
        }

        const numero = typeof valor === 'number' ? valor : Number(String(valor).trim());
        return ValidacionEntrada.leerNumero(numero, campo, opciones);
    }
}

export = ValidacionEntrada;
