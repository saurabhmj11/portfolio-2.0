
import { motion } from 'framer-motion';
import { Brain, Code, Cpu, Globe, Rocket, Zap } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import MouseParallax from './MouseParallax';
import ScrambleText from './ScrambleText';

const services = [
    {
        icon: Brain,
        title: 'AI Strategy & Consulting',
        description: 'Translating complex AI capabilities into actionable business ROI. I help startups and enterprises identify high-impact AI use cases.',
        tags: ['Roadmapping', 'Feasibility', 'Architecture']
    },
    {
        icon: Code,
        title: 'Custom LLM Agents',
        description: 'Building autonomous agents that plan, execute, and reason. From customer support bots to complex multi-agent workflows.',
        tags: ['LangChain', 'AutoGPT', 'OpenAI API']
    },
    {
        icon: Cpu,
        title: 'RAG Systems',
        description: 'Production-ready Retrieval Augmented Generation systems. Chat with your data securely, accurately, and at scale.',
        tags: ['Vector DBs', 'Embeddings', 'Semantic Search']
    },
    {
        icon: Globe,
        title: 'Full-Stack AI Apps',
        description: 'End-to-end development of AI-native applications. Seamless integration of generative models into modern web interfaces.',
        tags: ['React', 'Node.js', 'FastAPI']
    },
    {
        icon: Rocket,
        title: 'MVP Acceleration',
        description: 'Rapid prototyping to get your AI idea to market in weeks, not months. Focus on core value delivery and user feedback.',
        tags: ['Rapid Dev', 'Prototype', 'Launch']
    },
    {
        icon: Zap,
        title: 'Performance Optimization',
        description: 'Fine-tuning models and optimizing inference latency. Ensuring your AI features are fast, cost-effective, and scalable.',
        tags: ['Fine-tuning', 'Latency', 'Cost Ops']
    }
];

const Services = () => {
    return (
        <section id="services" className="py-32 px-6 md:px-12 bg-black text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-24 text-center max-w-3xl mx-auto">
                    <ScrollReveal>
                        <h2 className="text-[12px] uppercase tracking-widest mb-4 text-blue-400 font-mono">My Expertise</h2>
                        <h3 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
                            <ScrambleText text="Capabilities" />
                        </h3>
                        <p className="text-xl text-gray-400 font-light leading-relaxed">
                            I bridge the gap between bleeding-edge AI research and robust, scalable production systems.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <MouseParallax key={index} strength={5} className="h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group relative p-8 h-full bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors duration-500 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 text-white">
                                        <service.icon size={24} strokeWidth={1.5} />
                                    </div>

                                    <h4 className="text-2xl font-display font-bold mb-4 group-hover:text-blue-300 transition-colors">
                                        {service.title}
                                    </h4>

                                    <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                                        {service.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {service.tags.map((tag, i) => (
                                            <span key={i} className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded-full uppercase tracking-wider group-hover:border-white/20 group-hover:text-gray-300 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </MouseParallax>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
