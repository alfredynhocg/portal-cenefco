import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { map, switchMap, from, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

function hexToBuffer(hex: string): ArrayBuffer {
  const pairs = hex.match(/.{2}/g) ?? [];
  return new Uint8Array(pairs.map(b => parseInt(b, 16))).buffer as ArrayBuffer;
}

async function descifrar(encrypted: string, ivHex: string): Promise<unknown> {
  const keyBuffer    = hexToBuffer(environment.apiEncryptKey);
  const ivBuffer     = hexToBuffer(ivHex);
  const cipherBuffer = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0)).buffer as ArrayBuffer;

  const key = await crypto.subtle.importKey(
    'raw', keyBuffer, { name: 'AES-CBC' }, false, ['decrypt']
  );

  const plain = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: ivBuffer }, key, cipherBuffer
  );

  return JSON.parse(new TextDecoder().decode(plain));
}

export function decryptResponseInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const isPortal = req.url.includes('/portal/') || req.url.includes('/public/');
  const reqFinal = isPortal
    ? req.clone({ setHeaders: { 'X-Portal-Key': environment.portalApiKey } })
    : req;

  return next(reqFinal).pipe(
    switchMap(event => {
      if (
        !(event instanceof HttpResponse) ||
        event.headers.get('X-Encrypted') !== '1' ||
        !event.body ||
        typeof event.body !== 'object'
      ) {
        return [event];
      }

      const { encrypted, iv } = event.body as { encrypted: string; iv: string };

      if (!encrypted || !iv) {
        return [event];
      }

      if (!environment.apiEncryptKey) {
        console.warn('[decrypt] apiEncryptKey no configurada — respuesta sin descifrar');
        return [event];
      }

      return from(descifrar(encrypted, iv)).pipe(
        map(plainBody => event.clone({ body: plainBody })),
        catchError(err => {
          console.error('[decrypt] Error al descifrar respuesta:', err);
          return throwError(() => new Error('No se pudo descifrar la respuesta del servidor.'));
        })
      );
    })
  );
}
