'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColors = {
  background: string;
  foreground: string;
  primary: string;
  accent: string;
  border: string;
  card: string;
  muted: string;
};

export type Theme = {
  id: string;
  name: string;
  colors: ThemeColors;
  isCustom?: boolean;
};

export const PRESET_THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    colors: {
      background: '210 40% 98%',
      foreground: '224 71.4% 4.1%',
      primary: '217.2 91.2% 59.8%',
      accent: '178.1 65.5% 50.4%',
      border: '210 40% 89.8%',
      card: '0 0% 100%',
      muted: '210 40% 96.1%',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      background: '224 71.4% 4.1%',
      foreground: '210 20% 98%',
      primary: '263.4 70% 50.4%',
      accent: '280 65% 60%',
      border: '215 27.9% 16.9%',
      card: '224 71.4% 4.1%',
      muted: '215 27.9% 16.9%',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      background: '142.1 70.6% 4.5%',
      foreground: '210 20% 98%',
      primary: '142.1 76.2% 36.3%',
      accent: '160 60% 45%',
      border: '142.1 70.6% 14.5%',
      card: '142.1 70.6% 4.5%',
      muted: '142.1 70.6% 14.5%',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      background: '20 40% 98%',
      foreground: '20 71.4% 4.1%',
      primary: '12 76% 61%',
      accent: '27 87% 67%',
      border: '20 40% 89.8%',
      card: '0 0% 100%',
      muted: '20 40% 96.1%',
    },
  },
];

type ThemeContextType = {
  currentTheme: Theme;
  customThemes: Theme[];
  setThemeById: (id: string) => void;
  addCustomTheme: (name: string, colors: ThemeColors) => void;
  updateCustomTheme: (id: string, name: string, colors: ThemeColors) => void;
  deleteCustomTheme: (id: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(PRESET_THEMES[0]);
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('custom-themes');
    if (saved) {
      try {
        setCustomThemes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse custom themes', e);
      }
    }
    
    const savedCurrentId = localStorage.getItem('current-theme-id');
    if (savedCurrentId) {
      const allThemes = [...PRESET_THEMES, ...(saved ? JSON.parse(saved) : [])];
      const found = allThemes.find(t => t.id === savedCurrentId);
      if (found) setCurrentTheme(found);
    }
    setIsLoaded(true);
  }, []);

  // Save custom themes to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('custom-themes', JSON.stringify(customThemes));
    }
  }, [customThemes, isLoaded]);

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    const { colors } = currentTheme;
    
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--muted', colors.muted);
    
    // Simple logic for dark mode based on background lightness
    const bgParts = colors.background.split(' ');
    const lightness = parseInt(bgParts[bgParts.length - 1]);
    if (lightness < 30) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (isLoaded) {
      localStorage.setItem('current-theme-id', currentTheme.id);
    }
  }, [currentTheme, isLoaded]);

  const setThemeById = (id: string) => {
    const allThemes = [...PRESET_THEMES, ...customThemes];
    const theme = allThemes.find((t) => t.id === id);
    if (theme) setCurrentTheme(theme);
  };

  const addCustomTheme = (name: string, colors: ThemeColors) => {
    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name,
      colors,
      isCustom: true,
    };
    setCustomThemes((prev) => [...prev, newTheme]);
    setCurrentTheme(newTheme);
  };

  const updateCustomTheme = (id: string, name: string, colors: ThemeColors) => {
    setCustomThemes((prev) => 
      prev.map(t => t.id === id ? { ...t, name, colors } : t)
    );
    if (currentTheme.id === id) {
      setCurrentTheme({ id, name, colors, isCustom: true });
    }
  };

  const deleteCustomTheme = (id: string) => {
    setCustomThemes((prev) => prev.filter(t => t.id !== id));
    if (currentTheme.id === id) {
      setCurrentTheme(PRESET_THEMES[0]);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      customThemes, 
      setThemeById, 
      addCustomTheme,
      updateCustomTheme,
      deleteCustomTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
