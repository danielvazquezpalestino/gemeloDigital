import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resultadoFinanciero } from '../../dominio/entidades/resultadoFinanciero.entidad';
import { repositorioFinanciero } from '../puertos/repositorioFinanciero';
import { estimarFinanciero } from './estimarFinanciero.casoUso';

const resultadoDePrueba = {} as resultadoFinanciero;

function configurar()
{
    const repositorio = {
        estimar: vi.fn(),
    };

    repositorio.estimar.mockResolvedValue(resultadoDePrueba);

    TestBed.configureTestingModule({
        providers: [
            estimarFinanciero,
            { provide: repositorioFinanciero, useValue: repositorio },
        ],
    });

    return {
        casoUso: TestBed.inject(estimarFinanciero),
        repositorio,
    };
}

describe('estimarFinanciero', () =>
{
    afterEach(() =>
    {
        TestBed.resetTestingModule();
    });

    it('debe estimar con mantenimiento cero por defecto', async () =>
    {
        const { casoUso, repositorio } = configurar();

        const resultado = await casoUso.ejecutar(100000, 30000, 10, 0.1);

        expect(repositorio.estimar).toHaveBeenCalledWith(100000, 30000, 0, 10, 0.1);
        expect(resultado).toBe(resultadoDePrueba);
    });

    it('debe rechazar un horizonte no entero', async () =>
    {
        const { casoUso, repositorio } = configurar();

        await expect(casoUso.ejecutar(100000, 30000, 2.5, 0.1))
            .rejects.toThrow('El horizonte de años debe ser un número entero');

        expect(repositorio.estimar).not.toHaveBeenCalled();
    });

    it('debe rechazar una tasa de descuento fuera de rango', async () =>
    {
        const { casoUso, repositorio } = configurar();

        await expect(casoUso.ejecutar(100000, 30000, 10, 1.5))
            .rejects.toThrow('La tasa de descuento no debe ser mayor que 1');

        expect(repositorio.estimar).not.toHaveBeenCalled();
    });
});
