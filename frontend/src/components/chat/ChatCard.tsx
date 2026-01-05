import React from 'react';
import { Send, Sparkles, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatCardProps {
    displayText: string;
}

export const ChatCard: React.FC<ChatCardProps> = ({ displayText }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
        >
            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-md-4 border border-navy-100/50 p-6 md:p-8 max-w-md mx-auto w-full relative z-10 hover:shadow-md-5 transition-shadow duration-md-long">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 border-b border-navy-100 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center text-white shadow-md-2">
                        <Bot size={28} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-navy-800 text-lg">Ask My AI Assistant</h3>
                        <p className="text-xs text-navy-400 font-medium">Powered by Gemini + RAG</p>
                    </div>
                    <Sparkles className="text-coral w-5 h-5 animate-pulse-slow" />
                </div>

                {/* Chat Area */}
                <div className="space-y-6 mb-8 min-h-[140px]">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cream-100 to-cream-200 flex-shrink-0 flex items-center justify-center text-coral-600 shadow-md-1">
                            <Bot size={24} />
                        </div>
                        <div className="bg-gradient-to-br from-cream-50 to-cream-100 rounded-2xl rounded-tl-none p-4 text-navy-700 text-sm leading-relaxed shadow-md-1">
                            {displayText}
                            <span className="inline-block w-1.5 h-4 bg-coral-500 ml-1 align-middle animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Input Mock */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Type your question..."
                        disabled
                        className="w-full bg-navy-50/50 border-2 border-navy-100 rounded-xl px-4 py-3.5 text-sm text-navy-700 placeholder:text-navy-300 focus:outline-none cursor-not-allowed opacity-70 shadow-inner"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-coral-500 text-white rounded-lg opacity-50 cursor-not-allowed shadow-md-1">
                        <Send size={16} />
                    </button>
                </div>

                {/* Suggestions Chips */}
                <div className="flex flex-wrap gap-2">
                    {[
                        "Summary of Experience",
                        "Tech Stack",
                        "Why hire Yuka?",
                    ].map((chip) => (
                        <span
                            key={chip}
                            className="px-4 py-2 bg-white border-2 border-coral-200 text-coral-600 text-xs font-medium rounded-lg cursor-pointer hover:bg-coral-50 hover:border-coral-300 transition-all duration-md-short shadow-md-1 hover:shadow-md-2"
                        >
                            {chip}
                        </span>
                    ))}
                </div>
            </div>

            {/* Decorative Card Behind - subtle depth */}
            <div className="absolute top-4 -right-4 w-full h-full bg-gradient-to-br from-navy-100/30 to-coral-100/20 rounded-3xl -z-10 rotate-2 transform blur-sm" />
        </motion.div>
    );
};
