import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, SimpleChanges, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss'],
})
export class VideoModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() readonly visibleChange = new EventEmitter<boolean>();
  @Input() cursoNombre = '';
  @Input() urlVideo: string | null = null;

  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);
  private scriptTimer?: ReturnType<typeof setTimeout>;

  videoId: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urlVideo']) {
      this.videoId = this.extractVideoId(this.urlVideo);
    }
    if (changes['visible']?.currentValue === true) {
      this.videoId = this.extractVideoId(this.urlVideo);
      this.scriptTimer = setTimeout(() => this.loadTikTokScript(), 100);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.scriptTimer);
  }

  private extractVideoId(url: string | null): string | null {
    if (!url) return null;
    const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    return match ? match[1] : null;
  }

  private loadTikTokScript(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const existing = document.getElementById('tiktok-embed-script');
    if (existing) {
      existing.remove();
      (window as any).tiktokEmbedLoaded = false;
    }
    const script = document.createElement('script');
    script.id = 'tiktok-embed-script';
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
}
