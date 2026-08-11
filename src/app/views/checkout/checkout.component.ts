import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { PagoPortalService } from '../../pagos/application/services/pago-portal.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  template: `
    <div class="cd-checkout-espera">
      <div class="cd-checkout-espera__spinner"></div>
      <h2>Verificando tu pago...</h2>
      <p>Por favor espera mientras confirmamos tu transacción.</p>
      @if (intentos > 5) {
        <p class="cd-hint">Esto está tardando más de lo esperado. Si ya pagaste, revisa tu email.</p>
      }
    </div>
  `,
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private route       = inject(ActivatedRoute);
  private router      = inject(Router);
  private pagoService = inject(PagoPortalService);
  private cdr         = inject(ChangeDetectorRef);

  intentos = 0;
  private sub?: Subscription;

  ngOnInit(): void {
    const sessionId = Number(this.route.snapshot.paramMap.get('session_id'));
    if (!sessionId) {
      this.router.navigate(['/pago-fallido']);
      return;
    }

    this.sub = interval(3000).pipe(
      switchMap(() => this.pagoService.getEstado(sessionId)),
      takeWhile(res => res.estado === 'pendiente', true),
    ).subscribe({
      next: res => {
        this.intentos++;
        this.cdr.detectChanges();
        if (res.estado === 'pagado') {
          this.router.navigate(['/pago-exitoso']);
        } else if (res.estado === 'fallido' || res.estado === 'expirado') {
          this.router.navigate(['/pago-fallido']);
        }
      },
      error: () => this.router.navigate(['/pago-fallido']),
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
