import { Github, ExternalLink } from 'lucide-react';

const projects = [
    {
        title: 'Portfolio V2',
        description: 'AI-powered portfolio focused on RAG (Retrieval-Augmented Generation) transparency. Features to ensure LLM reliability.',
        tech: ['React', 'FastAPI', 'FAISS', 'Google Cloud'],
        links: {
            github: 'https://github.com/yukaty/portfolio-v2',
            demo: 'https://yukaty.dev'
        }
    },
    {
        title: 'Tech Trend Tracker',
        description: 'Automated news aggregator that tracks and summarizes technology trends using AI. Features vector search for finding historical trend data.',
        tech: ['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'pgvector'],
        links: {
            github: 'https://github.com/yukaty/tech-trend-tracker',
            demo: 'https://tech-trend-tracker-ttt.vercel.app'
        }
    }
];

export const Projects: React.FC = () => {
    return (
        <section id="projects" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-sans font-bold text-center mb-12">
                    <span className="bg-gradient-to-r from-navy-800 to-navy-600 bg-clip-text text-transparent">
                        Featured
                    </span>{' '}
                    <span className="text-coral-500">Projects</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-cream-50 to-white border border-navy-100 rounded-2xl p-8 shadow-md-2"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-navy-800">
                                    {project.title}
                                </h3>
                                <div className="flex gap-3">
                                    {project.links.github && (
                                        <a
                                            href={project.links.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`View ${project.title} source code on GitHub`}
                                            className="text-navy-500 hover:text-coral-500 transition-colors duration-md-short p-2 rounded-lg hover:bg-coral-50 focus:outline-none focus:ring-2 focus:ring-coral-400"
                                        >
                                            <Github size={22} />
                                        </a>
                                    )}
                                    {project.links.demo && (
                                        <a
                                            href={project.links.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`View ${project.title} live demo`}
                                            className="text-navy-500 hover:text-coral-500 transition-colors duration-md-short p-2 rounded-lg hover:bg-coral-50 focus:outline-none focus:ring-2 focus:ring-coral-400"
                                        >
                                            <ExternalLink size={22} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <p className="text-navy-600 mb-6 leading-relaxed min-h-[80px] text-base">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {project.tech.map((t) => (
                                    <span
                                        key={t}
                                        className="text-xs font-semibold text-coral-600 bg-white border-2 border-coral-200 px-3 py-1.5 rounded-lg"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
