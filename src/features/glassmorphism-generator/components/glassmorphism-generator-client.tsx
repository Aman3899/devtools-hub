"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Settings2, Info, RefreshCw, Zap, Image as ImageIcon } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function GlassmorphismGeneratorClient() {
  const t = useTranslations('tools.glassmorphism-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(0.2);
  const [color, setColor] = useState('#ffffff');
  const [borderOpacity, setBorderOpacity] = useState(0.1);
  const [radius, setRadius] = useState(16);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  const glassStyle = { background: `rgba(${hexToRgb(color)}, ${transparency})`, backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, borderRadius: `${radius}px`, border: `1px solid rgba(${hexToRgb(color)}, ${borderOpacity})` };
  const cssCode = `background: rgba(${hexToRgb(color)}, ${transparency});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder-radius: ${radius}px;\nborder: 1px solid rgba(${hexToRgb(color)}, ${borderOpacity});`;

  const applySample = (b: number, tr: number, bo: number) => { setBlur(b); setTransparency(tr); setBorderOpacity(bo); };
  const reset = () => { setBlur(10); setTransparency(0.2); setColor('#ffffff'); setBorderOpacity(0.1); setRadius(16); };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-6">
        <ToolCard title={commonT('ui.preview')} contentClassName="p-20 flex items-center justify-center min-h-[400px] relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
           <div className="w-full max-w-md h-64 shadow-2xl relative z-10 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center gap-4" style={glassStyle}>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><ImageIcon className="h-6 w-6 text-white" /></div>
              <div className="space-y-1"><h3 className="text-xl font-bold text-white tracking-tight">Glassmorphism</h3><p className="text-white/60 text-xs">Frosted glass effect using CSS</p></div>
           </div>
        </ToolCard>

        <ToolCard 
          title={commonT('ui.result')}
          action={<Button variant="ghost" size="sm" onClick={() => copyToClipboard(cssCode, 'css')} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'css' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}{commonT('copy')}</Button>}
          contentClassName="p-4 bg-muted/20 font-mono text-xs overflow-x-auto whitespace-pre"
        >
          {cssCode}
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard 
          title={commonT('ui.settings')} 
          icon={Settings2} 
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => applySample(20, 0.1, 0.05)} className="h-6 px-1.5 text-[10px] w-auto" title="Soft Glass"><Zap className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" onClick={reset} className="h-6 w-6"><RefreshCw className="h-3 w-3" /></Button>
            </div>
          }
          contentClassName="p-4 space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2"><div className="flex justify-between items-center"><Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('blur')}</Label><span className="text-[10px] font-mono">{blur}px</span></div><Slider value={[blur]} onValueChange={(v) => setBlur(Array.isArray(v) ? v[0] : v)} max={50} step={1} /></div>
            <div className="space-y-2"><div className="flex justify-between items-center"><Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('transparency')}</Label><span className="text-[10px] font-mono">{Math.round(transparency * 100)}%</span></div><Slider value={[transparency]} onValueChange={(v) => setTransparency(Array.isArray(v) ? v[0] : v)} min={0} max={1} step={0.01} /></div>
            <div className="space-y-2"><div className="flex justify-between items-center"><Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('border_opacity')}</Label><span className="text-[10px] font-mono">{Math.round(borderOpacity * 100)}%</span></div><Slider value={[borderOpacity]} onValueChange={(v) => setBorderOpacity(Array.isArray(v) ? v[0] : v)} min={0} max={1} step={0.01} /></div>
            <div className="space-y-2"><div className="flex justify-between items-center"><Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('radius')}</Label><span className="text-[10px] font-mono">{radius}px</span></div><Slider value={[radius]} onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)} max={100} step={1} /></div>
            <div className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('color')}</Label>
              <div className="flex gap-2">
                <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer" />
                <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 text-xs font-mono uppercase" />
              </div>
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
