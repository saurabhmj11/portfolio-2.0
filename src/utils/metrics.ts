/** A metric string split into an animatable number and its surrounding text. */
export interface ParsedMetric {
    prefix: string;
    value: number;
    suffix: string;
    decimals: number;
    grouped: boolean;
}

/**
 * Split a display metric into prefix / number / suffix so it can count up
 * without changing how it reads. Non-numeric metrics return null and are
 * shown as-is.
 *   "10x Faster" → '' · 10 · 'x Faster'
 *   "<500ms"     → '<' · 500 · 'ms'
 *   "1,200+"     → '' · 1200 · '+' (grouped)
 *   "Yes"        → null
 */
export function parseMetric(raw: string): ParsedMetric | null {
    const m = raw.match(/^([^\d]*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!m) return null;
    const num = m[2];
    return {
        prefix: m[1],
        value: parseFloat(num.replace(/,/g, '')),
        suffix: m[3],
        decimals: num.includes('.') ? num.split('.')[1].length : 0,
        grouped: num.includes(','),
    };
}

/** Render a parsed metric at an intermediate value, keeping its original precision and grouping. */
export function formatMetric(p: ParsedMetric, v: number): string {
    const n = p.grouped
        ? v.toLocaleString('en-US', { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals })
        : v.toFixed(p.decimals);
    return `${p.prefix}${n}${p.suffix}`;
}
