import React, { Suspense } from 'react';
import Hero from '../components/Hero';

// Invisible fallback — each section fades in independently when its chunk is ready.
// No spinning loader blocks the viewport; sections simply appear as they load.
const SilentFallback = () => <div aria-hidden="true" />;

// Lazy load every below-the-fold component individually so each chunk loads
// independently — no one slow chunk blocks all the others.
const About               = React.lazy(() => import('../components/About'));
const Skills              = React.lazy(() => import('../components/Skills'));
const Services            = React.lazy(() => import('../components/Services'));
const ScrollConnector     = React.lazy(() => import('../components/ScrollConnector'));
const BackgroundFlow      = React.lazy(() => import('../components/BackgroundFlow'));
const SectionMorph        = React.lazy(() => import('../components/SectionMorph'));
const LiveStats           = React.lazy(() => import('../components/LiveStats'));
const Experience          = React.lazy(() => import('../components/Experience'));
const Projects            = React.lazy(() => import('../components/Projects'));
const Blog                = React.lazy(() => import('../components/Blog'));
const LiveAgents          = React.lazy(() => import('../components/LiveAgents'));
const Testimonials        = React.lazy(() => import('../components/Testimonials'));
const Workflow            = React.lazy(() => import('../components/Workflow'));
const LangGraphInteractive = React.lazy(() => import('../components/LangGraphInteractive'));
const RAGSimulator        = React.lazy(() => import('../components/RAGSimulator'));
const TelemetryDashboard  = React.lazy(() => import('../components/TelemetryDashboard'));
const AutonomousAgentHUD  = React.lazy(() => import('../components/AutonomousAgentHUD'));

// Wrap a component in its own isolated Suspense boundary
const S = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<SilentFallback />}>{children}</Suspense>
);

const Home = () => {
    return (
        <main className="relative w-full">
            <div className="relative z-10">
                {/* Hero is always synchronous — it IS the first paint */}
                <Hero />

                {/* Infrastructure — invisible layout pieces, load silently */}
                <S><ScrollConnector /></S>
                <S><BackgroundFlow /></S>

                {/* Content sections — each in its own boundary */}
                <S><SectionMorph from="#home" to="#about" effect="scaleReveal" /></S>
                <S><About /></S>
                <S><LiveStats /></S>
                <S><Skills /></S>
                <S><SectionMorph from="#skills" to="#services" effect="colorShift" /></S>
                <S><Services /></S>
                <S><Experience /></S>
                <S><Projects /></S>
                <S><SectionMorph from="#projects" to="#agents" effect="curtainWipe" /></S>
                <S><Testimonials /></S>
                <S><Workflow /></S>
                <S><LangGraphInteractive /></S>
                <S><RAGSimulator /></S>
                <S><TelemetryDashboard /></S>
                <S><AutonomousAgentHUD /></S>
                <S><LiveAgents /></S>
                <S><Blog /></S>
            </div>
        </main>
    );
};

export default Home;
