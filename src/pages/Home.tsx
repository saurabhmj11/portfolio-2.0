import React, { Suspense } from 'react';
import Hero from '../components/Hero';

// Lazy load below-the-fold heavy components for performance
const About = React.lazy(() => import('../components/About'));
const Skills = React.lazy(() => import('../components/Skills'));
const Services = React.lazy(() => import('../components/Services'));
const ScrollConnector = React.lazy(() => import('../components/ScrollConnector'));
const BackgroundFlow = React.lazy(() => import('../components/BackgroundFlow'));
const SectionMorph = React.lazy(() => import('../components/SectionMorph'));
const LiveStats = React.lazy(() => import('../components/LiveStats'));
const Experience = React.lazy(() => import('../components/Experience'));
const Projects = React.lazy(() => import('../components/Projects'));
const Blog = React.lazy(() => import('../components/Blog'));
const LiveAgents = React.lazy(() => import('../components/LiveAgents'));
const Contact = React.lazy(() => import('../components/Contact'));
const Testimonials = React.lazy(() => import('../components/Testimonials'));
const Workflow = React.lazy(() => import('../components/Workflow'));
const LangGraphInteractive = React.lazy(() => import('../components/LangGraphInteractive'));
const RAGSimulator = React.lazy(() => import('../components/RAGSimulator'));
const TelemetryDashboard = React.lazy(() => import('../components/TelemetryDashboard'));
const AutonomousAgentHUD = React.lazy(() => import('../components/AutonomousAgentHUD'));

const Home = () => {
    return (
        <main className="relative w-full">
            <div className="relative z-10">
                <Hero />
                <Suspense fallback={<div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>}>
                    <ScrollConnector />
                    <BackgroundFlow />
                    <SectionMorph from="#home" to="#about" effect="scaleReveal" />
                    <About />
                    <LiveStats />
                    <Skills />
                    <SectionMorph from="#skills" to="#services" effect="colorShift" />
                    <Services />
                    <Experience />
                    <Projects />
                    <SectionMorph from="#projects" to="#agents" effect="curtainWipe" />
                    <Testimonials />
                    <Workflow />
                    <LangGraphInteractive />
                    <RAGSimulator />
                    <TelemetryDashboard />
                    <AutonomousAgentHUD />
                    <LiveAgents />
                    <Blog />
                    <Contact />
                </Suspense>
            </div>
        </main>
    );
};

export default Home;
