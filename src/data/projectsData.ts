// ─── Shared Project Data ──────────────────────────────────────────────────────
// Single source of truth — used by both Projects.tsx (neural web cards)
// and CaseStudy.tsx (dedicated deep-dive pages at /project/:id).

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
}

const projectsData: Project[] = [
    {
        id: 'openreception',
        title: 'Doc AI',
        category: 'AI SaaS Platform',
        description:
            'Logistics document intelligence with RAG, confidence-scored Q&A, HIPAA-compliant PII masking via Microsoft Presidio, and structured shipment data extraction. Live on Render.',
        image:
            'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop',
        technologies: ['FastAPI', 'Gemini 1.5 Flash', 'ChromaDB', 'RAG', 'React + Vite', 'Python'],
        details: {
            problem:
                'Extracting structured data from logistics documents (PDFs, shipping records, contracts) is manual, error-prone, and lacks privacy compliance.',
            solution:
                'A RAG pipeline: documents are chunked (512-token), embedded via Gemini Embeddings, stored in ChromaDB, reranked by a cross-encoder (ms-marco-MiniLM-L-6-v2), then answered by Gemini 1.5 Flash with strict guardrails.',
            architecture:
                'FastAPI backend + JWT auth on all endpoints. ChromaDB for vector storage. Microsoft Presidio for PII/PHI masking. React + Vite frontend. Multi-stage Docker build deployed on Render.',
            impact:
                'Guardrails refuse answers below 0.5 confidence. Extracts structured JSON (shipment_id, shipper, consignee, dates, rates). Hallucination-resistant by design.',
        },
        metrics: [
            { label: 'Confidence Threshold', value: '0.5' },
            { label: 'Chunk Size', value: '512' },
            { label: 'Retrieval Candidates', value: '10' },
        ],
        liveUrl: 'https://doc-ai-frontend.onrender.com',
        link: 'https://doc-ai-frontend.onrender.com',
        repo: 'https://github.com/saurabhmj11/Doc-AI',
        position: { x: '10%', y: '15%' },
    },
    {
        id: 'agen',
        title: 'Multi-Agent Research',
        category: 'Multi-Agent Systems',
        description:
            'Autonomous multi-agent research automation — LangGraph-orchestrated planner, researcher, verifier, and writer agents collaborate on stateful, long-horizon research tasks.',
        image:
            'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=2670&auto=format&fit=crop',
        technologies: ['TypeScript', 'LangGraph', 'LangChain', 'Vector DBs', 'Node.js'],
        details: {
            problem:
                'Naive prompt chains fail at complex research tasks that require multi-step web search, source verification, and structured synthesis.',
            solution:
                'A stateful LangGraph state machine of four specialized agents: Planner (breaks down goals), Researcher (RAG + retrieval), Verifier (source cross-checking), and Writer (structured synthesis).',
            architecture:
                'TypeScript + Node.js runtime. LangGraph persistent memory across agent nodes. Shared vector knowledge graph for embeddings. Each agent handoffs state to the next.',
            impact:
                'Deterministic, reproducible research pipelines with built-in validation loops — dramatically more reliable than single-pass LLM approaches.',
        },
        metrics: [
            { label: 'Specialized Agents', value: '4' },
            { label: 'State Nodes', value: '12+' },
            { label: 'Accuracy vs Baseline', value: '+40%' },
        ],
        repo: 'https://github.com/saurabhmj11/multi-agent-research-auto',
        position: { x: '60%', y: '5%' },
    },
    {
        id: 'research-agent',
        title: 'DataOS',
        category: 'Autonomous Data Platform',
        description:
            'An autonomous OS-like platform that processes, transforms, and orchestrates data pipelines without manual intervention — AI-driven data intelligence on autopilot.',
        image:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
        technologies: ['TypeScript', 'Node.js', 'LLM APIs', 'Data Pipelines', 'REST APIs'],
        details: {
            problem:
                'Data engineering workflows require constant manual oversight — scheduling, error handling, transformation, and monitoring all demand developer intervention.',
            solution:
                'An autonomous data OS with self-managing pipeline scheduling, error recovery, data normalization, and AI-driven anomaly detection + auto-remediation loops.',
            architecture:
                'TypeScript event-driven architecture with pluggable source connectors, a central orchestrator, and LLM-powered transformation decisions. MIT licensed.',
            impact:
                'Eliminates manual pipeline babysitting — the system self-detects failures, retries with exponential backoff, and auto-corrects transformation logic.',
        },
        metrics: [
            { label: 'Self-Healing', value: '100%' },
            { label: 'Manual Ops Cut', value: '80%' },
            { label: 'Backoff Retries', value: 'Auto' },
        ],
        repo: 'https://github.com/saurabhmj11/DataOS',
        position: { x: '25%', y: '50%' },
    },
    {
        id: 'resume-processing',
        title: 'Hire Me OS 2.0',
        category: 'Autonomous Career AI',
        description:
            'Full-stack multi-tenant SaaS with a 6-block A–F evaluation engine, Autopilot 24/7 scheduler, Chrome extension, and Kanban pipeline — scans LinkedIn, Indeed & Glassdoor, tailors resumes, and auto-applies. Live on Render.',
        image:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Next.js 16', 'Supabase', 'Prisma 6', 'shadcn/ui', 'Zustand 5', 'Nodemailer'],
        details: {
            problem:
                'Job searching is a full-time job — manual applications, per-role resume tailoring, and tracking across LinkedIn, Indeed, Glassdoor, and Wellfound burns hours every day.',
            solution:
                'A fully autonomous, multi-tenant SaaS with a 6-block evaluation engine (Role Summary, CV Match, Level Strategy, Comp Research, Personalization, Interview Prep with STAR+R). Autopilot 24/7 mode scans job portals, evaluates matches, and auto-applies on a configurable schedule.',
            architecture:
                'Next.js 16 App Router (Turbopack) + Supabase PostgreSQL via Prisma 6 ORM + Zustand state. SSE real-time streaming for live Autopilot progress. Server-side background worker scheduler. Chrome extension for one-click apply. Multi-stage Docker build deployed on Render.',
            impact:
                '30+ API routes, 11 database models, Cmd+K command palette, Kanban board (Wishlist → Offer), ATS Score checker, AI resume tailor, cover letter generator, SMTP email notifications, and a cycle history audit trail.',
        },
        metrics: [
            { label: 'API Routes', value: '30+' },
            { label: 'DB Models', value: '11' },
            { label: 'Eval Dimensions', value: '10' },
        ],
        liveUrl: 'https://hireme-os-2-0.onrender.com',
        link: 'https://hireme-os-2-0.onrender.com',
        repo: 'https://github.com/saurabhmj11/hireme-os-2.0',
        position: { x: '70%', y: '45%' },
    },
];

export default projectsData;
