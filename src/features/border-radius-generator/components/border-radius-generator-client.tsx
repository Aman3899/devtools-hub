"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Copy, Check, Settings2, Info, RefreshCw, Link as LinkIcon, Unlink, Globe, Zap } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function BorderRadiusGeneratorClient() {
  const t = useTranslations('tools.border-radius-generator');
  const commonT = useTranslations('common');

  const [topLeft, setTopLeft] = useState(12);
  const [topRight, setTopRight] = useState(12);
  const [bottomRight, setBottomRight] = useState(12);
  const [bottomLeft, setBottomLeft] = useState(12);
  const [unit, setUnit] = useState<'px' | '%'>('px');
  const [linked, setLinked] = useState(true);
  const [copied, setCopied] = useState(false);

  const radiusCode = useMemo(() => {
    if (linked) {
      return `${topLeft}${unit}`;
    }
    return `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`;
  }, [topLeft, topRight, bottomRight, bottomLeft, unit, linked]);

  const updateRadius = (value: number, corner?: 'tl' | 'tr' | 'br' | 'bl') => {
    if (linked) {
      setTopLeft(value);
      setTopRight(value);
      setBottomRight(value);
      setBottomLeft(value);
    } else {
      if (corner === 'tl') setTopLeft(value);
      if (corner === 'tr') setTopRight(value);
      if (corner === 'br') setBottomRight(value);
      if (corner === 'bl') setBottomLeft(value);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`border-radius: ${radiusCode};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setTopLeft(12);
    setTopRight(12);
    setBottomRight(12);
    setBottomLeft(12);
    setUnit('px');
    setLinked(true);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{commonT('ui.preview')}</Label>
            <Card className="border border-border shadow-none rounded-md overflow-hidden bg-background flex items-center justify-center p-20 min-h-[400px] relative">
               <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
               <div 
                 className="w-64 h-64 bg-indigo-500 relative z-10 transition-all duration-300 shadow-xl"
                 style={{ borderRadius: radiusCode }}
               >
                 <div className="absolute inset-0 flex items-center justify-center text-white/20 font-bold text-4xl select-none">
                    RADIUS
                 </div>
               </div>
            </Card>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-muted/20 p-4 font-mono text-xs overflow-x-auto whitespace-pre">
               border-radius: {radiusCode};
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
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => { setTopLeft(50); setTopRight(50); setBottomRight(50); setBottomLeft(50); setUnit('%'); setLinked(true); }} 
                    className="h-6 px-1.5 text-[10px] w-auto gap-1"
                    title="Circle"
                  >
                    <Globe className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => { setTopLeft(50); setTopRight(0); setBottomRight(50); setBottomLeft(0); setUnit('%'); setLinked(false); }} 
                    className="h-6 px-1.5 text-[10px] w-auto gap-1"
                    title="Leaf"
                  >
                    <Zap className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={reset} className="h-6 w-6 text-muted-foreground hover:text-foreground">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('all_corners')}</Label>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setLinked(!linked)} 
                    className="h-6 w-6"
                  >
                    {linked ? <LinkIcon className="h-3 w-3" /> : <Unlink className="h-3 w-3 text-muted-foreground" />}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('unit')}</Label>
                  <Tabs value={unit} onValueChange={(v) => setUnit(v as any)}>
                    <TabsList className="grid grid-cols-2 h-8">
                      <TabsTrigger value="px" className="text-[10px]">PX</TabsTrigger>
                      <TabsTrigger value="%" className="text-[10px]">%</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {linked ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('radius')}</Label>
                      <span className="text-[10px] font-mono text-foreground">{topLeft}{unit}</span>
                    </div>
                    <Slider 
                      value={[topLeft]} 
                      onValueChange={(v) => updateRadius(Array.isArray(v) ? v[0] : v)} 
                      max={unit === 'px' ? 200 : 50} 
                      step={1} 
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] text-muted-foreground">{t('top_left')}</Label>
                        <span className="text-[10px] font-mono">{topLeft}{unit}</span>
                      </div>
                      <Slider value={[topLeft]} onValueChange={(v) => updateRadius(Array.isArray(v) ? v[0] : v, 'tl')} max={unit === 'px' ? 200 : 50} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] text-muted-foreground">{t('top_right')}</Label>
                        <span className="text-[10px] font-mono">{topRight}{unit}</span>
                      </div>
                      <Slider value={[topRight]} onValueChange={(v) => updateRadius(Array.isArray(v) ? v[0] : v, 'tr')} max={unit === 'px' ? 200 : 50} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] text-muted-foreground">{t('bottom_right')}</Label>
                        <span className="text-[10px] font-mono">{bottomRight}{unit}</span>
                      </div>
                      <Slider value={[bottomRight]} onValueChange={(v) => updateRadius(Array.isArray(v) ? v[0] : v, 'br')} max={unit === 'px' ? 200 : 50} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] text-muted-foreground">{t('bottom_left')}</Label>
                        <span className="text-[10px] font-mono">{bottomLeft}{unit}</span>
                      </div>
                      <Slider value={[bottomLeft]} onValueChange={(v) => updateRadius(Array.isArray(v) ? v[0] : v, 'bl')} max={unit === 'px' ? 200 : 50} />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  {t('sidebar_desc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="border-radius-generator" />
    </div>
  );
}
