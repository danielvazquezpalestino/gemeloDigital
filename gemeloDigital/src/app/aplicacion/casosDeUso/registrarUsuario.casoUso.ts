import { inject, Injectable } from '@angular/core';
import { usuario } from '../../dominio/entidades/usuario.entidad';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { repositorioAutenticacion } from '../puertos/repositorioAutenticacion';

/**
 * Caso de uso: registrar un usuario nuevo.
 *
 * Normaliza y valida los datos antes de delegar en el puerto de autenticación.
 */
@Injectable({ providedIn: 'root' })
export class registrarUsuario
{
    private readonly repositorio = inject(repositorioAutenticacion);

    async ejecutar(nombre: string, correo: string, contrasenia: string): Promise<usuario>
    {
        const nombreValidado = validadorEntrada.textoObligatorio(nombre, 'El nombre', 100);
        const correoValidado = validadorEntrada.correoObligatorio(correo);
        const contraseniaValidada = validadorEntrada.contraseniaObligatoria(contrasenia);

        return this.repositorio.registrar(nombreValidado, correoValidado, contraseniaValidada);
    }
}
