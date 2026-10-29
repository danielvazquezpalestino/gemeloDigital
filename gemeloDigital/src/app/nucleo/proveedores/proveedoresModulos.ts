import { Provider } from '@angular/core';
import { repositorioAnalitica } from '../../aplicacion/puertos/repositorioAnalitica';
import { repositorioClima } from '../../aplicacion/puertos/repositorioClima';
import { repositorioElectricidad } from '../../aplicacion/puertos/repositorioElectricidad';
import { repositorioFinanciero } from '../../aplicacion/puertos/repositorioFinanciero';
import { repositorioIncentivos } from '../../aplicacion/puertos/repositorioIncentivos';
import { repositorioPaneles } from '../../aplicacion/puertos/repositorioPaneles';
import { repositorioSimulaciones } from '../../aplicacion/puertos/repositorioSimulaciones';
import { repositorioSolar } from '../../aplicacion/puertos/repositorioSolar';
import { repositorioAnaliticaHttp } from '../../infraestructura/repositorios/repositorioAnaliticaHttp';
import { repositorioClimaHttp } from '../../infraestructura/repositorios/repositorioClimaHttp';
import { repositorioElectricidadHttp } from '../../infraestructura/repositorios/repositorioElectricidadHttp';
import { repositorioFinancieroHttp } from '../../infraestructura/repositorios/repositorioFinancieroHttp';
import { repositorioIncentivosHttp } from '../../infraestructura/repositorios/repositorioIncentivosHttp';
import { repositorioPanelesHttp } from '../../infraestructura/repositorios/repositorioPanelesHttp';
import { repositorioSimulacionesHttp } from '../../infraestructura/repositorios/repositorioSimulacionesHttp';
import { repositorioSolarHttp } from '../../infraestructura/repositorios/repositorioSolarHttp';

/**
 * Cableado puerto -> adaptador de los módulos del gemelo digital.
 */
export const proveedoresModulos: Provider[] = [
    { provide: repositorioClima, useClass: repositorioClimaHttp },
    { provide: repositorioAnalitica, useClass: repositorioAnaliticaHttp },
    { provide: repositorioElectricidad, useClass: repositorioElectricidadHttp },
    { provide: repositorioPaneles, useClass: repositorioPanelesHttp },
    { provide: repositorioFinanciero, useClass: repositorioFinancieroHttp },
    { provide: repositorioIncentivos, useClass: repositorioIncentivosHttp },
    { provide: repositorioSolar, useClass: repositorioSolarHttp },
    { provide: repositorioSimulaciones, useClass: repositorioSimulacionesHttp },
];
