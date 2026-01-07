import React from 'react';
import { Briefcase, Calendar, ExternalLink } from 'lucide-react';

const featuredExperiences = [
    {
        role: 'Course Curriculum Developer',
        company: 'EdTech Company (Remote)',
        period: 'Current',
        description: 'Design and develop production-oriented full-stack courses. Oversee code and content reviews across curricula, maintaining engineering standards and consistency.',
        tech: [
            'System Design',
            'Code Review',
            'Engineering Best Practices',
        ],
    },
    {
        role: 'Software Engineer',
        company: 'Yahoo Japan',
        period: 'Key Achievement',
        description: 'Engineered backend operations for a loyalty platform serving 60 million users, including secure payment and settlement. Migrated legacy monoliths to microservices.',
        tech: [
            'Full-Stack Architecture',
            'Microservices',
            'Scalability',
        ],
    },
];

export const Experience: React.FC = () => {
    return (
        <section id="experience" className="py-20 bg-bg-app transition-colors duration-300">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-sans font-bold text-center mb-12">
                    <span className="text-text-primary">
                        Career
                    </span>{' '}
                    <span className="text-coral-500">Highlights</span>
                </h2>

                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Featured Cards */}
                    {featuredExperiences.map((exp, index) => (
                        <div
                            key={index}
                            className="bg-bg-card p-8 rounded-2xl shadow-md-2 border border-border-primary transition-colors duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-text-primary">
                                        {exp.role}
                                    </h3>
                                    <p className="text-text-secondary font-medium flex items-center gap-2 mt-1">
                                        <Briefcase size={18} className="text-coral-500" /> {exp.company}
                                    </p>
                                </div>
                                <div className="mt-3 md:mt-0 text-coral-600 dark:text-coral-400 font-medium text-sm flex items-center gap-2 px-3 py-1 bg-coral-500/10 rounded-full w-fit">
                                    {exp.period !== 'Key Achievement' && <Calendar size={14} />}
                                    {exp.period}
                                </div>
                            </div>

                            <p className="text-text-secondary leading-relaxed mb-6 text-base">
                                {exp.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {exp.tech.map((t) => (
                                    <span
                                        key={t}
                                        className="text-xs font-semibold text-text-primary bg-bg-app border border-border-primary px-3 py-1.5 rounded-lg shadow-sm"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="text-center pt-8">
                        <a
                            href="https://www.linkedin.com/in/yuka-tamura/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-text-primary font-semibold hover:text-coral-500 transition-colors duration-md-short border-b-2 border-border-primary hover:border-coral-400 pb-1"
                        >
                            View Full History on LinkedIn <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </section>

    );
};
