import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer id="contact" className="bg-gradient-to-br from-navy-900 to-navy-800 py-20 text-cream border-t-4 border-coral-500">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-sans font-bold mb-3">
                    <span className="bg-gradient-to-r from-cream-50 to-coral-200 bg-clip-text text-transparent">
                        Let's Connect
                    </span>
                </h2>
                <p className="text-navy-300 mb-8 max-w-md mx-auto">
                    Open to opportunities and collaborations. Feel free to reach out!
                </p>

                <div className="flex justify-center gap-6 mb-10">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-navy-700 hover:bg-coral-500 rounded-xl transition-all duration-md-medium shadow-md-2 hover:shadow-md-3 hover:-translate-y-1 group"
                        aria-label="GitHub"
                    >
                        <Github size={28} className="text-cream group-hover:scale-110 transition-transform duration-md-short" />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-navy-700 hover:bg-coral-500 rounded-xl transition-all duration-md-medium shadow-md-2 hover:shadow-md-3 hover:-translate-y-1 group"
                        aria-label="LinkedIn"
                    >
                        <Linkedin size={28} className="text-cream group-hover:scale-110 transition-transform duration-md-short" />
                    </a>
                    <a
                        href="mailto:hello@example.com"
                        className="p-4 bg-navy-700 hover:bg-coral-500 rounded-xl transition-all duration-md-medium shadow-md-2 hover:shadow-md-3 hover:-translate-y-1 group"
                        aria-label="Email"
                    >
                        <Mail size={28} className="text-cream group-hover:scale-110 transition-transform duration-md-short" />
                    </a>
                </div>

                <div className="border-t border-navy-700 pt-6">
                    <p className="text-navy-400 text-sm">
                        © {new Date().getFullYear()} Yuka T.
                    </p>
                </div>
            </div>
        </footer>
    );
};
