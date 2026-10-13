const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapes text for interpolation into HTML. Era files are hand-edited, so never trust their contents as markup. */
export const esc = (s: unknown): string => String(s ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Only http(s) links from the data are turned into anchors. */
export const safeUrl = (u: string | undefined): string | null => (u && /^https?:\/\//i.test(u) ? u : null);
