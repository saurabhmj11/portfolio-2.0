// Single source of truth for the résumé: rendered by src/pages/Resume.tsx and
// turned into public/Saurabh-Lokhande-AI-Engineer.pdf at build time
// (scripts/generate-resume-pdf.mjs). Edit resume.json, not this file.
import resume from './resume.json';

export const resumeData = resume;
