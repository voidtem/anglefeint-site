export const SUPPORTED_LOCALES = ['en', 'ja', 'ko', 'es', 'zh'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
	en: 'English',
	ja: '日本語',
	ko: '한국어',
	es: 'Español',
	zh: '中文',
};

export function isLocale(value: string): value is Locale {
	return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function withLeadingSlash(path: string): string {
	if (!path) return '/';
	return path.startsWith('/') ? path : `/${path}`;
}

export function localePath(locale: Locale, path = '/'): string {
	const normalized = withLeadingSlash(path);
	if (normalized === '/') return `/${locale}/`;
	return `/${locale}${normalized.endsWith('/') ? normalized : `${normalized}/`}`;
}

export function stripLocaleFromPath(pathname: string, locale: Locale): string {
	const prefix = `/${locale}`;
	if (!pathname.startsWith(prefix)) return pathname;
	const withoutLocale = pathname.slice(prefix.length);
	return withoutLocale || '/';
}

export function blogIdToSlug(id: string, locale: Locale): string {
	return id.startsWith(`${locale}/`) ? id.slice(locale.length + 1) : id;
}

export function blogIdToSlugAnyLocale(id: string): string {
	const parts = id.split('/');
	if (parts.length > 1 && isLocale(parts[0])) return parts.slice(1).join('/');
	return id;
}
