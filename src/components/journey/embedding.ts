/**
 * A tiny, honest "embedding space" for the hero.
 *
 * Every shipped project (concepts excluded) is embedded from its title,
 * category, description, tech stack, approach and evaluation summary: hashed
 * TF-IDF (sublinear tf × idf, signed feature hashing), then L2-normalised. The visitor's query is embedded the same way and the
 * top-k projects are retrieved by real cosine similarity, so the scores shown
 * on screen are computed, not invented. A seeded random projection maps the
 * vectors to 3D so semantically similar projects land near each other.
 */
import projectsData, { type Project } from '../../data/projectsData';

export const DIMS = 512;
export const TOP_K = 4;
// Mirrors the hero's claim, so the demo retrieves the evidence for it.
export const QUERY = 'Who builds hybrid retrieval and agent systems, and evaluates them?';

const STOPWORDS = new Set([
    'a', 'an', 'and', 'the', 'of', 'for', 'to', 'in', 'on', 'with', 'by', 'from',
    'is', 'are', 'that', 'this', 'it', 'as', 'at', 'or', 'into', 'who', 'can',
    'their', 'its', 'be', 'using', 'via', 'your', 'our', 'we', 'i',
]);

/** Deterministic PRNG so the scene is identical on every visit. */
export function mulberry32(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** FNV-1a string hash. */
function hash(str: string): number {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
}

export function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9+#. ]+/g, ' ')
        .split(/\s+/)
        .map(t => t.replace(/^\.+|\.+$/g, ''))
        // light stemming: "agents" ≈ "agent", "measures"/"measured"/"measuring" ≈ "measur"
        .map(stem)
        .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

function stem(t: string): string {
    if (t.length <= 4) return t;
    for (const suf of ['ing', 'ed', 'es', 's']) {
        if (t.endsWith(suf) && t.length - suf.length >= 4) return t.slice(0, -suf.length);
    }
    return t;
}

/** Inverse document frequency over a small corpus (smoothed, always > 0). */
export function idfTable(docs: string[]): Map<string, number> {
    const df = new Map<string, number>();
    for (const d of docs) for (const t of new Set(tokenize(d))) df.set(t, (df.get(t) ?? 0) + 1);
    const n = docs.length;
    const idf = new Map<string, number>();
    for (const [t, c] of df) idf.set(t, Math.log((1 + n) / (1 + c)) + 1);
    return idf;
}

/**
 * Hashed TF-IDF: sublinear term frequency × IDF, signed feature hashing into
 * DIMS buckets, then L2-normalised. Without an idf table every term weighs 1.
 */
export function embed(text: string, idf?: Map<string, number>): Float32Array {
    const tf = new Map<string, number>();
    for (const t of tokenize(text)) tf.set(t, (tf.get(t) ?? 0) + 1);
    const v = new Float32Array(DIMS);
    for (const [tok, c] of tf) {
        const h = hash(tok);
        const w = (1 + Math.log(c)) * (idf?.get(tok) ?? 1);
        v[h % DIMS] += (h & 0x80000000 ? -1 : 1) * w;
    }
    return normalise(v);
}

function normalise(v: Float32Array): Float32Array {
    let n = 0;
    for (let i = 0; i < v.length; i++) n += v[i] * v[i];
    n = Math.sqrt(n) || 1;
    for (let i = 0; i < v.length; i++) v[i] /= n;
    return v;
}

export function cosine(a: Float32Array, b: Float32Array): number {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
}

function projectText(p: Project): string {
    // Everything the case study actually says: tech stack and category (weighted),
    // the approach, and — where it exists — the evaluation write-up.
    const tech = p.technologies.join(' ');
    return [
        p.title, p.category, p.category, p.description, tech, tech,
        p.details.solution, p.evaluation?.summary ?? '',
    ].join(' ');
}

/** Concept projects (no repo or demo yet) are not part of the searchable space. */
export function searchableProjects(): Project[] {
    return projectsData.filter(p => p.status !== 'concept');
}

export interface EmbeddedProject {
    id: string;
    title: string;
    category: string;
    vector: Float32Array;
    position: [number, number, number];
    score: number;      // cosine similarity to the query
    rank: number;       // 0-based rank by score
    retrieved: boolean; // in the top-k
}

export interface EmbeddingSpace {
    projects: EmbeddedProject[];
    query: { vector: Float32Array; position: [number, number, number] };
}

/** Seeded Gaussian random projection DIMS → 3. */
function makeProjection(seed: number): Float32Array[] {
    const rnd = mulberry32(seed);
    const gauss = () => {
        const u = Math.max(rnd(), 1e-9);
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
    };
    return [0, 1, 2].map(() => Float32Array.from({ length: DIMS }, gauss));
}

function project(v: Float32Array, P: Float32Array[]): [number, number, number] {
    return [cosine(v, P[0]), cosine(v, P[1]), cosine(v, P[2])];
}

let cached: EmbeddingSpace | null = null;

export function buildEmbeddingSpace(radius = 5.5): EmbeddingSpace {
    if (cached) return cached;

    const P = makeProjection(20260);
    const docs = searchableProjects();
    const idf = idfTable([...docs.map(projectText), QUERY]);
    const queryVec = embed(QUERY, idf);

    const raw = docs.map(p => {
        const vector = embed(projectText(p), idf);
        return { p, vector, pos: project(vector, P), score: cosine(vector, queryVec) };
    });
    const qPos = project(queryVec, P);

    // Centre on the mean and scale so the farthest project sits at `radius`.
    const mean = [0, 1, 2].map(i => raw.reduce((s, r) => s + r.pos[i], 0) / raw.length);
    const centre = (x: [number, number, number]): [number, number, number] =>
        [x[0] - mean[0], x[1] - mean[1], x[2] - mean[2]];
    const centred = raw.map(r => centre(r.pos));
    const maxR = Math.max(...centred.map(c => Math.hypot(c[0], c[1], c[2]))) || 1;
    const scale = radius / maxR;
    // Squash depth a little so labels don't hide behind each other.
    const fit = (c: [number, number, number]): [number, number, number] =>
        [c[0] * scale * 1.25, c[1] * scale * 0.8, c[2] * scale * 0.6];

    const order = [...raw].sort((a, b) => b.score - a.score).map(r => r.p.id);

    const projects: EmbeddedProject[] = raw.map((r, i) => {
        const rank = order.indexOf(r.p.id);
        return {
            id: r.p.id,
            title: r.p.title,
            category: r.p.category,
            vector: r.vector,
            position: fit(centred[i]),
            score: r.score,
            rank,
            retrieved: rank < TOP_K,
        };
    });

    cached = { projects, query: { vector: queryVec, position: fit(centre(qPos)) } };
    return cached;
}

/** Seeded point cloud: a Gaussian cluster of "chunks" around each project, plus sparse noise. */
export function buildPointCloud(space: EmbeddingSpace, perCluster = 220, noise = 700) {
    const rnd = mulberry32(7);
    const gauss = () => {
        const u = Math.max(rnd(), 1e-9);
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
    };
    const total = space.projects.length * perCluster + noise;
    const positions = new Float32Array(total * 3);
    const cluster = new Float32Array(total);   // project index, or -1 for noise
    const seeds = new Float32Array(total);     // per-point random for drift/size

    let k = 0;
    space.projects.forEach((p, ci) => {
        for (let j = 0; j < perCluster; j++, k++) {
            const s = 0.55 + rnd() * 0.35;
            positions[k * 3] = p.position[0] + gauss() * s;
            positions[k * 3 + 1] = p.position[1] + gauss() * s;
            positions[k * 3 + 2] = p.position[2] + gauss() * s;
            cluster[k] = ci;
            seeds[k] = rnd();
        }
    });
    for (let j = 0; j < noise; j++, k++) {
        // Shell-ish distribution so the space feels deep, not boxed.
        const r = 4 + rnd() * 9;
        const th = rnd() * Math.PI * 2;
        const ph = Math.acos(2 * rnd() - 1);
        positions[k * 3] = r * Math.sin(ph) * Math.cos(th) * 1.4;
        positions[k * 3 + 1] = r * Math.cos(ph) * 0.8;
        positions[k * 3 + 2] = r * Math.sin(ph) * Math.sin(th) * 0.9;
        cluster[k] = -1;
        seeds[k] = rnd();
    }
    return { positions, cluster, seeds, count: total };
}
