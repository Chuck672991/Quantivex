'use client';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'portfolio-theme';

function applyTheme(theme: Theme) {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
}

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('light');
    const isDark = useMemo(() => theme === 'dark', [theme]);

    useEffect(() => {
        const t = getInitialTheme();
        setTheme(t);
        applyTheme(t);
    }, []);

    const toggle = () => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        window.localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            className="group inline-flex items-center justify-center gap-2 border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            aria-label="Toggle dark mode"
        >
            {isDark ? (
                <>
                    <Sun size={16} className="opacity-80 group-hover:opacity-100" />
                    Light
                </>
            ) : (
                <>
                    <Moon size={16} className="opacity-80 group-hover:opacity-100" />
                    Dark
                </>
            )}
        </button>
    );
}

