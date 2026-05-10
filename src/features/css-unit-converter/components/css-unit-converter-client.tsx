"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Repeat, Info, RefreshCw, Layers } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function CSSUnitConverterClient() {
  const t = useTranslations('tools.css-unit-converter');
  const commonT = useTranslations('common');

  const [pxValue, setPxValue] = useState<string>('16');
  const [baseSize, setBaseSize] = useState<string>('16');
  const [viewportWidth, setViewportWidth] = useState<string>('1920');
  const [viewportHeight, setViewportHeight] = useState<string>('1080');

  const conversions = useMemo(() => {
    const px = parseFloat(pxValue) || 0;
    const base = parseFloat(baseSize) || 16;
    const vw = parseFloat(viewportWidth) || 1920;
    const vh = parseFloat(viewportHeight) || 1080;

    return [
      { unit: 'px', value: px.toFixed(0), desc: t('units.px') },
      { unit: 'rem', value: (px / base).toFixed(3), desc: t('units.rem') },
      { unit: 'em', value: (px / base).toFixed(3), desc: t('units.em') },
      { unit: 'vw', value: ((px / vw) * 100).toFixed(3), desc: t('units.vw') },
      { unit: 'vh', value: ((px / vh) * 100).toFixed(3), desc: t('units.vh') },
      { unit: '%', value: ((px / base) * 100).toFixed(0), desc: t('units.percent') },
    ];
  }, [pxValue, baseSize, viewportWidth, viewportHeight, t]);

  const reset = () => {
    setPxValue('16');
    setBaseSize('16');
    setViewportWidth('1920');
    setViewportHeight('1080');
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Main Converter Card */}
          <Card className="border border-border shadow-none bg-background overflow-hidden">
             <div className="bg-indigo-500/5 border-b border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                   <h3 className="text-lg font-bold">{t('px_to_all')}</h3>
                   <p className="text-xs text-muted-foreground">{t('px_desc')}</p>
                </div>
                <div className="flex items-center gap-3 bg-background p-2 rounded-lg border border-border shadow-sm">
                   <Input 
                     type="number" 
                     value={pxValue} 
                     onChange={(e) => setPxValue(e.target.value)}
                     className="w-24 h-10 text-center font-mono text-lg border-none focus-visible:ring-0"
                   />
                   <span className="text-xs font-bold text-muted-foreground pr-2 uppercase tracking-widest">PX</span>
                </div>
             </div>
             <CardContent className="p-0">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-border">
                   {conversions.map((conv) => (
                     <div key={conv.unit} className="p-6 space-y-3 group hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{conv.unit}</span>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                             onClick={() => navigator.clipboard.writeText(`${conv.value}${conv.unit}`)}
                           >
                              <Repeat className="h-3 w-3" />
                           </Button>
                        </div>
                        <div className="flex items-baseline gap-1">
                           <p className="text-3xl font-black tracking-tighter">{conv.value}</p>
                           <span className="text-xs font-bold text-muted-foreground">{conv.unit}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{conv.desc}</p>
                     </div>
                   ))}
                </div>
             </CardContent>
          </Card>

          {/* Quick Reference Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
             <Card className="border border-border shadow-none bg-background p-6">
                <h4 className="text-sm font-bold mb-4">{t('common_values')}</h4>
                <div className="space-y-2">
                   {[8, 12, 14, 16, 20, 24, 32].map(val => (
                     <button 
                       key={val}
                       onClick={() => setPxValue(val.toString())}
                       className="w-full flex items-center justify-between p-2 rounded border border-border hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all text-xs font-mono"
                     >
                       <span>{val}px</span>
                       <span>{(val / parseFloat(baseSize)).toFixed(3)}rem</span>
                     </button>
                   ))}
                </div>
             </Card>
             <div className="p-6 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                      <Layers className="h-5 w-5 text-white" />
                   </div>
                   <h4 className="text-sm font-bold">{t('why_rem')}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                   "{t('rem_quote')}"
                </p>
             </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5" />
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
                    onChange={(e) => setBaseSize(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('vw_width')}</Label>
                  <Input 
                    type="number" 
                    value={viewportWidth} 
                    onChange={(e) => setViewportWidth(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('vw_height')}</Label>
                  <Input 
                    type="number" 
                    value={viewportHeight} 
                    onChange={(e) => setViewportHeight(e.target.value)}
                    className="h-8 text-xs"
                  />
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
      <ToolNavigation currentToolId="css-unit-converter" />
    </div>
  );
}
