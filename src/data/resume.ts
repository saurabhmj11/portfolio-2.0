export const resumeData = {
    personal: {
        name: "Saurabh Lokhande",
        title: "AI Engineer — Generative AI | Agentic Systems | LLM Architecture",
        location: "Remote | India",
        email: "saurabhmj11@gmail.com",
        phone: "+91-7767913887",
        github: "github.com/saurabhmj11",
        linkedin: "linkedin.com/in/saurabhmj11",
        portfolio: "saurabh-anil-lokhande.netlify.app"
    },
    summary: "AI Engineer with 2+ years of experience designing and deploying production-grade Generative AI systems, including agentic architectures, Retrieval-Augmented Generation (RAG), and LLM-powered applications. Experienced in building AI SaaS platforms, multi-agent workflows, and scalable AI backends using Python, FastAPI, LangGraph, and vector databases. Strong focus on production architecture, orchestration, and real-world AI deployment beyond basic chatbot implementations.",
    skills: {
        "Gen AI & LLMs": ["Agentic AI Systems", "Multi-Agent Architectures", "RAG", "Prompt Engineering & Evaluation", "Tool Calling & Workflow Orchestration", "Context Management & Memory Systems"],
        "Frameworks & Tools": ["LangChain", "LangGraph", "Hugging Face Transformers", "OpenAI APIs", "Vector Databases (FAISS, Chroma, Pinecone)"],
        "Backend & Engineering": ["Python (Advanced)", "FastAPI", "REST APIs", "Async Workflows", "Docker", "Git"],
        "Data & ML": ["NLP", "Embeddings & Semantic Search", "Document Processing Pipelines", "Model Evaluation Strategies"]
    },
    experience: [
        {
            role: "Generative AI / LLM Engineer",
            duration: "Jan 2024 – Present",
            type: "Remote",
            company: "OneOfficeAutomation",
            points: [
                "Designed and deployed production-style AI systems focusing on agent orchestration, retrieval architecture, and scalable AI services.",
                "Developed OpenReception — an AI receptionist SaaS platform capable of handling business calls, booking appointments, and answering queries autonomously.",
                "Built AGEN — an Open Source AI Agent Browser Platform with WebUI, persistent browser sessions, and tool-calling architecture.",
                "Designed a stateful Multi-Agent Research Automation System using LangGraph for automated workflows.",
                "Developed an AI Resume Processing & Candidate Intelligence System to automatically extract structured candidate insights from cloud storage."
            ]
        }
    ],
    projects: [
        {
            name: "OpenReception — AI Receptionist SaaS Platform",
            link: "github.com/saurabhmj11",
            desc: "Designed LLM-driven conversational architecture with FastAPI backend, real-time AI processing, RAG pipeline for business knowledge retrieval, and integrated Twilio/voice APIs."
        },
        {
            name: "AGEN — AI Agent Browser Platform",
            link: "github.com/saurabhmj11",
            desc: "Built an AI agent framework with persistent browser sessions for long-running tasks. Developed WebUI using Gradio and designed tool-calling architecture for real website interactions."
        },
        {
            name: "Multi-Agent Research Automation System",
            link: "github.com/saurabhmj11",
            desc: "Stateful system using LangGraph replacing naive prompt chains with deterministic orchestration. Implemented planner, researcher, verifier, and writer agents with RAG-based knowledge retrieval."
        },
        {
            name: "AI Resume Processing System",
            link: "github.com/saurabhmj11",
            desc: "Automated pipeline for processing resumes from cloud storage. Extracted structured candidate insights using PDF conversion, document parsing, and LLM summarization."
        }
    ],
    education: {
        degree: "Bachelor’s Degree in Engineering",
        school: "Amravati University",
        year: "2019 – 2023"
    }
};
