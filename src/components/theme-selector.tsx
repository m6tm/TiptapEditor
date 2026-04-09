'use client';

import React, { useState } from 'react';
import { useTheme, PRESET_THEMES, ThemeColors, Theme } from './theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Palette, Settings2, Trash2, Edit2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Convertit une valeur HSL (format "H S% L%") en code HEX
const hslToHex = (hsl: string): string => {
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3) return '#000000';

  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number): string => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Convertit un code HEX en valeur HSL (format "H S% L%")
const hexToHsl = (hex: string): string => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export function ThemeSelector() {
  const { currentTheme, customThemes, setThemeById, addCustomTheme, updateCustomTheme, deleteCustomTheme } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [themeName, setThemeName] = useState('');
  const [tempColors, setTempColors] = useState<ThemeColors>(PRESET_THEMES[0].colors);

  const openNewThemeDialog = () => {
    setEditingThemeId(null);
    setThemeName('My Custom Theme');
    setTempColors(currentTheme.colors);
    setIsDialogOpen(true);
  };

  const openEditThemeDialog = (theme: Theme) => {
    setEditingThemeId(theme.id);
    setThemeName(theme.name);
    setTempColors(theme.colors);
    setIsDialogOpen(true);
  };

  const handleColorPickerChange = (key: keyof ThemeColors, hex: string) => {
    const hslValue = hexToHsl(hex);
    setTempColors(prev => ({ ...prev, [key]: hslValue }));
  };

  const saveTheme = () => {
    if (editingThemeId) {
      updateCustomTheme(editingThemeId, themeName, tempColors);
    } else {
      addCustomTheme(themeName, tempColors);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Palette className="h-4 w-4" />
            <span>Theme: {currentTheme.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Preset Themes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {PRESET_THEMES.map((theme) => (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => setThemeById(theme.id)}
              className="flex items-center gap-2"
            >
              <div 
                className="h-3 w-3 rounded-full border" 
                style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
              />
              <span className="flex-1">{theme.name}</span>
              {currentTheme.id === theme.id && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Custom Themes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {customThemes.length > 0 ? (
            customThemes.map((theme) => (
              <DropdownMenuSub key={theme.id}>
                <DropdownMenuSubTrigger className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full border" 
                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                  />
                  <span className="flex-1">{theme.name}</span>
                  {currentTheme.id === theme.id && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setThemeById(theme.id)}>
                      Apply Theme
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditThemeDialog(theme)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => deleteCustomTheme(theme.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))
          ) : (
            <div className="px-2 py-1.5 text-xs text-muted-foreground italic">
              No custom themes yet
            </div>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openNewThemeDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            New Custom Theme
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingThemeId ? 'Edit Theme' : 'Create Custom Theme'}</DialogTitle>
            <DialogDescription>
              Customize your workspace with your favorite colors.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input 
                id="name" 
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                className="col-span-3"
                placeholder="My Awesome Theme"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="primary" className="text-right">Primary</Label>
              <Input 
                id="primary" 
                type="color" 
                value={hslToHex(tempColors.primary)}
                className="col-span-1 h-10 p-1 cursor-pointer"
                onChange={(e) => handleColorPickerChange('primary', e.target.value)}
              />
              <Input 
                value={tempColors.primary} 
                onChange={(e) => setTempColors(prev => ({...prev, primary: e.target.value}))}
                className="col-span-2 text-xs"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="background" className="text-right">Background</Label>
              <Input 
                id="background" 
                type="color" 
                value={hslToHex(tempColors.background)}
                className="col-span-1 h-10 p-1 cursor-pointer"
                onChange={(e) => handleColorPickerChange('background', e.target.value)}
              />
              <Input 
                value={tempColors.background} 
                onChange={(e) => setTempColors(prev => ({...prev, background: e.target.value}))}
                className="col-span-2 text-xs"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accent" className="text-right">Accent</Label>
              <Input 
                id="accent" 
                type="color" 
                value={hslToHex(tempColors.accent)}
                className="col-span-1 h-10 p-1 cursor-pointer"
                onChange={(e) => handleColorPickerChange('accent', e.target.value)}
              />
              <Input 
                value={tempColors.accent} 
                onChange={(e) => setTempColors(prev => ({...prev, accent: e.target.value}))}
                className="col-span-2 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveTheme}>
              {editingThemeId ? 'Save Changes' : 'Add Theme'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
