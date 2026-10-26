import jwt = require('jsonwebtoken');
import Usuario = require('../../domain/entities/usuario.entidad');

/**
 * Firma de tokens de sesión (JWT).
 *
 * El token incluye el identificador en `sub`, el correo y los roles. La
 * verificación se hará en el interceptor/guardia cuando existan rutas
 * protegidas en la API; por ahora solo se emite.
 */
class Token
{
    private static readonly EMISOR = 'gemelo-digital';

    static firmar(usuario: Usuario, secreto: string, expiracionEnSegundos: number): string
    {
        return jwt.sign(
            {
                correo: usuario.correo,
                roles: usuario.roles,
            },
            secreto,
            {
                subject: String(usuario.id),
                expiresIn: expiracionEnSegundos,
                issuer: Token.EMISOR,
            },
        );
    }
}

export = Token;
