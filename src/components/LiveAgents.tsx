import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Bot } from 'lucide-react';
import LiveStatus from './LiveStatus';
import MouseParallax from './MouseParallax';
import GlowCard from './GlowCard';

interface Agent {
    name: string;
    url: string;
    description: string;
    role: string;
}

const agents: Agent[] = [
    {
        name: 'Travel Guru',
        url: 'https://agent.ai/agent/gurutravel',
        description: 'Your personal AI concierge for planning perfect trips with real-time insights.',
        role: 'Travel Assistant'
    },
    {
        name: '90-Day Launchpad',
        url: 'https://agent.ai/agent/90day',
        description: 'A focused accelerator agent to help you achieve your startup goals in 3 months.',
        role: 'Goal Accelerator'
    },
    {
        name: 'DuduSL001',
        url: 'https://agent.ai/agent/dudusl001',
        description: 'Experimental custom agent designed for specialized recursive tasks.',
        role: 'Experimental Unit'
    },
    {
        name: 'Agent Plan 01',
        url: 'https://agent.ai/agent/Agentplan01',
        description: 'Strategic task planner that breaks down complex objectives into actionable steps.',
        role: 'Task Planner'
    },
    {
        name: 'S L 011',
        url: 'https://agent.ai/agent/S_L_011',
        description: 'Advanced logic unit capable of handling multi-step reasoning problems.',
        role: 'Logic Unit'
    }
];

const LiveAgents = () => {
    const containerRef = useRef(null);

    return (
        <section ref={containerRef} className="py-32 px-4 md:px-8 bg-black text-white relative z-10 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto relative z-20">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 border-b border-white/20 pb-8">
                    <h2 className="text-[10vw] md:text-[6vw] font-bold leading-none tracking-tighter uppercase text-center md:text-left">
                        Live<br />Agents
                    </h2>
                    <p className="text-gray-400 text-lg md:max-w-xs text-center md:text-right mt-8 md:mt-0">
                        Interact with deployed autonomous agents running in production environments.
                    </p>
                </div>

                <LiveStatus />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent, index) => (
                        <MouseParallax key={agent.name} strength={10} className="h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="h-full"
                            >
                                <GlowCard href={agent.url} className="h-full flex flex-col justify-between min-h-[300px]">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                <Bot className="text-white w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-mono text-gray-400 border border-white/10 px-2 py-1 rounded-full uppercase tracking-wider">
                                                {agent.role}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{agent.name}</h3>
                                        <p className="text-gray-400 leading-relaxed text-sm">
                                            {agent.description}
                                        </p>
                                    </div>

                                    <div className="relative z-10 mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                                        Try Live Agent <ExternalLink className="w-4 h-4 ml-1" />
                                    </div>
                                </GlowCard>
                            </motion.div>
                        </MouseParallax>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LiveAgents;
