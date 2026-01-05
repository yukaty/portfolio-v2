import React from 'react';
import { Database, Layout, Cloud, Award } from 'lucide-react';

const skillCategories = [
    {
        title: 'Backend',
        icon: Database,
        skills: ['Java / Spring Boot', 'Python / FastAPI', 'AI Integration'],
    },
    {
        title: 'Frontend',
        icon: Layout,
        skills: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
    },
    {
        title: 'DevOps & Cloud',
        icon: Cloud,
        skills: ['AWS', 'Linux', 'Docker', 'CI/CD Pipelines'],
    },
];

export const Skills: React.FC = () => {
    return (
        <section id="skills" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-sans font-bold text-center mb-12">
                    <span className="bg-gradient-to-r from-navy-800 to-navy-600 bg-clip-text text-transparent">
                        Technical
                    </span>{' '}
                    <span className="text-coral-500">Skills</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {skillCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <div
                                key={category.title}
                                className="group p-6 rounded-2xl bg-gradient-to-br from-cream-50 to-white border border-navy-100 hover:border-coral-200 shadow-md-1 hover:shadow-md-3 transition-all duration-md-medium"
                            >
                                <div className="mb-4 bg-gradient-to-br from-coral-400 to-coral-600 w-14 h-14 rounded-xl flex items-center justify-center shadow-md-2 group-hover:scale-110 transition-transform duration-md-medium">
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-navy-800 mb-4">{category.title}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1.5 bg-white text-navy-700 text-sm font-medium rounded-lg border border-navy-100 shadow-sm hover:shadow-md-1 hover:border-coral-200 transition-all duration-md-short inline-flex items-center gap-1.5"
                                        >
                                            {skill}
                                            {skill === 'AWS' && <Award className="w-4 h-4 text-coral-500" />}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
