import { inject, Injectable } from '@angular/core';
import { catalogoTarifas } from '../../dominio/entidades/catalogoTarifas.entidad';
import { repositorioElectricidad } from '../puertos/repositorioElectricidad';

/**
 * Caso de uso: consultar el catálogo de tarifas eléctricas.
 */
@Injectable({ providedIn: 'root' })
export class listarTarifasElectricas
{
    private readonly repositorio = inject(repositorioElectricidad);

    async ejecutar(): Promise<catalogoTarifas>
    {
        return this.repositorio.listarTarifas();
    }
}
