import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'truncate', standalone: true, pure: true })
export class TruncatePipe implements PipeTransform {
    transform(text: string | null | undefined, limit = 100, mode: 'chars' | 'words' = 'chars'): string {
        if (!text) return ''
        const plano = this.stripHtml(text)
        if (mode === 'words') {
            const words = plano.trim().split(/\s+/)
            return words.length <= limit ? plano : words.slice(0, limit).join(' ') + '...'
        }
        return plano.length > limit ? plano.slice(0, limit) + '...' : plano
    }

    private stripHtml(html: string): string {
        return html
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\s+/g, ' ')
            .trim()
    }
}
