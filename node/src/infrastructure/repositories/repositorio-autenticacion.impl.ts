import Contrasenia = require('../seguridad/contrasenia');
import DtoInicioSesion = require('../../domain/entities/dtos/autenticacion/inicio-sesion.dto');
import DtoRegistroUsuario = require('../../domain/entities/dtos/autenticacion/registro-usuario.dto');
import ErrorPersonalizado = require('../../domain/datasources/errors/custom-error');
import FuenteDatosAutenticacion = require('../../domain/datasources/fuente-datos-autenticacion');
import RepositorioAutenticacion = require('../../domain/repositories/repositorio-autenticacion');
import Sesion = require('../../domain/entities/sesion.entidad');
import Token = require('../seguridad/token');
import Usuario = require('../../domain/entities/usuario.entidad');

/**
 * Casos de uso de autenticación.
 *
 * Orquesta el hash de contraseñas, la verificación de credenciales y la firma
 * del token; delega la persistencia en el puerto de fuente de datos.
 */
class RepositorioAutenticacionImpl implements RepositorioAutenticacion
{
    constructor
    (
        private readonly fuenteDatos: FuenteDatosAutenticacion,
        private readonly secretoToken: string,
        private readonly expiracionEnSegundos: number,
    )
    {
    }

    async registrar(dtoRegistroUsuario: DtoRegistroUsuario): Promise<Usuario>
    {
        const existente = await this.fuenteDatos.buscarPorCorreo(dtoRegistroUsuario.correo);

        if (existente)
        {
            throw ErrorPersonalizado.peticionIncorrecta('El correo electrónico ya está registrado');
        }

        const contraseniaCifrada = await Contrasenia.cifrar(dtoRegistroUsuario.contrasenia);

        return this.fuenteDatos.insertar(new Usuario(
            0,
            dtoRegistroUsuario.nombre,
            dtoRegistroUsuario.correo,
            contraseniaCifrada,
            ['usuario'],
        ));
    }

    async iniciarSesion(dtoInicioSesion: DtoInicioSesion): Promise<Sesion>
    {
        const usuario = await this.fuenteDatos.buscarPorCorreo(dtoInicioSesion.correo);

        // Se responde el mismo mensaje cuando el correo no existe y cuando la
        // contraseña no coincide, para no revelar qué usuarios están dados de alta.
        if (!usuario)
        {
            throw ErrorPersonalizado.noAutorizado('Correo electrónico o contraseña incorrectos');
        }

        const contraseniaValida = await Contrasenia.verificar(
            dtoInicioSesion.contrasenia,
            usuario.contraseniaCifrada,
        );

        if (!contraseniaValida)
        {
            throw ErrorPersonalizado.noAutorizado('Correo electrónico o contraseña incorrectos');
        }

        const token = Token.firmar(usuario, this.secretoToken, this.expiracionEnSegundos);

        return new Sesion(usuario, token, this.expiracionEnSegundos);
    }
}

export = RepositorioAutenticacionImpl;
