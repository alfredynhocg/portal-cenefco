import { Pipe, PipeTransform } from '@angular/core'
import { environment } from '../../../environments/environment'

@Pipe({ name: 'imageUrl', standalone: true, pure: true })
export class ImageUrlPipe implements PipeTransform {
    transform(url: string | null | undefined): string | null {
        if (!url) return null
        if (url.startsWith('http')) return url
        return environment.apiBaseUrl + url
    }
}
