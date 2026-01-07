import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === 'system') {
            setTheme('light');
        } else if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('system');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl bg-bg-card border border-border-primary shadow-md-1 hover:shadow-md-2 transition-all group overflow-hidden"
            aria-label={`Current theme: ${theme}. Click to change.`}
            title={`Switch Theme (Current: ${theme})`}
        >
            <div className="relative w-6 h-6">
                <AnimatePresence mode="wait">
                    {theme === 'system' ? (
                        <motion.div
                            key="system"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Laptop size={24} className="text-text-secondary group-hover:text-coral transition-colors" />
                        </motion.div>
                    ) : theme === 'dark' ? (
                        <motion.div
                            key="dark"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon size={24} className="text-coral" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="light"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun size={24} className="text-coral" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </button>
    );
};
