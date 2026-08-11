import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'cenefco_trivia_sonido';

const NOTAS_FONDO = [220, 261.6, 293.7, 329.6, 392, 329.6, 293.7, 261.6];

@Injectable({ providedIn: 'root' })
export class TriviaAudioService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private ctx: AudioContext | null = null;

  habilitado = signal(this.leerPreferencia());

  private musicaGain: GainNode | null = null;
  private musicaTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private musicaSonando = false;
  private musicaPaso = 0;

  private leerPreferencia(): boolean {
    if (!this.isBrowser) return true;
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado === null ? true : guardado === '1';
  }

  toggleSonido(): void {
    const nuevo = !this.habilitado();
    this.habilitado.set(nuevo);
    if (this.isBrowser) localStorage.setItem(STORAGE_KEY, nuevo ? '1' : '0');

    if (!nuevo) {
      this.detenerMusicaFondo();
    } else if (this.musicaSonando) {
      this.programarSiguienteNota();
    }
  }

  private getContext(): AudioContext | null {
    if (!this.isBrowser) return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  private tono(frecuencia: number, inicioSeg: number, duracionSeg: number, tipo: OscillatorType, volumen: number, destino?: AudioNode): void {
    if (!this.habilitado()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tipo;
    osc.frequency.value = frecuencia;

    const inicio = ctx.currentTime + inicioSeg;
    gain.gain.setValueAtTime(0, inicio);
    gain.gain.linearRampToValueAtTime(volumen, inicio + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, inicio + duracionSeg);

    osc.connect(gain).connect(destino ?? ctx.destination);
    osc.start(inicio);
    osc.stop(inicio + duracionSeg + 0.02);
  }

  private barrido(desde: number, hasta: number, inicioSeg: number, duracionSeg: number, tipo: OscillatorType, volumen: number): void {
    if (!this.habilitado()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tipo;

    const inicio = ctx.currentTime + inicioSeg;
    osc.frequency.setValueAtTime(desde, inicio);
    osc.frequency.exponentialRampToValueAtTime(hasta, inicio + duracionSeg);

    gain.gain.setValueAtTime(0, inicio);
    gain.gain.linearRampToValueAtTime(volumen, inicio + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, inicio + duracionSeg);

    osc.connect(gain).connect(ctx.destination);
    osc.start(inicio);
    osc.stop(inicio + duracionSeg + 0.02);
  }

  girar(): void {
    this.barrido(180, 720, 0, 0.9, 'sine', 0.05);
  }

  clic(): void {
    this.tono(440, 0, 0.08, 'square', 0.03);
  }

  acierto(): void {
    this.tono(660, 0, 0.12, 'sine', 0.06);
    this.tono(880, 0.1, 0.16, 'sine', 0.06);
  }

  error(): void {
    this.barrido(220, 110, 0, 0.28, 'sawtooth', 0.05);
  }

  perderVida(): void {
    this.barrido(400, 160, 0, 0.35, 'triangle', 0.05);
  }

  victoria(): void {
    [523, 659, 784, 1047].forEach((freq, i) => {
      this.tono(freq, i * 0.11, 0.22, 'sine', 0.06);
    });
  }

  derrota(): void {
    this.barrido(300, 90, 0, 0.7, 'sawtooth', 0.045);
  }

  tick(): void {
    this.tono(880, 0, 0.05, 'square', 0.02);
  }

  iniciarMusicaFondo(): void {
    if (this.musicaSonando) return;
    this.musicaSonando = true;
    this.musicaPaso = 0;
    if (this.habilitado()) this.programarSiguienteNota();
  }

  detenerMusicaFondo(): void {
    this.musicaSonando = false;
    if (this.musicaTimeoutId !== null) {
      clearTimeout(this.musicaTimeoutId);
      this.musicaTimeoutId = null;
    }
  }

  private programarSiguienteNota(): void {
    if (!this.musicaSonando || !this.habilitado()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (!this.musicaGain) {
      this.musicaGain = ctx.createGain();
      this.musicaGain.gain.value = 1;
      this.musicaGain.connect(ctx.destination);
    }

    const freq = NOTAS_FONDO[this.musicaPaso % NOTAS_FONDO.length];
    this.tono(freq, 0, 0.9, 'sine', 0.05, this.musicaGain);
    this.musicaPaso++;

    this.musicaTimeoutId = setTimeout(() => this.programarSiguienteNota(), 650);
  }
}
