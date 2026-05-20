"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings2, Info, RefreshCw, Check, Copy } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function ColorFormatConverterClient() {
  const t = useTranslations('tools.color-format-converter');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [hsl, setHsl] = useState('hsl(239, 84%, 67%)');
  const [cmyk, setCmyk] = useState('cmyk(59%, 58%, 0%, 5%)');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255); let m = 1 - (g / 255); let y = 1 - (b / 255);
    let k = Math.min(c, m, y);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    c = Math.round(((c - k) / (1 - k)) * 100); m = Math.round(((m - k) / (1 - k)) * 100); y = Math.round(((y - k) / (1 - k)) * 100); k = Math.round(k * 100);
    return { c, m, y, k };
  };

  const updateFromHex = (value: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(value)) return;
    const { r, g, b } = hexToRgb(value);
    const { h, s, l } = rgbToHsl(r, g, b);
    const { c, m, y, k } = rgbToCmyk(r, g, b);
    setHex(value); setRgb(`rgb(${r}, ${g}, ${b})`); setHsl(`hsl(${h}, ${s}%, ${l}%)`); setCmyk(`cmyk(${c}%, ${m}%, ${y}%, ${k}%)`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-6">
        <ToolCard title={t('pick_color')} contentClassName="p-12 flex flex-col items-center justify-center gap-6">
           <div className="w-32 h-32 rounded-full shadow-2xl border-4 border-white transition-all duration-300" style={{ backgroundColor: hex }} />
           <div className="flex gap-4 w-full max-w-sm">
              <Input type="color" value={hex} onChange={(e) => updateFromHex(e.target.value)} className="w-12 h-10 p-0 border-none bg-transparent cursor-pointer" />
              <Input type="text" value={hex} onChange={(e) => updateFromHex(e.target.value)} className="h-10 text-center font-mono font-bold uppercase tracking-widest text-lg" />
           </div>
        </ToolCard>

        <div className="grid gap-4 sm:grid-cols-2">
           {[
             { label: 'HEX', value: hex.toUpperCase(), id: 'hex' },
             { label: 'RGB', value: rgb, id: 'rgb' },
             { label: 'HSL', value: hsl, id: 'hsl' },
             { label: 'CMYK', value: cmyk, id: 'cmyk' }
           ].map((field) => (
             <ToolCard key={field.id} title={field.label} contentClassName="p-1 pl-4 flex items-center gap-2">
                <span className="flex-1 font-mono text-sm font-medium">{field.value}</span>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(field.value, field.id)} className="h-9 w-9 text-muted-foreground">
                   {copiedType === field.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
             </ToolCard>
           ))}
        </div>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard 
          title={commonT('ui.settings')} 
          icon={Settings2} 
          action={<RefreshCw className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => updateFromHex('#6366f1')} />}
          contentClassName="p-4 space-y-4"
        >
           <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-normal">{t('sidebar_desc')}</p>
          </div>
          <div className="space-y-2">
             <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">{commonT('ui.info')}</Label>
             <p className="text-[10px] text-muted-foreground leading-relaxed">CMYK is used for print, while RGB/HEX/HSL are used for digital screens. Use HSL for intuitive color adjustments.</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
