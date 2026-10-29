import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { consultaIncentivos } from '../../dominio/entidades/consultaIncentivos.entidad';
import { evaluacionElegibilidadIncentivos } from '../../dominio/entidades/evaluacionElegibilidadIncentivos.entidad';
import { repositorioIncentivos } from '../puertos/repositorioIncentivos';
import { consultarIncentivos } from './consultarIncentivos.casoUso';
import { evaluarElegibilidadIncentivos } from './evaluarElegibilidadIncentivos.casoUso';

const consultaDePrueba = {} as consultaIncentivos;
const evaluacionDePrueba = {} as evaluacionElegibilidadIncentivos;

function configurar()
{
    const repositorio = {
        consultar: vi.fn(),
        evaluarElegibilidad: vi.fn(),
    };

    repositorio.consultar.mockResolvedValue(consultaDePrueba);
    repositorio.evaluarElegibilidad.mockResolvedValue(evaluacionDePrueba);

    TestBed.configureTestingModule({
        providers: [
            consultarIncentivos,
            evaluarElegibilidadIncentivos,
            { provide: repositorioIncentivos, useValue: repositorio },
        ],
    });

    return {
        casoUsoConsulta: TestBed.inject(consultarIncentivos),
        casoUsoElegibilidad: TestBed.inject(evaluarElegibilidadIncentivos),
        repositorio,
    };
}

describe('casos de uso de incentivos', () =>
{
    afterEach(() =>
    {
        TestBed.resetTestingModule();
    });

    it('debe consultar incentivos con paginación por defecto', async () =>
    {
        const { casoUsoConsulta, repositorio } = configurar();

        const resultado = await casoUsoConsulta.ejecutar();

        expect(repositorio.consultar).toHaveBeenCalledWith({
            tipoBeneficiario: null,
            municipio: null,
            estado: null,
            pagina: 1,
            limite: 20,
        });
        expect(resultado).toBe(consultaDePrueba);
    });

    it('debe normalizar los filtros de la consulta', async () =>
    {
        const { casoUsoConsulta, repositorio } = configurar();

        await casoUsoConsulta.ejecutar({
            tipoBeneficiario: 'business',
            municipio: '  Puebla  ',
            estado: 'active',
            pagina: 2,
            limite: 10,
        });

        expect(repositorio.consultar).toHaveBeenCalledWith({
            tipoBeneficiario: 'business',
            municipio: 'Puebla',
            estado: 'active',
            pagina: 2,
            limite: 10,
        });
    });

    it('debe rechazar un estado de incentivo desconocido', async () =>
    {
        const { casoUsoConsulta, repositorio } = configurar();

        await expect(casoUsoConsulta.ejecutar({ estado: 'otro' as never }))
            .rejects.toThrow('El estado del incentivo debe ser active, expired, upcoming o unverified');

        expect(repositorio.consultar).not.toHaveBeenCalled();
    });

    it('debe evaluar la elegibilidad con los datos normalizados', async () =>
    {
        const { casoUsoElegibilidad, repositorio } = configurar();

        const resultado = await casoUsoElegibilidad.ejecutar({
            tipoBeneficiario: 'home',
            municipio: '  Puebla ',
            capacidadSistemaKw: 5,
            tipoInstalacion: '  Techo  ',
        });

        expect(repositorio.evaluarElegibilidad).toHaveBeenCalledWith({
            tipoBeneficiario: 'home',
            municipio: 'Puebla',
            capacidadSistemaKw: 5,
            tipoInstalacion: 'Techo',
        });
        expect(resultado).toBe(evaluacionDePrueba);
    });

    it('debe rechazar una elegibilidad sin municipio', async () =>
    {
        const { casoUsoElegibilidad, repositorio } = configurar();

        await expect(casoUsoElegibilidad.ejecutar({
            tipoBeneficiario: 'home',
            municipio: '   ',
        })).rejects.toThrow('El municipio es obligatorio');

        expect(repositorio.evaluarElegibilidad).not.toHaveBeenCalled();
    });
});
