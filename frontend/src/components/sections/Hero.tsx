import React from 'react';
import { motion } from 'framer-motion';
import { ChatCard } from '../chat/ChatCard';
import { useTypewriter } from '../../hooks/useTypewriter';

export const Hero: React.FC = () => {
    const fullText = "Hi! I'm Yuka's AI assistant. Happy to help you understand her!";
    const displayText = useTypewriter(fullText);

    return (
        <section className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-cream overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-coral/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-navy/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left Column: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className="space-y-8"
                    >
                        <div className="space-y-6">
                            <h1 className="text-6xl md:text-8xl font-display leading-tight">
                                <span className="text-navy-800">Yuka </span>
                                <span className="text-coral-500">T.</span>
                            </h1>

                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl text-navy-800 font-bold tracking-tight font-sans">
                                    Full Stack Developer
                                </h2>
                                <p className="text-navy-400 font-sans">
                                    Based in Canada
                                </p>
                            </div>

                            <div className="space-y-3">
                                <p className="text-navy-600 text-lg md:text-xl leading-relaxed">
                                    Building <span className="text-coral-500 font-semibold">scalable</span> systems and{' '}
                                    <span className="text-coral-500 font-semibold">clean</span> digital experiences.
                                    8+ years of expertise in Backend, Modern AI integration, and Technical Content Development.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: AI Chat Interface */}
                    <ChatCard initialText={displayText} />
                </div>
            </div>
        </section>
    );
};

