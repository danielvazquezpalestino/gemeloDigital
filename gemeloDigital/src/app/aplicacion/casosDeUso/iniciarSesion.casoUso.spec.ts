import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { almacenamientoSesion } from '../puertos/almacenamientoSesion';
import { errorAutenticacion } from '../../dominio/errores/errorAutenticacion';
import { iniciarSesion } from './iniciarSesion.casoUso';
import { repositorioAutenticacion } from '../puertos/repositorioAutenticacion';
import { sesion } from '../../dominio/entidades/sesion.entidad';
import { usuario } from '../../dominio/entidades/usuario.entidad';

const sesionDePrueba = new sesion(
    new usuario(7, 'Ana Torres', 'ana@example.com', ['usuario']),
    'token-de-prueba',
    7200,
);

function crearRepositorioFalso()
{
    return {
        iniciarSesion: vi.fn<(correo: string, contrasenia: string) => Promise<sesion>>(),
    };
}

function crearAlmacenamientoFalso()
{
    return {
        guardar: vi.fn<(sesion: sesion) => void>(),
        obtener: vi.fn<() => sesion | null>(),
        obtenerToken: vi.fn<() => string | null>(),
        eliminar: vi.fn<() => void>(),
        estaAutenticado: vi.fn<() => boolean>(),
    };
}

function configurar()
{
    const repositorio = crearRepositorioFalso();
    const almacenamiento = crearAlmacenamientoFalso();

    repositorio.iniciarSesion.mockResolvedValue(sesionDePrueba);

    TestBed.configureTestingModule({
        providers: [
            iniciarSesion,
            { provide: repositorioAutenticacion, useValue: repositorio },
            { provide: almacenamientoSesion, useValue: almacenamiento },
        ],
    });

    return {
        casoUso: TestBed.inject(iniciarSesion),
        repositorio,
        almacenamiento,
    };
}

describe('iniciarSesion', () =>
{
    afterEach(() =>
    {
        TestBed.resetTestingModule();
    });

    it('debe normalizar el correo, guardar la sesión y devolverla', async () =>
    {
        const { casoUso, repositorio, almacenamiento } = configurar();

        const resultado = await casoUso.ejecutar('  ANA@Example.com ', 'Secreta123');

        expect(repositorio.iniciarSesion).toHaveBeenCalledWith('ana@example.com', 'Secreta123');
        expect(almacenamiento.guardar).toHaveBeenCalledWith(sesionDePrueba);
        expect(resultado).toBe(sesionDePrueba);
    });

    it('debe rechazar un correo vacío sin llamar al repositorio', async () =>
    {
        const { casoUso, repositorio, almacenamiento } = configurar();

        await expect(casoUso.ejecutar('   ', 'Secreta123'))
            .rejects.toThrow('El correo electrónico y la contraseña son obligatorios');

        expect(repositorio.iniciarSesion).not.toHaveBeenCalled();
        expect(almacenamiento.guardar).not.toHaveBeenCalled();
    });

    it('debe rechazar una contraseña vacía sin llamar al repositorio', async () =>
    {
        const { casoUso, repositorio } = configurar();

        await expect(casoUso.ejecutar('ana@example.com', ''))
            .rejects.toThrow('El correo electrónico y la contraseña son obligatorios');

        expect(repositorio.iniciarSesion).not.toHaveBeenCalled();
    });

    it('debe propagar el error de credenciales y no guardar la sesión', async () =>
    {
        const { casoUso, repositorio, almacenamiento } = configurar();

        repositorio.iniciarSesion.mockRejectedValue(
            new errorAutenticacion('Correo electrónico o contraseña incorrectos'),
        );

        await expect(casoUso.ejecutar('ana@example.com', 'ClaveIncorrecta'))
            .rejects.toThrow('Correo electrónico o contraseña incorrectos');

        expect(almacenamiento.guardar).not.toHaveBeenCalled();
    });
});
