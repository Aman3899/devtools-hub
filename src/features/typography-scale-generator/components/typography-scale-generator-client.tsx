"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Settings2, Info, RefreshCw, Type, Zap } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

const RATIOS = [
  { name: 'Minor Second', value: 1.067 },
  { name: 'Major Second', value: 1.125 },
  { name: 'Minor Third', value: 1.200 },
  { name: 'Major Third', value: 1.250 },
  { name: 'Perfect Fourth', value: 1.333 },
  { name: 'Augmented Fourth', value: 1.414 },
  { name: 'Perfect Fifth', value: 1.500 },
  { name: 'Golden Ratio', value: 1.618 }
];

export function TypographyScaleGeneratorClient() {
  const t = useTranslations('tools.typography-scale-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [steps, setSteps] = useState(6);

  const scale = useMemo(() => {
    const result = [];
    for (let i = steps - 1; i >= 0; i--) {
      const size = baseSize * Math.pow(ratio, i);
      result.push({
        step: i,
        px: Math.round(size),
        rem: (size / 16).toFixed(3).replace(/\.?0+$/, '')
      });
    }
    return result;
  }, [baseSize, ratio, steps]);

  const cssCode = useMemo(() => {
    return `:root {\n${scale.map((s, i) => `  --text-${scale.length - i - 1}: ${s.rem}rem; /* ${s.px}px */`).join('\n')}\n}`;
  }, [scale]);

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-6">
        {/* Visual Preview */}
        <ToolCard 
          title={commonT('ui.preview')}
          contentClassName="p-8 md:p-12 space-y-8 bg-background"
        >
          {scale.map((s, i) => (
            <div key={i} className="flex items-baseline gap-6 group">
              <div className="w-16 text-[10px] font-mono text-muted-foreground uppercase tracking-widest shrink-0">
                Step {s.step}
              </div>
              <div className="flex-1">
                <h2 
                  className="font-bold leading-tight truncate text-foreground transition-all group-hover:text-primary"
                  style={{ fontSize: `${s.rem}rem` }}
                >
                  The quick brown fox jumps
                </h2>
                <div className="flex gap-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono bg-muted px-1.5 rounded">{s.px}px</span>
                  <span className="text-[10px] font-mono bg-muted px-1.5 rounded">{s.rem}rem</span>
                </div>
              </div>
            </div>
          ))}
        </ToolCard>

        {/* CSS Code */}
        <ToolCard 
          title={t('output')}
          action={
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(cssCode, 'css')} 
              className="h-6 px-2 text-[10px] gap-1.5 transition-colors"
            >
              {copiedType === 'css' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {commonT('copy')}
            </Button>
          }
          contentClassName="p-4 font-mono text-xs overflow-x-auto bg-muted/20"
        >
          <pre className="text-foreground leading-relaxed">{cssCode}</pre>
        </ToolCard>
      </div>

      {/* Sidebar Settings */}
      <div className="md:col-span-1 space-y-4">
        <ToolCard 
          title={commonT('ui.settings')} 
          icon={Settings2}
          action={<RefreshCw className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => { setBaseSize(16); setRatio(1.25); }} />}
          contentClassName="p-4 space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('base_size')}</Label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  value={baseSize} 
                  onChange={(e) => setBaseSize(Number(e.target.value) || 16)}
                  className="h-10 text-center font-bold text-lg"
                />
                <div className="flex flex-col justify-center px-3 bg-muted/30 border rounded text-[10px] font-bold">PX</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('ratio')}</Label>
              <Select value={ratio.toString()} onValueChange={(v) => v && setRatio(parseFloat(v))}>
                <SelectTrigger className="h-10 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RATIOS.map(r => (
                    <SelectItem key={r.value} value={r.value.toString()} className="text-[11px]">
                      {r.name} ({r.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('steps')}</Label>
              <div className="flex items-center gap-4">
                <Input 
                  type="range" 
                  min="3" 
                  max="10" 
                  value={steps} 
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-bold w-4 text-center">{steps}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              {t('sidebar_desc')}
            </p>
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => setRatio(1.067)}>Modern</Button>
              <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => setRatio(1.618)}>Classic</Button>
            </div>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
