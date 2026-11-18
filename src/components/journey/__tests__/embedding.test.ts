import { describe, it, expect } from 'vitest';
import { buildEmbeddingSpace, buildPointCloud, cosine, embed, TOP_K } from '../embedding';
import projectsData from '../../../data/projectsData';

describe('hero embedding space', () => {
    const space = buildEmbeddingSpace();

    it('embeds vectors with unit length', () => {
        const v = embed('LangGraph multi-agent RAG pipeline');
        expect(cosine(v, v)).toBeCloseTo(1, 5);
    });

    it('ranks every project and retrieves exactly top-k', () => {
        const ranks = space.projects.map(p => p.rank).sort((a, b) => a - b);
        expect(ranks).toEqual(space.projects.map((_, i) => i));
        expect(space.projects.filter(p => p.retrieved)).toHaveLength(TOP_K);
    });

    it('retrieves by real cosine similarity (retrieved scores beat the rest)', () => {
        const retrieved = space.projects.filter(p => p.retrieved).map(p => p.score);
        const rest = space.projects.filter(p => !p.retrieved).map(p => p.score);
        expect(Math.min(...retrieved)).toBeGreaterThanOrEqual(Math.max(...rest));
        for (const p of space.projects) {
            expect(p.score).toBeCloseTo(cosine(p.vector, space.query.vector), 6);
        }
    });

    it('is deterministic and fits inside the scene', () => {
        const again = buildPointCloud(space);
        const first = buildPointCloud(space);
        expect(Array.from(again.positions.slice(0, 30))).toEqual(Array.from(first.positions.slice(0, 30)));
        for (const p of space.projects) {
            expect(Math.hypot(...p.position)).toBeLessThanOrEqual(5.5 * 1.25 + 1e-6);
        }
    });

    it('leaves concept projects (no repo or demo) out of the searchable space', () => {
        expect(space.projects.some(p => projectsData.find(d => d.id === p.id)?.status === 'concept')).toBe(false);
    });

    it('retrieves the flagship first for the demo question (real scores, no overrides)', () => {
        const best = [...space.projects].sort((a, b) => a.rank - b.rank)[0];
        expect(best.id).toBe('doc-ai');
    });

    it('prints the retrieval table (for humans)', () => {
        const table = [...space.projects]
            .sort((a, b) => a.rank - b.rank)
            .map(p => `${p.rank + 1}. ${p.title.padEnd(32)} ${p.score.toFixed(3)}${p.retrieved ? '  ← top-k' : ''}`);
        console.info(table.join('\n'));
        expect(table.length).toBe(space.projects.length);
    });
});
