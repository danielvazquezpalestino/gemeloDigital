import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { iniciarSesion as iniciarSesionCasoUso } from '../../../../aplicacion/casosDeUso/iniciarSesion.casoUso';

/**
 * Página de inicio de sesión.
 *
 * Componente de presentación: valida el formulario, invoca el caso de uso y
 * navega al panel. No conoce HttpClient ni la forma de la API.
 */
@Component({
    selector: 'gd-iniciar-sesion',
    imports: [ReactiveFormsModule],
    templateUrl: './iniciarSesion.html',
    styleUrl: './iniciarSesion.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'gd-pagina-autenticacion' },
})
export class iniciarSesion
{
    private readonly constructorFormulario = inject(NonNullableFormBuilder);
    private readonly casoUsoIniciarSesion = inject(iniciarSesionCasoUso);
    private readonly enrutador = inject(Router);

    protected readonly formulario = this.constructorFormulario.group({
        correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
        contrasenia: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
    });

    protected readonly enviando = signal(false);
    protected readonly mensajeError = signal<string | null>(null);
    protected readonly mostrarContrasenia = signal(false);

    protected async enviar(): Promise<void>
    {
        this.mensajeError.set(null);

        if (this.formulario.invalid)
        {
            this.formulario.markAllAsTouched();
            return;
        }

        this.enviando.set(true);

        try
        {
            const { correo, contrasenia } = this.formulario.getRawValue();
            await this.casoUsoIniciarSesion.ejecutar(correo, contrasenia);
            await this.enrutador.navigateByUrl('/panel');
        }
        catch (excepcion)
        {
            this.mensajeError.set(
                excepcion instanceof Error
                    ? excepcion.message
                    : 'No se pudo iniciar sesión. Inténtalo de nuevo.',
            );
        }
        finally
        {
            this.enviando.set(false);
        }
    }

    protected alternarContrasenia(): void
    {
        this.mostrarContrasenia.update((mostrar) => !mostrar);
    }
}
