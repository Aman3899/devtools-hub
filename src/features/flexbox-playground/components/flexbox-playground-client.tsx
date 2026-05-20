"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Copy, Check, Settings2, Info, Plus, Minus, RefreshCw, Zap, Layout } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function FlexboxPlaygroundClient() {
  const t = useTranslations('tools.flexbox-playground');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [direction, setDirection] = useState('row');
  const [justify, setJustify] = useState('center');
  const [align, setAlign] = useState('center');
  const [wrap, setWrap] = useState('nowrap');
  const [gap, setGap] = useState(16);
  const [items, setItems] = useState([1, 2, 3]);

  const containerStyle = { display: 'flex', flexDirection: direction as any, justifyContent: justify, alignItems: align, flexWrap: wrap as any, gap: `${gap}px` };
  const cssCode = `display: flex;\nflex-direction: ${direction};\njustify-content: ${justify};\nalign-items: ${align};\nflex-wrap: ${wrap};\ngap: ${gap}px;`;

  const addItem = () => { if (items.length < 12) setItems([...items, items.length + 1]); };
  const removeItem = () => { if (items.length > 1) setItems(items.slice(0, -1)); };
  const applySample = (d: string, j: string, a: string) => { setDirection(d); setJustify(j); setAlign(a); };
  const reset = () => { setDirection('row'); setJustify('center'); setAlign('center'); setWrap('nowrap'); setGap(16); setItems([1, 2, 3]); };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-6">
        <ToolCard title={commonT('ui.preview')} contentClassName="p-4 min-h-[400px] relative flex overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
           <div className="w-full h-full min-h-[360px] rounded-lg bg-muted/20 border border-dashed border-border p-4 relative z-10" style={containerStyle}>
              {items.map((item) => (<div key={item} className="w-20 h-20 bg-primary/20 border-2 border-primary rounded-md flex items-center justify-center font-bold text-primary text-xl">{item}</div>))}
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
              <Button variant="ghost" size="icon" onClick={() => applySample('column', 'center', 'center')} className="h-6 px-1.5 text-[10px] w-auto" title="Centered Column"><Layout className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" onClick={() => applySample('row', 'space-between', 'center')} className="h-6 px-1.5 text-[10px] w-auto" title="Navbar Style"><Zap className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" onClick={reset} className="h-6 w-6"><RefreshCw className="h-3 w-3" /></Button>
            </div>
          }
          contentClassName="p-4 space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('direction')}</Label>
              <Select value={direction} onValueChange={(v) => setDirection(v || 'row')}>
                <SelectTrigger className="h-8 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="row" className="text-[11px]">row</SelectItem>
                  <SelectItem value="row-reverse" className="text-[11px]">row-reverse</SelectItem>
                  <SelectItem value="column" className="text-[11px]">column</SelectItem>
                  <SelectItem value="column-reverse" className="text-[11px]">column-reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('justify')}</Label>
              <Select value={justify} onValueChange={(v) => setJustify(v || 'center')}>
                <SelectTrigger className="h-8 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start" className="text-[11px]">flex-start</SelectItem>
                  <SelectItem value="center" className="text-[11px]">center</SelectItem>
                  <SelectItem value="flex-end" className="text-[11px]">flex-end</SelectItem>
                  <SelectItem value="space-between" className="text-[11px]">space-between</SelectItem>
                  <SelectItem value="space-around" className="text-[11px]">space-around</SelectItem>
                  <SelectItem value="space-evenly" className="text-[11px]">space-evenly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('align')}</Label>
              <Select value={align} onValueChange={(v) => setAlign(v || 'center')}>
                <SelectTrigger className="h-8 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start" className="text-[11px]">flex-start</SelectItem>
                  <SelectItem value="center" className="text-[11px]">center</SelectItem>
                  <SelectItem value="flex-end" className="text-[11px]">flex-end</SelectItem>
                  <SelectItem value="stretch" className="text-[11px]">stretch</SelectItem>
                  <SelectItem value="baseline" className="text-[11px]">baseline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center"><Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('gap')}</Label><span className="text-[10px] font-mono">{gap}px</span></div>
              <Slider value={[gap]} onValueChange={(v) => setGap(Array.isArray(v) ? v[0] : v)} max={100} step={1} />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('items')}</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={removeItem} className="h-8 w-8" disabled={items.length <= 1}><Minus className="h-4 w-4" /></Button>
                <div className="flex-1 text-center font-mono text-xs">{items.length}</div>
                <Button variant="outline" size="icon" onClick={addItem} className="h-8 w-8" disabled={items.length >= 12}><Plus className="h-4 w-4" /></Button>
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
