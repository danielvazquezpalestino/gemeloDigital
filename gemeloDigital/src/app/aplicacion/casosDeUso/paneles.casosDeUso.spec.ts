import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { catalogoPaneles } from '../../dominio/entidades/catalogoPaneles.entidad';
import { repositorioPaneles } from '../puertos/repositorioPaneles';
import { listarPanelesSolares } from './listarPanelesSolares.casoUso';

const catalogoDePrueba = {} as catalogoPaneles;

function configurar()
{
    const repositorio = {
        listar: vi.fn(),
    };

    repositorio.listar.mockResolvedValue(catalogoDePrueba);

    TestBed.configureTestingModule({
        providers: [
            listarPanelesSolares,
            { provide: repositorioPaneles, useValue: repositorio },
        ],
    });

    return {
        casoUso: TestBed.inject(listarPanelesSolares),
        repositorio,
    };
}

describe('listarPanelesSolares', () =>
{
    afterEach(() =>
    {
        TestBed.resetTestingModule();
    });

    it('debe listar los paneles sin filtros', async () =>
    {
        const { casoUso, repositorio } = configurar();

        const resultado = await casoUso.ejecutar();

        expect(repositorio.listar).toHaveBeenCalledWith(null, null);
        expect(resultado).toBe(catalogoDePrueba);
    });

    it('debe normalizar los filtros de fabricante y potencia', async () =>
    {
        const { casoUso, repositorio } = configurar();

        await casoUso.ejecutar('  SolarTech  ', 450);

        expect(repositorio.listar).toHaveBeenCalledWith('SolarTech', 450);
    });

    it('debe rechazar una potencia no positiva', async () =>
    {
        const { casoUso, repositorio } = configurar();

        await expect(casoUso.ejecutar(null, 0))
            .rejects.toThrow('La potencia mínima debe ser mayor que 0');

        expect(repositorio.listar).not.toHaveBeenCalled();
    });
});
