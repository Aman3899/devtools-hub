"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings2, Info, RefreshCw, Zap, Shield } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function BoxShadowGeneratorClient() {
  const t = useTranslations('tools.box-shadow-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [hOffset, setHOffset] = useState(10);
  const [vOffset, setVOffset] = useState(10);
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#00000033');
  const [inset, setInset] = useState(false);

  const shadowCode = useMemo(() => {
    return `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${color}`;
  }, [hOffset, vOffset, blur, spread, color, inset]);

  const applySample = (h: number, v: number, b: number, s: number, c: string, i: boolean) => {
    setHOffset(h); setVOffset(v); setBlur(b); setSpread(s); setColor(c); setInset(i);
  };

  const reset = () => { setHOffset(10); setVOffset(10); setBlur(20); setSpread(0); setColor('#00000033'); setInset(false); };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-6">
        <ToolCard title={commonT('ui.preview')} contentClassName="p-0">
          <div className="flex items-center justify-center p-20 min-h-[400px] relative">
             <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
             <div className="w-48 h-48 bg-white rounded-xl relative z-10 transition-all duration-200" style={{ boxShadow: shadowCode }} />
          </div>
        </ToolCard>

        <ToolCard title={commonT('ui.result')} copyText={`box-shadow: ${shadowCode};`} copyType="css" copiedType={copiedType} onCopy={copyToClipboard} contentClassName="p-4 font-mono text-xs overflow-x-auto whitespace-pre bg-muted/20">
           box-shadow: {shadowCode};
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard 
          title={commonT('ui.settings')} 
          icon={Settings2}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => applySample(0, 10, 20, -5, '#0000004d', false)} className="h-6 px-1.5 text-[10px] w-auto gap-1" title="Soft Shadow"><Zap className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" onClick={() => applySample(5, 5, 0, 0, '#000000', false)} className="h-6 px-1.5 text-[10px] w-auto gap-1" title="Hard Shadow"><Shield className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" onClick={reset} className="h-6 w-6 hover:text-foreground"><RefreshCw className="h-3 w-3" /></Button>
            </div>
          }
          contentClassName="p-4 space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between"><Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('inset')}</Label><Switch checked={inset} onCheckedChange={setInset} /></div>
            <div className="space-y-2"><div className="flex justify-between items-center"><Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('h_offset')}</Label><span className="text-[10px] font-mono text-foreground">{hOffset}px</span></div><Slider value={[hOffset]} onValueChange={(v) => setHOffset(Array.isArray(v) ? v[0] : v)} min={-100} max={100} step={1} /></div>
            <div className="space-y-2"><div className="flex justify-between items-center"><Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('v_offset')}</Label><span className="text-[10px] font-mono text-foreground">{vOffset}px</span></div><Slider value={[vOffset]} onValueChange={(v) => setVOffset(Array.isArray(v) ? v[0] : v)} min={-100} max={100} step={1} /></div>
            <div className="space-y-2"><div className="flex justify-between items-center"><Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('blur')}</Label><span className="text-[10px] font-mono text-foreground">{blur}px</span></div><Slider value={[blur]} onValueChange={(v) => setBlur(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={1} /></div>
            <div className="space-y-2"><div className="flex justify-between items-center"><Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('spread')}</Label><span className="text-[10px] font-mono text-foreground">{spread}px</span></div><Slider value={[spread]} onValueChange={(v) => setSpread(Array.isArray(v) ? v[0] : v)} min={-50} max={50} step={1} /></div>
            <div className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('color')}</Label>
              <div className="flex gap-2">
                <Input type="color" value={color.length > 7 ? color.substring(0, 7) : color} onChange={(e) => setColor(e.target.value + (color.length > 7 ? color.substring(7) : ''))} className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer" />
                <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 text-xs font-mono" />
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
