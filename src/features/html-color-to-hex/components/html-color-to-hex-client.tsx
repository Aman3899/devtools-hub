"use client"

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings2, Info, Copy, RefreshCw, Check, Trash2, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function HtmlColorToHexClient() {
  const t = useTranslations('tools.html-color-to-hex');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [input, setInput] = useState('');
  const [hexOutput, setHexOutput] = useState('');
  const [rgbOutput, setRgbOutput] = useState('');
  const [hslOutput, setHslOutput] = useState('');
  const [error, setError] = useState('');

  const processColor = useCallback((colorStr: string) => {
    if (!colorStr.trim()) { setHexOutput(''); setRgbOutput(''); setHslOutput(''); setError(''); return; }
    try {
      const ctx = document.createElement('canvas').getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = ''; ctx.fillStyle = colorStr;
      
      if (ctx.fillStyle === '#000000' && colorStr.toLowerCase() !== 'black' && colorStr !== '#000000' && colorStr !== '#000' && colorStr.replace(/\s/g,'').toLowerCase() !== 'rgb(0,0,0)' && colorStr.replace(/\s/g,'').toLowerCase() !== 'rgba(0,0,0,1)') {
        const testCtx = document.createElement('canvas').getContext('2d');
        if (testCtx) { testCtx.fillStyle = '#ffffff'; testCtx.fillStyle = colorStr; if (testCtx.fillStyle === '#ffffff') throw new Error('Invalid color'); }
      }
      const hex = ctx.fillStyle;
      ctx.fillRect(0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      const r = data[0], g = data[1], b = data[2], a = data[3] / 255;
      const rgbStr = a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
      
      const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
      const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
      let h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
          case gNorm: h = (bNorm - rNorm) / d + 2; break;
          case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h /= 6;
      }
      const hslStr = a === 1 ? `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)` : `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${a.toFixed(2)})`;

      setHexOutput(hex); setRgbOutput(rgbStr); setHslOutput(hslStr); setError('');
    } catch (err) { setHexOutput(''); setRgbOutput(''); setHslOutput(''); setError(t('invalid_color')); }
  }, [t]);

  const loadSample = () => {
    const samples = ['goldenrod', 'rgb(75, 192, 192)', '#e06c75', 'hsl(280, 100%, 50%)'];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setInput(randomSample); processColor(randomSample); toast.success(commonT('success'));
  };

  const clear = () => { setInput(''); setHexOutput(''); setRgbOutput(''); setHslOutput(''); setError(''); };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        <ToolCard 
          title={t('color_input')}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5"><RefreshCw className="h-3 w-3" />{commonT('ui.sample')}</Button>
              <Button variant="ghost" size="icon" onClick={clear} title={commonT('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
            </div>
          }
          contentClassName="p-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-md border border-border shadow-inner shrink-0 transition-colors" style={{ backgroundColor: hexOutput || 'transparent' }} />
            <Input placeholder="e.g., cornflowerblue, rgb(100, 149, 237), or #6495ED..." className="font-mono text-sm h-12" value={input} onChange={(e) => { setInput(e.target.value); processColor(e.target.value); }} />
          </div>
          {error && <p className="text-xs text-destructive mt-3 px-1">{error}</p>}
        </ToolCard>

        <div className="grid gap-4 sm:grid-cols-3">
          <ToolCard 
            title="HEX" 
            action={<Button variant="ghost" size="sm" onClick={() => copyToClipboard(hexOutput, 'hex')} disabled={!hexOutput} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'hex' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}</Button>}
            contentClassName="p-4 h-[100px] flex items-center justify-center bg-muted/20"
          >
            <span className="font-mono text-sm text-foreground">{hexOutput || '-'}</span>
          </ToolCard>
          
          <ToolCard 
            title="RGB" 
            action={<Button variant="ghost" size="sm" onClick={() => copyToClipboard(rgbOutput, 'rgb')} disabled={!rgbOutput} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'rgb' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}</Button>}
            contentClassName="p-4 h-[100px] flex items-center justify-center text-center bg-muted/20"
          >
            <span className="font-mono text-xs text-foreground break-all">{rgbOutput || '-'}</span>
          </ToolCard>

          <ToolCard 
            title="HSL" 
            action={<Button variant="ghost" size="sm" onClick={() => copyToClipboard(hslOutput, 'hsl')} disabled={!hslOutput} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'hsl' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}</Button>}
            contentClassName="p-4 h-[100px] flex items-center justify-center text-center bg-muted/20"
          >
            <span className="font-mono text-xs text-foreground break-all">{hslOutput || '-'}</span>
          </ToolCard>
        </div>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4">
          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight"><Palette className="h-3 w-3" />Info</div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('info')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
