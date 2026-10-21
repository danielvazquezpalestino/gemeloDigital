/**
 * Identificador de una simulación tomado de la ruta (`/:id`).
 */
class DtoIdSimulacion
{
    private constructor(public readonly id: number)
    {
    }

    static crear(id: unknown): [string | undefined, DtoIdSimulacion | undefined]
    {
        const numero = typeof id === 'string' ? Number(id.trim()) : id;

        if (typeof numero !== 'number' || !Number.isInteger(numero) || numero <= 0)
        {
            return ['El identificador de la simulación debe ser un número entero mayor que cero', undefined];
        }

        return [undefined, new DtoIdSimulacion(numero)];
    }
}

export = DtoIdSimulacion;
