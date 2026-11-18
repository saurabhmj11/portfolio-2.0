// ─── Shared Project Data ──────────────────────────────────────────────────────
// Single source of truth — used by Projects.tsx (Selected Work), ProjectModal,
// the embedding-space hero journey, and CaseStudy.tsx (/project/:id).
//
// Content rule: every claim here should be checkable — in the linked repo, the
// live app, or the visitor's own eyes. Outcome numbers (time saved, accuracy,
// client counts) only belong here with a named source/measurement.

export interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    technologies: string[];
    details: {
        problem: string;
        solution: string;
        architecture: string;
        impact: string;
    };
    metrics: { label: string; value: string }[];
    link?: string;       // live demo URL
    liveUrl?: string;    // alias used by Projects.tsx modal
    repo?: string;
    position: { x: string; y: string }; // used by neural web layout
    /** 'concept' = no public repo or demo yet; labelled as such everywhere it's shown. */
    status?: 'concept';
    /** Shown next to the live-demo button (e.g. free-tier cold starts). */
    liveNote?: string;
    /** Extra evidence links (technical reports, related repos). */
    links?: { label: string; url: string }[];
    /** A recorded walkthrough, so the work can be seen even when the live app is asleep or behind a login. */
    demoVideo?: { url: string; label: string; note?: string };
    /** Measured results, rendered as tables. Every row must come from a logged run. */
    evaluation?: {
        summary: string;
        source?: { label: string; url: string };
        tables: { caption: string; columns: string[]; rows: string[][]; highlightRow?: number; note?: string }[];
    };
    /** Design decisions: what was chosen, over what, and why. */
    tradeoffs?: { decision: string; alternative: string; why: string }[];
    /** Known failure modes and how the system handles them. */
    failures?: { failure: string; mitigation: string }[];
    /** Honest list of what is still open. */
    openIssues?: string[];
    topology?: import('./topology').TopologyData;
    codeHighlight?: { language: string; code: string; filename?: string };
}

/**
 * Old case-study URLs → current ids. Four projects originally carried slugs
 * from other projects; keep these so existing links (and search results) land
 * on the right page. Netlify also 301-redirects them (netlify.toml).
 */
export const LEGACY_PROJECT_IDS: Record<string, string> = {
    openreception: 'doc-ai',
    agen: 'multi-agent-research',
    'research-agent': 'dataos',
    'resume-processing': 'hire-me-os',
};

