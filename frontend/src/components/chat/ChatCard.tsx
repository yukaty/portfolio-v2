import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, Briefcase, Users, BookOpen, HelpCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../hooks/useChat';

interface ChatCardProps {
    initialText: string;
}

export const ChatCard: React.FC<ChatCardProps> = ({ initialText }) => {
    const { messages, isLoading, error, sendMessage } = useChat();
    const [inputValue, setInputValue] = useState('');
    const chatAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const message = inputValue;
        setInputValue('');
        await sendMessage(message);
    };

    const handleSuggestionClick = (text: string) => {
        if (isLoading) return;
        sendMessage(text);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
        >
            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-md-4 border border-navy-100/50 p-6 md:p-8 max-w-md mx-auto w-full relative z-10 flex flex-col h-[600px]">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 border-b border-navy-100 pb-4 flex-shrink-0">
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
                <div ref={chatAreaRef} className="flex-1 overflow-y-auto mb-6 pr-2">
                    <div className="space-y-6">
                        {/* Initial Greeting */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cream-100 to-cream-200 flex-shrink-0 flex items-center justify-center text-coral-600 shadow-sm">
                                <Bot size={24} />
                            </div>
                            <div className="bg-gradient-to-br from-cream-50 to-cream-100 rounded-2xl rounded-tl-none p-4 text-navy-700 text-sm leading-relaxed shadow-sm">
                                {initialText}
                            </div>
                        </div>

                        {/* Message History */}
                        <AnimatePresence>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-sm ${msg.role === 'user'
                                            ? 'bg-navy-600'
                                            : 'bg-gradient-to-br from-cream-100 to-cream-200 text-coral-600'
                                        }`}>
                                        {msg.role === 'user' ? <User size={20} /> : <Bot size={24} />}
                                    </div>
                                    <div className={`max-w-[80%] p-4 text-sm leading-relaxed shadow-sm rounded-2xl ${msg.role === 'user'
                                            ? 'bg-navy-50 text-navy-800 rounded-tr-none'
                                            : 'bg-gradient-to-br from-cream-50 to-cream-100 text-navy-700 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Loading Indicator */}
                        {isLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cream-100 to-cream-200 flex-shrink-0 flex items-center justify-center text-coral-600 shadow-sm">
                                    <Bot size={24} />
                                </div>
                                <div className="bg-gradient-to-br from-cream-50 to-cream-100 rounded-2xl rounded-tl-none p-4 text-navy-700 text-sm shadow-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-coral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-coral-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                    <span className="w-1.5 h-1.5 bg-coral-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <p className="text-red-500 text-xs text-center">{error}</p>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="relative mb-6 flex-shrink-0">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your question..."
                        disabled={isLoading}
                        className="w-full bg-navy-50/50 border-2 border-navy-100 rounded-xl px-4 py-3.5 text-sm text-navy-700 placeholder:text-navy-300 focus:outline-none focus:border-coral-300 transition-colors shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg transition-all shadow-md ${!inputValue.trim() || isLoading
                                ? 'bg-navy-100 text-navy-300 cursor-not-allowed'
                                : 'bg-coral-500 text-white hover:bg-coral-600'
                            }`}
                    >
                        <Send size={16} />
                    </button>
                </form>

                {/* Suggestions Chips */}
                <div className="flex-shrink-0">
                    <p className="text-xs text-navy-400 font-medium mb-3">Try asking:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { icon: Briefcase, text: "Her Experience?" },
                            { icon: Users, text: "Work Style?" },
                            { icon: BookOpen, text: "Tech Insights?" },
                            { icon: HelpCircle, text: "How It Works?" },
                        ].map((chip) => (
                            <button
                                key={chip.text}
                                onClick={() => handleSuggestionClick(chip.text)}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-coral-200/60 text-coral-600 text-xs font-medium rounded-lg hover:bg-coral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                            >
                                <chip.icon className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="whitespace-nowrap">{chip.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative Card Behind */}
            <div className="absolute top-4 -right-4 w-full h-full bg-gradient-to-br from-navy-100/30 to-coral-100/20 rounded-3xl -z-10 rotate-2 transform blur-sm" />
        </motion.div>
    );
};

