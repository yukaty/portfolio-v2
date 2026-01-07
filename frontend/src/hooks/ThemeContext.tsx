import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        return (localStorage.getItem('theme') as Theme) || 'system';
    });

    const [isDark, setIsDark] = useState(false);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        if (newTheme === 'system') {
            localStorage.removeItem('theme');
        } else {
            localStorage.setItem('theme', newTheme);
        }
    };

    useEffect(() => {
        const root = window.document.documentElement;

        // Function to calculate if dark mode should be active
        const checkIsDark = () => {
            if (theme === 'dark') return true;
            if (theme === 'light') return false;
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        };

        const activeDark = checkIsDark();
        setIsDark(activeDark);

        if (activeDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Listen for system theme changes if set to system
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const listener = (e: MediaQueryListEvent) => {
                setIsDark(e.matches);
                if (e.matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            };
            mediaQuery.addEventListener('change', listener);
            return () => mediaQuery.removeEventListener('change', listener);
        }
    }, [theme]);

    // Provide the actual theme state and toggle function
    const value = {
        theme,
        setTheme,
        isDark
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
