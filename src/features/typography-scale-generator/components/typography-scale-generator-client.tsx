"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Settings2, Info, RefreshCw, Type, Download } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

const SCALES = [
  { name: 'Minor Second', ratio: 1.067 },
  { name: 'Major Second', ratio: 1.125 },
  { name: 'Minor Third', ratio: 1.200 },
  { name: 'Major Third', ratio: 1.250 },
  { name: 'Perfect Fourth', ratio: 1.333 },
  { name: 'Augmented Fourth', ratio: 1.414 },
  { name: 'Perfect Fifth', ratio: 1.500 },
  { name: 'Golden Ratio', ratio: 1.618 },
];

export function TypographyScaleGeneratorClient() {
  const t = useTranslations('tools.typography-scale-generator');
  const commonT = useTranslations('common');

  const [baseSize, setBaseSize] = useState<number>(16);
  const [scaleIndex, setScaleIndex] = useState<number>(4); // Perfect Fourth
  const [copied, setCopied] = useState(false);

  const ratio = SCALES[scaleIndex].ratio;

  const scale = useMemo(() => {
    const steps = [
      { label: 'h1', step: 4 },
      { label: 'h2', step: 3 },
      { label: 'h3', step: 2 },
      { label: 'h4', step: 1 },
      { label: 'p', step: 0 },
      { label: 'small', step: -1 },
    ];

    return steps.map(s => {
      const size = baseSize * Math.pow(ratio, s.step);
      return {
        ...s,
        px: Math.round(size),
        rem: (size / baseSize).toFixed(3)
      };
    });
  }, [baseSize, ratio]);

  const cssOutput = useMemo(() => {
    return scale.map(s => `--text-${s.label}: ${s.rem}rem; /* ${s.px}px */`).join('\n');
  }, [scale]);

  const copyCSS = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setBaseSize(16);
    setScaleIndex(4);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{commonT('ui.preview')}</Label>
            <Card className="border border-border shadow-none rounded-md bg-background p-8 space-y-8">
               {scale.map((s) => (
                 <div key={s.label} className="flex items-baseline gap-6 group">
                    <div className="w-16 shrink-0">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</span>
                       <p className="text-[9px] text-muted-foreground font-mono">{s.px}px / {s.rem}rem</p>
                    </div>
                    <div 
                      className="flex-1 transition-all duration-300 group-hover:translate-x-1"
                      style={{ fontSize: `${s.rem}rem`, lineHeight: '1.2' }}
                    >
                      {t('preview_text')}
                    </div>
                 </div>
               ))}
            </Card>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyCSS}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                {t('copy_variables')}
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-muted/20 p-4 font-mono text-xs overflow-x-auto whitespace-pre">
               {cssOutput}
            </Card>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {commonT('ui.settings')}
                </div>
                <Button variant="ghost" size="icon" onClick={reset} className="h-6 w-6 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('base_size')}</Label>
                  <Input 
                    type="number" 
                    value={baseSize} 
                    onChange={(e) => setBaseSize(parseInt(e.target.value) || 16)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('scale')}</Label>
                  <Select value={scaleIndex.toString()} onValueChange={(v) => setScaleIndex(parseInt(v))}>
                    <SelectTrigger className="h-8 text-[11px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SCALES.map((s, i) => (
                        <SelectItem key={i} value={i.toString()} className="text-[11px]">
                          {s.name} ({s.ratio})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start mt-2">
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  {t('sidebar_desc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="typography-scale-generator" />
    </div>
  );
}
