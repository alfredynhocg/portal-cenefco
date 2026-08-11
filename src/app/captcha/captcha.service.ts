import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CaptchaResponse {
    key: string;
    img: string;
}

@Injectable({ providedIn: 'root' })
export class CaptchaService {
    private http = inject(HttpClient);
    private readonly url = '/api/v1/public/captcha';

    generate(): Observable<CaptchaResponse> {
        return this.http.get<CaptchaResponse>(this.url);
    }
}
