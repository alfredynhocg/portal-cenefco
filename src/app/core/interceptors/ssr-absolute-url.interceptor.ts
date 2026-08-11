import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { environment } from '../../../environments/environment';

export function ssrAbsoluteUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const isServer = isPlatformServer(inject(PLATFORM_ID));

  if (isServer && (req.url.startsWith('/api') || req.url.startsWith('/storage'))) {
    return next(req.clone({ url: environment.apiBaseUrl + req.url }));
  }

  return next(req);
}
