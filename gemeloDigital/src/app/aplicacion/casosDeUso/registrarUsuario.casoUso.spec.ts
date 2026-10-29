import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usuario } from '../../dominio/entidades/usuario.entidad';
import { errorAutenticacion } from '../../dominio/errores/errorAutenticacion';
import { repositorioAutenticacion } from '../puertos/repositorioAutenticacion';
import { registrarUsuario } from './registrarUsuario.casoUso';

const usuarioDePrueba = new usuario(1, 'Ana Torres', 'ana@example.com', ['usuario']);

function configurar()
{
    const repositorio = {
        registrar: vi.fn(),
        iniciarSesion: vi.fn(),
    };

    repositorio.registrar.mockResolvedValue(usuarioDePrueba);

    TestBed.configureTestingModule({
        providers: [
            registrarUsuario,
            { provide: repositorioAutenticacion, useValue: repositorio },
        ],
    });

    return {
        casoUso: TestBed.inject(registrarUsuario),
        repositorio,
    };
}

describe('registrarUsuario', () =>
{
    afterEach(() =>
    {
        TestBed.resetTestingModule();
    });

    it('debe normalizar nombre y correo antes de registrar', async () =>
    {
        const { casoUso, repositorio } = configurar();

        const resultado = await casoUso.ejecutar('  Ana Torres  ', '  ANA@Example.com ', 'Secreta123');

        expect(repositorio.registrar).toHaveBeenCalledWith(
            'Ana Torres',
            'ana@example.com',
            'Secreta123',
        );
        expect(resultado).toBe(usuarioDePrueba);
    });

    it('debe rechazar un correo inválido sin llamar al repositorio', async () =>
    {
        const { casoUso, repositorio } = configurar();

        await expect(casoUso.ejecutar('Ana', 'correo-invalido', 'Secreta123'))
            .rejects.toThrow('El correo electrónico no tiene un formato válido');

        expect(repositorio.registrar).not.toHaveBeenCalled();
    });

    it('debe rechazar una contraseña corta sin llamar al repositorio', async () =>
    {
        const { casoUso, repositorio } = configurar();

        await expect(casoUso.ejecutar('Ana', 'ana@example.com', 'corta'))
            .rejects.toThrow('La contraseña debe tener entre 8 y 128 caracteres');

        expect(repositorio.registrar).not.toHaveBeenCalled();
    });

    it('debe propagar el error del repositorio', async () =>
    {
        const { casoUso, repositorio } = configurar();

        repositorio.registrar.mockRejectedValue(
            new errorAutenticacion('El correo electrónico ya está registrado'),
        );

        await expect(casoUso.ejecutar('Ana', 'ana@example.com', 'Secreta123'))
            .rejects.toThrow('El correo electrónico ya está registrado');
    });
});
