import { describe, it, expect } from 'vitest';
import { parseMetric, formatMetric } from '../metrics';

describe('parseMetric / formatMetric', () => {
    it.each([
        ['10x Faster', '', 10, 'x Faster'],
        ['<500ms', '<', 500, 'ms'],
        ['99.4%', '', 99.4, '%'],
        ['0.25', '', 0.25, ''],
        ['1,200+', '', 1200, '+'],
        ['50+', '', 50, '+'],
        ['+40%', '+', 40, '%'],
    ])('parses %s', (raw, prefix, value, suffix) => {
        const p = parseMetric(raw)!;
        expect(p).not.toBeNull();
        expect([p.prefix, p.value, p.suffix]).toEqual([prefix, value, suffix]);
    });

    it('returns null for non-numeric metrics', () => {
        for (const raw of ['Yes', 'Optimized', 'Auto', 'Web']) expect(parseMetric(raw)).toBeNull();
    });

    it('round-trips: the final frame reads exactly like the source', () => {
        for (const raw of ['10x Faster', '<500ms', '99.4%', '0.25', '1,200+', '+40%', '12+', '2 hrs/day']) {
            const p = parseMetric(raw)!;
            expect(formatMetric(p, p.value)).toBe(raw);
        }
    });

    it('keeps precision while counting (no "0.25" → "0.3")', () => {
        const p = parseMetric('0.25')!;
        expect(formatMetric(p, 0.125)).toBe('0.13');
        expect(formatMetric(p, 0)).toBe('0.00');
    });
});
