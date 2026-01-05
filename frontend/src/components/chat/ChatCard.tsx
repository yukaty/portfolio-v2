import React from 'react';
import { Send, Sparkles, Bot, Briefcase, Users, BookOpen, HelpCircle } from 'lucide-react';
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
            <div className="bg-white rounded-3xl shadow-md-4 border border-navy-100/50 p-6 md:p-8 max-w-md mx-auto w-full relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 border-b border-navy-100 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center text-white shadow-md-2">
                        <Bot size={28} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-navy-800 text-lg">Yuka's AI Assistant</h3>
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
                <div>
                    <p className="text-xs text-navy-400 font-medium mb-3">Try asking:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { icon: Briefcase, text: "Her Experience?" },
                            { icon: Users, text: "Work Style?" },
                            { icon: BookOpen, text: "Tech Insights?" },
                            { icon: HelpCircle, text: "How It Works?" },
                        ].map((chip) => (
                            <span
                                key={chip.text}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-coral-200/60 text-coral-600 text-xs font-medium rounded-lg opacity-50 cursor-not-allowed"
                            >
                                <chip.icon className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="whitespace-nowrap">{chip.text}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative Card Behind - subtle depth */}
            <div className="absolute top-4 -right-4 w-full h-full bg-gradient-to-br from-navy-100/30 to-coral-100/20 rounded-3xl -z-10 rotate-2 transform blur-sm" />
        </motion.div>
    );
};
