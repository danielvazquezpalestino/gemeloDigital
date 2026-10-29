import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { estadisticasMunicipios } from '../../dominio/entidades/estadisticasMunicipios.entidad';
import { repositorioAnalitica } from '../puertos/repositorioAnalitica';
import { obtenerEstadisticasMunicipios } from './obtenerEstadisticasMunicipios.casoUso';

const estadisticasDePrueba = {} as estadisticasMunicipios;

function configurar()
{
    const repositorio = {
        obtenerEstadisticas: vi.fn(),
    };

    repositorio.obtenerEstadisticas.mockResolvedValue(estadisticasDePrueba);

    TestBed.configureTestingModule({
        providers: [
            obtenerEstadisticasMunicipios,
            { provide: repositorioAnalitica, useValue: repositorio },
        ],
    });

    return {
        casoUso: TestBed.inject(obtenerEstadisticasMunicipios),
        repositorio,
    };
}

describe('obtenerEstadisticasMunicipios', () =>
{
    afterEach(() =>
    {
        TestBed.resetTestingModule();
    });

    it('debe consultar las estadísticas sin filtros por defecto', async () =>
    {
        const { casoUso, repositorio } = configurar();

        const resultado = await casoUso.ejecutar();

        expect(repositorio.obtenerEstadisticas).toHaveBeenCalledWith(null, null);
        expect(resultado).toBe(estadisticasDePrueba);
    });

    it('debe consultar las estadísticas con municipio y periodo', async () =>
    {
        const { casoUso, repositorio } = configurar();

        await casoUso.ejecutar(110, 30);

        expect(repositorio.obtenerEstadisticas).toHaveBeenCalledWith(110, 30);
    });

    it('debe rechazar un periodo fuera de rango', async () =>
    {
        const { casoUso, repositorio } = configurar();

        await expect(casoUso.ejecutar(null, 4000))
            .rejects.toThrow('El periodo no debe ser mayor que 3650');

        expect(repositorio.obtenerEstadisticas).not.toHaveBeenCalled();
    });
});
