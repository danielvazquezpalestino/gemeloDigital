import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { urlBaseApi } from '../../nucleo/configuracion/entorno';
import { traductorErrorHttp } from './traductorErrorHttp';

/**
 * Cliente común de la API.
 *
 * Centraliza la URL base, la construcción de parámetros y la traducción de
 * errores HTTP para que los adaptadores de cada módulo no repitan esa lógica.
 */
@Injectable({ providedIn: 'root' })
export class clienteApi
{
    private readonly http = inject(HttpClient);
    private readonly urlBaseApi = inject(urlBaseApi);

    async obtener<T>(
        ruta: string,
        parametros: HttpParams = new HttpParams(),
        mensajePorDefecto = 'No se pudo completar la solicitud',
    ): Promise<T>
    {
        return this.ejecutar(
            this.http.get<T>(`${this.urlBaseApi}${ruta}`, { params: parametros }),
            mensajePorDefecto,
        );
    }

    async enviar<T>(
        ruta: string,
        cuerpo: unknown,
        mensajePorDefecto = 'No se pudo completar la solicitud',
    ): Promise<T>
    {
        return this.ejecutar(
            this.http.post<T>(`${this.urlBaseApi}${ruta}`, cuerpo),
            mensajePorDefecto,
        );
    }

    async eliminar<T>(
        ruta: string,
        mensajePorDefecto = 'No se pudo completar la solicitud',
    ): Promise<T>
    {
        return this.ejecutar(
            this.http.delete<T>(`${this.urlBaseApi}${ruta}`),
            mensajePorDefecto,
        );
    }

    crearParametros(
        valores: Readonly<Record<string, string | number | boolean | null | undefined>>,
    ): HttpParams
    {
        let parametros = new HttpParams();

        for (const [clave, valor] of Object.entries(valores))
        {
            if (valor !== null && valor !== undefined)
            {
                parametros = parametros.set(clave, String(valor));
            }
        }

        return parametros;
    }

    private async ejecutar<T>(peticion: Observable<T>, mensajePorDefecto: string): Promise<T>
    {
        try
        {
            return await firstValueFrom(peticion);
        }
        catch (excepcion)
        {
            throw traductorErrorHttp.traducir(excepcion, mensajePorDefecto);
        }
    }
}
