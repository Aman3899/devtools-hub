"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Settings2, Info, RefreshCw, Download } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function ColorPaletteGeneratorClient() {
  const t = useTranslations('tools.color-palette-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [baseColor, setBaseColor] = useState('#6366f1');
  const [mode, setMode] = useState('complementary');

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255; let g = parseInt(hex.slice(3, 5), 16) / 255; let b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      let d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100; const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => { const k = (n + h / 30) % 12; const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * color).toString(16).padStart(2, '0'); };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const palette = useMemo(() => {
    const { h, s, l } = hexToHsl(baseColor);
    const colors = [baseColor];
    if (mode === 'complementary') { colors.push(hslToHex((h + 180) % 360, s, l)); colors.push(hslToHex(h, s, Math.min(100, l + 20))); colors.push(hslToHex(h, s, Math.max(0, l - 20))); colors.push(hslToHex((h + 180) % 360, s, Math.max(0, l - 20))); } 
    else if (mode === 'triadic') { colors.push(hslToHex((h + 120) % 360, s, l)); colors.push(hslToHex((h + 240) % 360, s, l)); colors.push(hslToHex(h, Math.max(0, s - 20), l)); colors.push(hslToHex((h + 120) % 360, Math.max(0, s - 20), l)); } 
    else if (mode === 'analogous') { colors.push(hslToHex((h + 30) % 360, s, l)); colors.push(hslToHex((h + 60) % 360, s, l)); colors.push(hslToHex((h - 30 + 360) % 360, s, l)); colors.push(hslToHex((h - 60 + 360) % 360, s, l)); } 
    else if (mode === 'monochromatic') { colors.push(hslToHex(h, s, Math.min(100, l + 15))); colors.push(hslToHex(h, s, Math.min(100, l + 30))); colors.push(hslToHex(h, s, Math.max(0, l - 15))); colors.push(hslToHex(h, s, Math.max(0, l - 30))); } 
    else if (mode === 'shades') { colors.push(hslToHex(h, s, 90)); colors.push(hslToHex(h, s, 70)); colors.push(hslToHex(h, s, 50)); colors.push(hslToHex(h, s, 30)); colors.push(hslToHex(h, s, 10)); }
    return Array.from(new Set(colors)).slice(0, 5);
  }, [baseColor, mode]);

  const exportPalette = () => {
    const css = `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'palette.css'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-6">
        <ToolCard title={commonT('ui.preview')} contentClassName="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-5 h-64 rounded-xl overflow-hidden">
            {palette.map((color, i) => (
              <div key={i} className="group relative flex flex-col items-center justify-end p-4 transition-all duration-300 cursor-pointer" style={{ backgroundColor: color }} onClick={() => copyToClipboard(color, `color-${i}`)}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <div className="relative z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono font-bold shadow-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                  {copiedType === `color-${i}` ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  {color.toUpperCase()}
                </div>
                <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest mix-blend-difference text-white opacity-50 group-hover:opacity-100">Color {i + 1}</span>
              </div>
            ))}
          </div>
        </ToolCard>

        <ToolCard 
          title={t('export')} 
          action={<Button variant="ghost" size="sm" onClick={exportPalette} className="h-6 px-2 text-[10px] gap-1.5"><Download className="h-3 w-3" />CSS Variables</Button>}
          contentClassName="p-4 font-mono text-xs overflow-x-auto bg-muted/20"
        >
           <pre className="text-foreground">{`:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`}</pre>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard 
          title={commonT('ui.settings')} 
          icon={Settings2}
          action={<RefreshCw className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => setBaseColor('#6366f1')} />}
          contentClassName="p-4 space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('base_color')}</Label>
              <div className="flex gap-2">
                <Input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer" />
                <Input type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="h-10 text-xs font-mono uppercase" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('mode')}</Label>
              <Select value={mode} onValueChange={(v) => setMode(v || 'complementary')}>
                <SelectTrigger className="h-9 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="complementary" className="text-[11px]">{t('modes.complementary')}</SelectItem>
                  <SelectItem value="triadic" className="text-[11px]">{t('modes.triadic')}</SelectItem>
                  <SelectItem value="analogous" className="text-[11px]">{t('modes.analogous')}</SelectItem>
                  <SelectItem value="monochromatic" className="text-[11px]">{t('modes.monochromatic')}</SelectItem>
                  <SelectItem value="shades" className="text-[11px]">{t('modes.shades')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-normal">{t('sidebar_desc')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
