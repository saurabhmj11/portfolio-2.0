import React from 'react';
import { motion } from 'framer-motion';
import { resumeData } from '../data/resume';
import { Download, ArrowLeft, Mail, Github, Linkedin, Globe, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resume = () => {
    return (
        <div className="min-h-screen bg-off-white dark:bg-[#050505] text-primary-text dark:text-white pt-24 pb-20 px-4 md:px-0">
            <div className="max-w-4xl mx-auto bg-white dark:bg-[#111] p-8 md:p-16 shadow-2xl rounded-sm">

                {/* Header Actions */}
                <div className="flex justify-between items-center mb-12 print:hidden">
                    <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide hover:opacity-80 transition-opacity"
                    >
                        <Download size={16} />
                        <span>Print / Save PDF</span>
                    </button>
                </div>

                {/* Header Info */}
                <header className="border-b-2 border-black dark:border-white pb-8 mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">{resumeData.personal.name}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mb-6">{resumeData.personal.title}</p>

                    <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>{resumeData.personal.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} />
                            <span>{resumeData.personal.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Github size={16} />
                            <span>{resumeData.personal.github}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Linkedin size={16} />
                            <span>{resumeData.personal.linkedin}</span>
                        </div>
                    </div>
                    <div className="mt-4 text-sm font-semibold text-green-600 dark:text-green-400">
                        📍 {resumeData.personal.location}
                    </div>
                </header>

                {/* Summary */}
                <section className="mb-10">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Professional Summary</h2>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
                        {resumeData.summary}
                    </p>
                </section>

                {/* Skills */}
                <section className="mb-10">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Core Technical Skills</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(resumeData.skills).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="font-bold text-base mb-2">{category}</h3>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                                    {items.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Experience */}
                <section className="mb-10">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Professional Experience</h2>
                    {resumeData.experience.map((exp, i) => (
                        <div key={i} className="mb-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                                <h3 className="text-xl font-bold">{exp.role}</h3>
                                <span className="text-gray-500 font-mono text-sm">{exp.duration}</span>
                            </div>
                            <div className="text-sm text-gray-500 mb-4">{exp.type}</div>
                            <ul className="space-y-2">
                                {exp.points.map((point, j) => (
                                    <li key={j} className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start gap-2">
                                        <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>

                {/* Projects */}
                <section className="mb-10">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Flagship Projects</h2>
                    <div className="space-y-6">
                        {resumeData.projects.map((proj, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-bold">{proj.name}</h3>
                                    <a href={`https://${proj.link}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm truncate max-w-[150px] md:max-w-none">{proj.link}</a>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {proj.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h2>
                    <div>
                        <h3 className="text-lg font-bold">{resumeData.education.degree}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{resumeData.education.school} | {resumeData.education.year}</p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Resume;
