interface HCaptcha {
    render(container: string | HTMLElement, params: { sitekey: string; callback?: (token: string) => void; 'expired-callback'?: () => void; 'error-callback'?: () => void; theme?: 'light' | 'dark'; size?: 'normal' | 'compact' | 'invisible'; }): string;
    getResponse(widgetId?: string): string;
    reset(widgetId?: string): void;
    remove(widgetId?: string): void;
    execute(widgetId?: string): void;
}

declare const hcaptcha: HCaptcha;
