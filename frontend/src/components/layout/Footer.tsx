import React from 'react';
import { Github, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="contact"
      className="bg-navy-900 py-20 text-cream-50 border-t-2 border-border-primary transition-colors duration-300"
    >
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold mb-3">
          <span className="text-white">Let's </span>
          <span className="text-coral-400">Connect</span>
        </h2>
        <p className="text-navy-300 mb-8 max-w-md mx-auto">
          Open to opportunities and collaborations.
          <br />
          Feel free to reach out!
        </p>

        <div className="flex justify-center gap-4 sm:gap-6 mb-10">
          <a
            href="https://github.com/yukaty/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-navy-800 hover:bg-coral-500 rounded-xl transition-all duration-md-medium shadow-md-2 hover:shadow-md-3 hover:-translate-y-1 group border border-navy-700"
            aria-label="GitHub"
          >
            <Github
              size={28}
              className="text-white group-hover:scale-110 transition-transform duration-md-short"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/yuka-tamura/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-navy-800 hover:bg-coral-500 rounded-xl transition-all duration-md-medium shadow-md-2 hover:shadow-md-3 hover:-translate-y-1 group border border-navy-700"
            aria-label="LinkedIn"
          >
            <Linkedin
              size={28}
              className="text-white group-hover:scale-110 transition-transform duration-md-short"
            />
          </a>
        </div>

        <div className="border-t border-navy-800 pt-6">
          <p className="text-navy-500 text-sm">© {new Date().getFullYear()} Yuka T.</p>
        </div>
      </div>
    </footer>
  );
};
