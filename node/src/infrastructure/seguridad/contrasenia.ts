import crypto = require('crypto');

/**
 * Hash y verificación de contraseñas con `scrypt` (incluido en Node).
 *
 * El formato almacenado es `scrypt$<sal>$<clave>`; nunca se guarda la
 * contraseña en texto plano. Se usa la implementación nativa para no añadir
 * dependencias de compilación nativa al proyecto.
 */
class Contrasenia
{
    private static readonly LONGITUD_CLAVE = 64;
    private static readonly LONGITUD_SAL = 16;

    static async cifrar(contrasenia: string): Promise<string>
    {
        const sal = crypto.randomBytes(Contrasenia.LONGITUD_SAL).toString('hex');
        const clave = await Contrasenia.derivar(contrasenia, sal);

        return `scrypt$${sal}$${clave.toString('hex')}`;
    }

    static async verificar(contrasenia: string, almacenada: string): Promise<boolean>
    {
        const partes = almacenada.split('$');
        const sal = partes[1];
        const hash = partes[2];

        if (partes.length !== 3 || partes[0] !== 'scrypt' || !sal || !hash)
        {
            return false;
        }

        const esperada = Buffer.from(hash, 'hex');

        if (esperada.length !== Contrasenia.LONGITUD_CLAVE)
        {
            return false;
        }

        const derivada = await Contrasenia.derivar(contrasenia, sal);

        // Comparación en tiempo constante para no filtrar información por
        // diferencias de tiempo entre hashes parcialmente correctos.
        return crypto.timingSafeEqual(derivada, esperada);
    }

    private static derivar(contrasenia: string, sal: string): Promise<Buffer>
    {
        return new Promise<Buffer>((resolver, rechazar) =>
        {
            crypto.scrypt(contrasenia, sal, Contrasenia.LONGITUD_CLAVE, (error, clave) =>
            {
                if (error)
                {
                    rechazar(error);
                    return;
                }

                resolver(clave);
            });
        });
    }
}

export = Contrasenia;
