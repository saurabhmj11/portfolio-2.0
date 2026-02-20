import React, { Suspense } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Services from '../components/Services';
import ScrollConnector from '../components/ScrollConnector';
import BackgroundFlow from '../components/BackgroundFlow';

// Lazy load heavy components for performance
const Experience = React.lazy(() => import('../components/Experience'));
const Projects = React.lazy(() => import('../components/Projects'));
const Blog = React.lazy(() => import('../components/Blog'));
const LiveAgents = React.lazy(() => import('../components/LiveAgents'));
const Contact = React.lazy(() => import('../components/Contact'));
const Testimonials = React.lazy(() => import('../components/Testimonials'));
const Workflow = React.lazy(() => import('../components/Workflow'));

const Home = () => {
    return (
        <main className="relative w-full">
            <ScrollConnector />
            <BackgroundFlow />

            <div className="relative z-10">
                <Hero />
                <About />
                <Skills />
                <Services />

                <Suspense fallback={<div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>}>
                    <Experience />
                    <Projects />
                    <Testimonials />
                    <Workflow />
                    <LiveAgents />
                    <Blog />
                    <Contact />
                </Suspense>
            </div>
        </main>
    );
};

export default Home;