const projectsData: Project[] = [
    {
        id: 'doc-ai',
        title: 'Doc AI',
        category: 'RAG System',
        description:
            'Cited document Q&A with hybrid (BM25 + vector) retrieval. The large-corpus engine, built on open-source models and run CPU-only, is evaluated on 4,584 pages: Recall@3 97.5%, retrieval p50 0.55 s. The original Gemini pipeline runs live.',
        image:
            'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Python', 'FastAPI', 'ChromaDB (HNSW)', 'BM25 + RRF', 'bge-small-en-v1.5', 'MiniLM cross-encoder', 'Ollama (qwen2.5)', 'RapidOCR', 'Gemini (live demo)', 'Presidio (live demo)'],
        details: {
            problem:
                'Answering questions over large PDF collections — hundreds of pages per file, some of them scans — needs recall on exact identifiers, citations a reader can check, and acceptable latency on modest hardware.',
            solution:
                'Large-corpus engine (backend/rag, the one evaluated below): PyMuPDF text plus RapidOCR for scanned pages; sentence-aligned chunks of up to 500 tokens with 75-token overlap, embedded with bge-small-en-v1.5 into ChromaDB (HNSW) alongside a BM25 index; dense and sparse results fused with Reciprocal Rank Fusion, a MiniLM cross-encoder reranks, and qwen2.5:1.5b on Ollama writes an answer that cites PDF and page (Groq optional). If the LLM is down, it returns a cited extractive answer. The live demo runs the original pipeline (backend/core): Gemini embeddings and answers, the same hybrid BM25 + RRF retrieval with reranking, PII masking with Presidio, and structured JSON extraction.',
            architecture:
                'One FastAPI repo with both pipelines, test and verification scripts (hallucination controls, PII masking, reranking, auth), eval scripts and a Dockerfile. The large-corpus engine keeps deterministic chunk ids (the SHA-1 of each file) and runs CPU-only on 8 GB RAM. The live demo (original pipeline + React/Vite frontend) is deployed on Render.',
            impact:
                'Large-corpus engine: every evaluated answer cites its sources (90% of citation tags valid, 80% cite the gold page), with retrieval in 0.55 s p50 on a laptop CPU. Live demo: confidence labels (high ≥ 0.75, medium, low < 0.35), it declines to answer when retrieval returns nothing for the document, and it extracts structured JSON (shipment_id, shipper, consignee, carrier_name, equipment_type, mode, rate, weight).',
        },
        // Measured on the v2 large-corpus engine (TECHNICAL_REPORT.md, run 2026-10-31).
        metrics: [
            { label: 'Recall@3 · 40-question eval', value: '97.5%' },
            { label: 'Retrieval p50 · CPU laptop', value: '0.55 s' },
            { label: 'Pages indexed', value: '4,584' },
        ],
        liveUrl: 'https://doc-ai-frontend.onrender.com',
        link: 'https://doc-ai-frontend.onrender.com',
        liveNote: 'The live demo runs the original Gemini pipeline. Free-tier hosting: the first question can take 30–60 s while the server wakes up.',
        repo: 'https://github.com/saurabhmj11/Doc-AI-Enterprise-RAG-Chatbot',
        demoVideo: {
            url: 'https://www.linkedin.com/feed/update/urn:li:ugcPost:7431916542906486785/',
            label: 'Watch the demo on LinkedIn',
            note: 'Recorded walkthrough. LinkedIn may ask you to sign in to play it.',
        },
        links: [
            { label: 'Technical report (v2 evaluation)', url: 'https://github.com/saurabhmj11/Doc-AI-Enterprise-RAG-Chatbot/blob/main/TECHNICAL_REPORT.md' },
            { label: 'Earlier repo (original pipeline only)', url: 'https://github.com/saurabhmj11/Doc-AI' },
        ],
        evaluation: {
            summary: 'The v2 large-corpus engine was evaluated on 12 PDFs (4,584 pages, 6,604 chunks) on a CPU-only laptop (Intel i5-1135G7, 8 GB RAM). Every figure comes from a logged run. The question set is small and synthetic, so treat differences of a few points with care: one question moves a percentage by 2.5 points.',
            source: { label: 'TECHNICAL_REPORT.md', url: 'https://github.com/saurabhmj11/Doc-AI-Enterprise-RAG-Chatbot/blob/main/TECHNICAL_REPORT.md' },
            tables: [
                {
                    caption: 'Retrieval quality (40 synthetic questions with gold pages)',
                    columns: ['Retriever', 'R@1', 'R@3', 'R@5', 'R@10', 'MRR'],
                    rows: [
                        ['Dense only (HNSW)', '75.0%', '87.5%', '92.5%', '92.5%', '0.821'],
                        ['BM25 only', '85.0%', '97.5%', '97.5%', '100%', '0.907'],
                        ['Hybrid (RRF, k = 60)', '90.0%', '95.0%', '97.5%', '97.5%', '0.930'],
                        ['Hybrid + cross-encoder (deployed)', '80.0%', '97.5%', '97.5%', '97.5%', '0.867'],
                    ],
                    highlightRow: 3,
                    note: 'Honest negative result: on this question set the cross-encoder lowers top-1 accuracy. The questions reuse the passage\'s own words (which favours keyword matching), and the reranker reads only the first 256 tokens of each chunk.',
                },
                {
                    caption: 'Latency by component (p50)',
                    columns: ['Component', 'p50', 'Notes'],
                    rows: [
                        ['Query embedding', '~0.1 s', 'bge-small on CPU'],
                        ['Dense + BM25 + RRF', '~0.03 s', ''],
                        ['Cross-encoder rerank (12 × 256 tokens)', '~0.45 s', 'was ~1.1 s at 16 × 384'],
                        ['Retrieval total', '0.55 s', 'p95 0.79 s'],
                        ['First answer word', '5.0 s', 'p95 6.6 s; dominated by the LLM reading a ~400-token prompt'],
                        ['Full answer', '6.7 s', 'p95 9.7 s'],
                    ],
                },
                {
                    caption: 'Tuning history (same machine)',
                    columns: ['Configuration', 'Full answer p50', 'First word p50'],
                    rows: [
                        ['qwen2.5:3b, ~860-token prompt', '~31 s', '~22 s'],
                        ['qwen2.5:1.5b, ~470-token prompt, lighter reranker', '8.3 s', '6.8 s'],
                        ['plus shorter source labels, 260-token context', '6.2 s (8 questions) / 6.7 s (40-question eval)', '5.0 s'],
                    ],
                    highlightRow: 2,
                },
                {
                    caption: 'Answer quality',
                    columns: ['Measure', 'Result'],
                    rows: [
                        ['Answered (not declined)', '100%'],
                        ['Citation accuracy: gold page cited', '80.0%'],
                        ['Citation validity: [S#] tags pointing to a real source', '90.0%'],
                        ['Hallucination rate (lexical check, > 1/3 unsupported sentences)', '10.0%'],
                        ['Average grounding', '90.6%'],
                    ],
                    note: 'The hallucination metric is a lexical proxy and misses paraphrased errors; an NLI model or an LLM judge would be stricter.',
                },
            ],
        },
        tradeoffs: [
            { decision: 'bge-small-en-v1.5 embeddings', alternative: 'all-MiniLM-L6-v2', why: 'Same 384-dim vectors (identical index size and speed), but a 512-token window that covers a whole 500-token chunk; MiniLM silently drops the second half.' },
            { decision: 'ChromaDB HNSW (M = 32, ef_search = 100)', alternative: 'IVF + PQ', why: 'At 6,604 vectors HNSW returns near-exact neighbours in 14–18 ms; quantized IVF only pays off at millions of vectors.' },
            { decision: 'Hybrid BM25 + dense with RRF', alternative: 'Dense-only retrieval', why: 'Dense alone misses 3 of 40 questions, mostly exact identifiers; hybrid lifts MRR from 0.821 to 0.930.' },
            { decision: 'Keep the cross-encoder for now', alternative: 'Disable it (saves ~0.5 s)', why: 'It lowers R@1 on this lexical, synthetic set; the call is deferred until a human-written question set exists.' },
            { decision: 'Local qwen2.5:1.5b on CPU', alternative: 'Hosted model', why: 'Runs free and offline; setting GROQ_API_KEY switches generation to a hosted open-weights model (about 1 s) with no code change.' },
        ],
        failures: [
            { failure: 'Scanned pages have no text layer', mitigation: 'OCR when a page has < 40 native characters; wordninja restores spaces RapidOCR drops' },
            { failure: 'Running headers pollute chunks', mitigation: 'Top/bottom 10% blocks repeated on ≥ 3 pages are removed (digits masked)' },
            { failure: 'Exact identifiers missed by vectors', mitigation: 'BM25 alongside dense search, fused by RRF' },
            { failure: 'Small model omits citation tags', mitigation: 'Untagged sentences are matched to their best-supporting source, counted separately' },
            { failure: 'Unsupported claims', mitigation: 'Per-sentence grounding check; answers flagged when > 1/3 of sentences are unsupported' },
            { failure: 'LLM down (Ollama stopped)', mitigation: 'Extractive answer of the 3 best-matching source sentences, still cited' },
            { failure: 'Memory pressure on 8 GB', mitigation: 'One local model loaded, fixed num_ctx, warm-up at startup' },
        ],
        openIssues: [
            'Rotated margin text survives cleaning (seen in one book).',
            'RapidOCR makes occasional character errors on noisy scans.',
            'The 40-question synthetic eval is a small sample; a human-written, paraphrased question set is next.',
        ],
        position: { x: '10%', y: '15%' },
        // Large-corpus engine (backend/rag) — the one the evaluation measures.
        topology: {
            nodes: [
                { id: 'ingest', label: 'PyMuPDF + RapidOCR', icon: 'code', x: 12, y: 78 },
                { id: 'api', label: 'FastAPI', icon: 'server', x: 12, y: 30 },
                { id: 'index', label: 'ChromaDB HNSW + BM25', icon: 'database', x: 40, y: 54 },
                { id: 'rerank', label: 'RRF + MiniLM rerank', icon: 'zap', x: 64, y: 30 },
                { id: 'llm', label: 'qwen2.5 (Ollama)', icon: 'brain', x: 88, y: 54 },
            ],
            edges: [
                { from: 'ingest', to: 'index', label: 'chunks' },
                { from: 'api', to: 'index', label: 'query' },
                { from: 'index', to: 'rerank', label: 'top hits' },
                { from: 'rerank', to: 'llm', label: 'context' },
            ]
        },
        // Verbatim excerpt from backend/core/hybrid_fuser.py; only the debug-log call before `return` is omitted.
        codeHighlight: {
            language: 'python',
            filename: 'backend/core/hybrid_fuser.py (excerpt, original pipeline)',
            code: `def _rrf(
    self,
    dense: list[dict],
    sparse: list[dict],
    top_k: int,
) -> list[dict]:
    """
    RRF score for each chunk = Σ 1 / (k + rank)
    where rank is 1-indexed position in each list.
    """
    k = self.rrf_k
    scores: dict[str, float] = {}

    # Build a quick lookup: chunk_id → chunk dict (from either list)
    chunk_by_id: dict[str, dict] = {}

    for rank, chunk in enumerate(dense, start=1):
        cid = chunk["chunk_id"]
        scores[cid] = scores.get(cid, 0.0) + 1.0 / (k + rank)
        if cid not in chunk_by_id:
            chunk_by_id[cid] = chunk

    for rank, chunk in enumerate(sparse, start=1):
        cid = chunk["chunk_id"]
        scores[cid] = scores.get(cid, 0.0) + 1.0 / (k + rank)
        if cid not in chunk_by_id:
            chunk_by_id[cid] = chunk

    # Sort by fused RRF score
    sorted_ids = sorted(scores, key=lambda c: scores[c], reverse=True)

    results = []
    for cid in sorted_ids[:top_k]:
        merged = dict(chunk_by_id[cid])
        merged["hybrid_score"] = round(scores[cid], 6)
        merged["similarity_score"] = merged["hybrid_score"]  # normalise key
        results.append(merged)

    return results`
        }
    },
    {
        id: 'multi-agent-research',
        title: 'Multi-Agent Research',
        category: 'Multi-Agent Systems',
        description:
            'Research automation as a linear LangGraph pipeline: planner, researcher, verifier and writer agents hand state to each other, with every step streamed live to a dashboard.',
        image:
            'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Python', 'FastAPI', 'LangGraph', 'LangChain', 'FAISS', 'Ollama (Llama 3)', 'React + Vite'],
        details: {
            problem:
                'Naive prompt chains fail at complex research tasks that require multi-step web search, source verification, and structured synthesis.',
            solution:
                'A LangGraph state machine of four specialized agents in sequence: Planner (breaks the query into a research plan), Researcher (parallel web searches via DuckDuckGo), Verifier (cross-checks facts and finds gaps), and Writer (compiles a markdown report).',
            architecture:
                'Python FastAPI + LangGraph backend that streams each agent\'s progress to a React/Vite dashboard over Server-Sent Events. The LLM and embeddings run locally on Ollama (Llama 3 + nomic-embed-text) with FAISS; web search goes through DuckDuckGo, so no search API key is needed.',
            impact:
                'Research runs as an explicit, observable pipeline: a dedicated Verifier agent checks the gathered sources for sufficiency and contradictions, and every step streams live to the dashboard.',
        },
        metrics: [
            { label: 'Specialized Agents', value: '4' },
        ],
        repo: 'https://github.com/saurabhmj11/multi-agent-research-auto',
        position: { x: '60%', y: '5%' },
    },
    {
        id: 'oneoffice-automation',
        title: 'OneOffice Automation',
        category: 'Enterprise RPA & AI · Employer',
        description:
            'Intelligent automation at OneOfficeAutomation, my current employer: RPA, AI/ML, BPM, Python and SAP automation for businesses in India and Qatar.',
        image:
            'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop',
        technologies: ['UiPath', 'Python', 'AI/ML', 'SAP Automation', 'RPA'],
        details: {
            problem:
                'Enterprise clients face operational bottlenecks with repetitive, manual tasks across legacy systems like SAP, leading to inefficiencies and human errors.',
            solution:
                'Designed and deployed intelligent software bots that automate complex business processes by integrating RPA with Machine Learning models and custom Python scripts.',
            architecture:
                'Built on industry-leading RPA platforms coupled with Python microservices for custom AI/ML integrations, orchestrated centrally for enterprise-scale deployment.',
            impact:
                'Bots take over repetitive, rules-based work in systems such as SAP, so staff spend less time on manual data entry.',
        },
        metrics: [
            { label: 'Regions', value: 'IN & QA' },
        ],
        liveUrl: 'https://oneofficeautomation.com',
        link: 'https://oneofficeautomation.com',
        position: { x: '80%', y: '40%' },
        topology: {
            nodes: [
                { id: 'rpa', label: 'RPA Bots', icon: 'server', x: 20, y: 50 },
                { id: 'sap', label: 'SAP ERP', icon: 'database', x: 50, y: 20 },
                { id: 'ai', label: 'AI/ML Engine', icon: 'brain', x: 50, y: 80 },
                { id: 'orchestrator', label: 'Orchestrator', icon: 'globe', x: 80, y: 50 },
            ],
            edges: [
                { from: 'rpa', to: 'sap', animated: true },
                { from: 'rpa', to: 'ai', animated: true },
                { from: 'sap', to: 'orchestrator', animated: true },
                { from: 'ai', to: 'orchestrator', animated: true },
            ]
        }
    },
    {
        id: 'dataos',
        title: 'DataOS',
        category: 'Agentic Data Platform (Simulation)',
        description:
            'A browser-based simulation of a one-click data analysis platform: Schema, Cleaning, Quality and Viz agents process an uploaded CSV, with Gemini-powered Q&A, root-cause analysis and narratives.',
        image:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
        technologies: ['React 19', 'TypeScript', 'Vite', 'Gemini API', 'Recharts', 'Tailwind CSS'],
        details: {
            problem:
                'Turning raw data into decisions usually takes several specialist roles and disjointed tools, and executives and analysts need very different views of the same data.',
            solution:
                'A multi-agent pipeline (Schema → Cleaning → Quality → Viz) with two operating modes: CEO mode for narrative briefings and risk/opportunity analysis, and Analyst mode for raw statistics, time-series charts and a "what-if" hypothesis lab.',
            architecture:
                'In-browser CSV ingestion, an orchestrator that passes state between the specialized agents, an LLM insight engine that returns JSON-structured advice, and a dual-mode UI. MIT licensed.',
            impact:
                'Demonstrates one interface serving both executives and analysts over the same data, with the agent pipeline visualized step by step.',
        },
        metrics: [],
        repo: 'https://github.com/saurabhmj11/DataOS',
        position: { x: '25%', y: '50%' },
    },
    {
        id: 'hire-me-os',
        title: 'Hire Me OS 2.0',
        category: 'Autonomous Career AI',
        description:
            'Full-stack multi-tenant SaaS with a 6-block A–F evaluation engine, Autopilot 24/7 scheduler, Chrome extension, and Kanban pipeline — scans LinkedIn, Indeed & Glassdoor, tailors resumes, and auto-applies. The hosted demo is currently paused; the full source is public.',
        image:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Next.js 16', 'Supabase', 'Prisma 6', 'shadcn/ui', 'Zustand 5', 'Nodemailer'],
        details: {
            problem:
                'Job searching is a full-time job — manual applications, per-role resume tailoring, and tracking across LinkedIn, Indeed, Glassdoor, and Wellfound burns hours every day.',
            solution:
                'A multi-tenant SaaS with an evaluation engine that writes 6 report blocks (Role Summary, CV Match, Level Strategy, Comp Research, Personalization, Interview Prep with STAR+R) and scores 10 weighted dimensions into an A–F grade. Autopilot mode scans job portals, evaluates matches, and auto-applies on a configurable schedule.',
            architecture:
                'Next.js 16 App Router (Turbopack) + Supabase PostgreSQL via Prisma 6 ORM + Zustand state. SSE real-time streaming for live Autopilot progress. Server-side background worker scheduler. Chrome extension for one-click apply. Multi-stage Docker build deployed on Render.',
            impact:
                '38 API routes, 13 database models, Cmd+K command palette, Kanban board (Wishlist → Offer), ATS Score checker, AI resume tailor, cover letter generator, SMTP email notifications, and a cycle history audit trail.',
        },
        metrics: [
            { label: 'API Routes', value: '38' },
            { label: 'DB Models', value: '13' },
            { label: 'Scored Dimensions', value: '10' },
        ],
        // Hosted demo (hireme-os-2-0.onrender.com) is suspended on Render — re-add liveUrl when it's back.
        repo: 'https://github.com/saurabhmj11/hireme-os-2.0',
        demoVideo: {
            url: 'https://www.linkedin.com/feed/update/urn:li:ugcPost:7415710358541238272/',
            label: 'Watch the demo on LinkedIn',
            note: 'Recorded walkthrough (the hosted app is paused). LinkedIn may ask you to sign in to play it.',
        },
        position: { x: '70%', y: '45%' },
        topology: {
            nodes: [
                { id: 'cron', label: 'Autopilot', icon: 'zap', x: 10, y: 50 },
                { id: 'next', label: 'Next.js API', icon: 'code', x: 35, y: 50 },
                { id: 'eval', label: 'Eval Engine', icon: 'brain', x: 50, y: 20 },
                { id: 'db', label: 'Supabase', icon: 'database', x: 65, y: 50 },
                { id: 'mail', label: 'Nodemailer', icon: 'network', x: 90, y: 50 },
            ],
            edges: [
                { from: 'cron', to: 'next', animated: true },
                { from: 'next', to: 'eval', animated: true },
                { from: 'eval', to: 'db', animated: true },
                { from: 'db', to: 'mail', animated: true },
                { from: 'next', to: 'db', animated: true },
            ]
        },
        // Real excerpt from src/app/api/evaluate/route.ts (abridged; elided parts marked).
        codeHighlight: {
            language: 'typescript',
            filename: 'src/app/api/evaluate/route.ts (excerpt)',
            code: `function scoreToGrade(score: number): string {
  if (score >= 4.5) return 'A';
  if (score >= 3.5) return 'B';
  if (score >= 2.5) return 'C';
  if (score >= 1.5) return 'D';
  return 'F';
}

// …inside POST: load the user's dimension weights, CV and profile…

const ZAI = (await import('z-ai-web-dev-sdk')).default;
const zai = await ZAI.create();

// …a first call classifies the job description's archetype…

// systemPrompt asks for 6 report blocks + 10 dimension scores, as JSON
const completion = await zai.chat.completions.create({
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ],
});

const rawOutput = completion.choices?.[0]?.message?.content || '';
const parsed = extractJSON(rawOutput);
// …weighted score → scoreToGrade() → saved as an EvaluationReport…`
        }
    },
    {
        id: 'quantrag-fintech',
        status: 'concept',
        title: 'QuantRAG: FinTech Auditor',
        category: 'Financial AI System',
        description:
            'Agentic system for financial document auditing, SEC filing analysis, and risk scoring using LangChain and a RAG architecture.',
        image:
            'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Python', 'LangChain', 'Pinecone', 'React', 'FastAPI'],
        details: {
            problem:
                'Manual auditing of 10-K filings, compliance documents, and unstructured financial data is slow, prone to human error, and lacks real-time risk assessment.',
            solution:
                'A robust multi-agent RAG system that ingests financial PDFs, extracts tables and sentiment using multimodal models, and runs anomaly detection algorithms verified by LLMs.',
            architecture:
                'FastAPI microservices orchestrating LangChain agents. Pinecone for dense vector retrieval. React frontend with D3.js for risk visualization.',
            impact:
                'Designed to speed up manual audits by surfacing risk factors across large sets of filings for a human reviewer.',
        },
        metrics: [],
        position: { x: '40%', y: '80%' },
    },
    {
        id: 'mediq-healthcare',
        status: 'concept',
        title: 'MedIQ: Clinical AI Assistant',
        category: 'Healthcare AI Platform',
        description:
            'Multimodal AI assistant prototype for clinical decision support, designed to synthesize patient histories, lab results, and medical literature.',
        image:
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2670&auto=format&fit=crop',
        technologies: ['TypeScript', 'Next.js', 'LLaMA-3', 'Medical NLP', 'PostgreSQL'],
        details: {
            problem:
                'Clinicians suffer from burnout due to excessive EHR (Electronic Health Record) documentation and the cognitive load of cross-referencing patient histories.',
            solution:
                'A locally run LLM (fine-tuned on medical corpora) that summarizes patient charts, suggests differential diagnoses for clinician review, and drafts clinical notes.',
            architecture:
                'Next.js frontend with localized/on-premise model execution for PHI protection. Microsoft Presidio for strict anonymization before inference.',
            impact:
                'Aims to cut documentation time so clinicians can spend more of it on direct patient care. PHI is anonymized before inference and the model runs on-premise.',
        },
        metrics: [],
        position: { x: '85%', y: '75%' },
    },
    {
        id: 'recovery-lab-qatar',
        title: 'Recovery Lab Qatar',
        category: 'Health & Wellness Platform',
        description: 'Website for Recovery Lab Qatar, a health and wellness clinic: a responsive React site that presents its therapies and treatments.',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2670&auto=format&fit=crop',
        technologies: ['React', 'JavaScript', 'HTML5', 'CSS3'],
        details: {
            problem: 'Providing a seamless digital experience for clients to discover and book advanced, technology-driven health and wellness treatments.',
            solution: 'Built a responsive React web app that showcases the clinic\'s therapies with a clean, modern UI.',
            architecture: 'Single Page Application (SPA) built with React, leveraging modern web practices for fast loading times and optimal user experience.',
            impact: 'Gives the clinic\'s clients a clear way to explore its treatments online.'
        },
        metrics: [],
        liveUrl: 'https://recoverylabqatar.com/',
        link: 'https://recoverylabqatar.com/',
        position: { x: '35%', y: '30%' }
    }
];

export default projectsData;
