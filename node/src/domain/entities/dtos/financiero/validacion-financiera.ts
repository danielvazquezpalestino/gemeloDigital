class ValidacionFinanciera
{
    static readonly INVERSION_MAXIMA = 1000000000000;
    static readonly AHORRO_MAXIMO = 1000000000000;
    static readonly MANTENIMIENTO_MAXIMO = 1000000000000;
    static readonly ANIOS_MAXIMOS = 50;
    static readonly TASA_POR_DEFECTO = 0.1;
    static readonly INFLACION_POR_DEFECTO = 0;
    static readonly ANIOS_POR_DEFECTO = 25;

    static comoObjeto(datos: unknown): { [clave: string]: unknown } | undefined
    {
        if (typeof datos !== 'object' || datos === null || Array.isArray(datos))
        {
            return undefined;
        }

        return datos as { [clave: string]: unknown };
    }

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

    static leerNumeroNoNegativo(valor: unknown, campo: string, porDefecto: number, maximo: number): [string | undefined, number | undefined]
    {
        if (valor === undefined || valor === null)
        {
            return [undefined, porDefecto];
        }

        if (typeof valor !== 'number' || !Number.isFinite(valor) || valor < 0)
        {
            return [`El campo "${campo}" debe ser un número mayor o igual que cero`, undefined];
        }

        if (valor > maximo)
        {
            return [`El campo "${campo}" no puede ser mayor que ${maximo}`, undefined];
        }

        return [undefined, valor];
    }

    static leerTasa(valor: unknown, campo: string, porDefecto: number): [string | undefined, number | undefined]
    {
        if (valor === undefined || valor === null)
        {
            return [undefined, porDefecto];
        }

        if (typeof valor !== 'number' || !Number.isFinite(valor) || valor < 0 || valor >= 1)
        {
            return [`El campo "${campo}" debe ser un número mayor o igual que 0 y menor que 1`, undefined];
        }

        return [undefined, valor];
    }

    static leerAnios(valor: unknown, campo: string, porDefecto: number): [string | undefined, number | undefined]
    {
        if (valor === undefined || valor === null)
        {
            return [undefined, porDefecto];
        }

        if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < 1 || valor > ValidacionFinanciera.ANIOS_MAXIMOS)
        {
            return [`El campo "${campo}" debe ser un número entero entre 1 y ${ValidacionFinanciera.ANIOS_MAXIMOS}`, undefined];
        }

        return [undefined, valor];
    }
}

export = ValidacionFinanciera;
