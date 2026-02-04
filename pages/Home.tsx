import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import LiveAgents from '../components/LiveAgents';
import Contact from '../components/Contact';
import Testimonials from '../components/Testimonials';
import Workflow from '../components/Workflow';
// import ScrollLine from '../components/ScrollLine';

const Home = () => {
    return (
        <main>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Testimonials />
            <Workflow />
            <LiveAgents />
            <Blog />
            <Contact />
        </main>
    );
};

export default Home;
