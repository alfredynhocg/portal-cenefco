import { ChangeDetectorRef } from '@angular/core'
import { Observable, Subject, switchMap } from 'rxjs'

export interface PaginatedResponse<T> {
    data: T[]
    total: number
}

export interface PaginatedListOptions {
    pageSize?: number
}

export function createPaginatedList<T>(config: {
    fetchFn: (pageIndex: number, pageSize: number) => Observable<PaginatedResponse<T>>
    cdr: ChangeDetectorRef
    pageSize?: number
}) {
    const pageSize = config.pageSize ?? 9

    let _items: T[] = []
    let _total = 0
    let _pageIndex = 1
    let _cargando = true

    const totalPages = () => Math.ceil(_total / pageSize)
    const pages = () => Array.from({ length: totalPages() }, (_, i) => i + 1)

    const trigger$ = new Subject<void>()
    trigger$.pipe(
        switchMap(() => config.fetchFn(_pageIndex, pageSize))
    ).subscribe({
        next: (res) => {
            _items = res.data
            _total = res.total
            _cargando = false
            config.cdr.detectChanges()
            if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        },
        error: () => {
            _items = []
            _cargando = false
            config.cdr.detectChanges()
        }
    })

    const cargar = () => {
        _cargando = true
        config.cdr.detectChanges()
        trigger$.next()
    }

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages() || page === _pageIndex) return
        _pageIndex = page
        cargar()
    }

    return {
        get items()     { return _items },
        get total()     { return _total },
        get pageIndex() { return _pageIndex },
        get cargando()  { return _cargando },
        pageSize,
        totalPages,
        pages,
        cargar,
        goToPage,
    }
}
