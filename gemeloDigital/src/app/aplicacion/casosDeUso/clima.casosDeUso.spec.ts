import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { pronostico } from '../../dominio/entidades/pronostico.entidad';
import { repositorioClima } from '../puertos/repositorioClima';
import { obtenerPronosticoMeteorologico } from './obtenerPronosticoMeteorologico.casoUso';

const pronosticoDePrueba = {} as pronostico;

function configurar()
{
    const repositorio = {
        obtenerPronostico: vi.fn(),
    };

    repositorio.obtenerPronostico.mockResolvedValue(pronosticoDePrueba);

    TestBed.configureTestingModule({
        providers: [
            obtenerPronosticoMeteorologico,
            { provide: repositorioClima, useValue: repositorio },
        ],
    });

    return {
        casoUso: TestBed.inject(obtenerPronosticoMeteorologico),
        repositorio,
    };
}

describe('obtenerPronosticoMeteorologico', () =>
{
    afterEach(() =>
    {
        TestBed.resetTestingModule();
    });

    it('debe consultar el pronóstico con coordenadas y días válidos', async () =>
    {
        const { casoUso, repositorio } = configurar();

        const resultado = await casoUso.ejecutar(19.04, -98.2, 7);

        expect(repositorio.obtenerPronostico).toHaveBeenCalledWith(19.04, -98.2, 7);
        expect(resultado).toBe(pronosticoDePrueba);
    });

    it('debe rechazar una latitud fuera de rango', async () =>
    {
        const { casoUso, repositorio } = configurar();

        await expect(casoUso.ejecutar(100, -98.2))
            .rejects.toThrow('La latitud no debe ser mayor que 90');

        expect(repositorio.obtenerPronostico).not.toHaveBeenCalled();
    });

    it('debe rechazar una cantidad de días no entera', async () =>
    {
        const { casoUso, repositorio } = configurar();

        await expect(casoUso.ejecutar(19.04, -98.2, 2.5))
            .rejects.toThrow('Los días debe ser un número entero');

        expect(repositorio.obtenerPronostico).not.toHaveBeenCalled();
    });
});
