"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Settings2, Info, RefreshCw, Zap, Play, Square } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function AnimationBuilderClient() {
  const t = useTranslations('tools.animation-builder');
  const commonT = useTranslations('common');

  const [duration, setDuration] = useState(2);
  const [timing, setTiming] = useState('ease-in-out');
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [animationName, setAnimationName] = useState('custom-animation');
  const [copied, setCopied] = useState(false);

  const keyframesCode = useMemo(() => {
    return `@keyframes ${animationName} {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: rotate(${rotate}deg) scale(${scale});
    opacity: ${opacity};
  }
}`;
  }, [animationName, rotate, scale, opacity]);

  const animationStyle = {
    animationName: animationName,
    animationDuration: `${duration}s`,
    animationTimingFunction: timing,
    animationIterationCount: 'infinite',
  };

  const cssCode = `${keyframesCode}

.animated-element {
  animation: ${animationName} ${duration}s ${timing} infinite;
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (r: number, s: number, o: number, t: string) => {
    setRotate(r);
    setScale(s);
    setOpacity(o);
    setTiming(t);
  };

  const reset = () => {
    setDuration(2);
    setTiming('ease-in-out');
    setRotate(0);
    setScale(1);
    setOpacity(1);
  };

  return (
    <div className="space-y-12">
      {/* Dynamic Keyframes Injection */}
      <style>{keyframesCode}</style>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{commonT('ui.preview')}</Label>
            <Card className="border border-border shadow-none rounded-md overflow-hidden bg-background min-h-[400px] relative p-20 flex items-center justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
               <div 
                 className="w-32 h-32 bg-primary rounded-2xl shadow-xl flex items-center justify-center relative z-10"
                 style={animationStyle}
               >
                  <Play className="h-10 w-10 text-primary-foreground fill-current" />
               </div>
            </Card>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-muted/20 p-4 font-mono text-xs overflow-x-auto whitespace-pre">
               {cssCode}
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
                    onClick={() => applyPreset(360, 0, 0, 'ease-in')} 
                    className="h-6 px-1.5 text-[10px] w-auto gap-1"
                    title="Spin & Fade"
                  >
                    <Zap className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => applyPreset(0, 1.5, 0.5, 'cubic-bezier(0.68, -0.55, 0.265, 1.55)')} 
                    className="h-6 px-1.5 text-[10px] w-auto gap-1"
                    title="Pulse"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('duration')}</Label>
                    <span className="text-[10px] font-mono">{duration}s</span>
                  </div>
                  <Slider value={[duration]} onValueChange={(v) => setDuration(Array.isArray(v) ? v[0] : v)} min={0.1} max={10} step={0.1} />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('timing')}</Label>
                  <Select value={timing} onValueChange={(v) => setTiming(v || 'ease-in-out')}>
                    <SelectTrigger className="h-8 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear" className="text-[11px]">linear</SelectItem>
                      <SelectItem value="ease" className="text-[11px]">ease</SelectItem>
                      <SelectItem value="ease-in" className="text-[11px]">ease-in</SelectItem>
                      <SelectItem value="ease-out" className="text-[11px]">ease-out</SelectItem>
                      <SelectItem value="ease-in-out" className="text-[11px]">ease-in-out</SelectItem>
                      <SelectItem value="step-start" className="text-[11px]">step-start</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Label className="text-[10px] font-bold text-foreground uppercase tracking-wider">{t('keyframes')}</Label>
                  
                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('rotate')}</Label>
                        <span className="text-[10px] font-mono">{rotate}°</span>
                      </div>
                      <Slider value={[rotate]} onValueChange={(v) => setRotate(Array.isArray(v) ? v[0] : v)} min={-360} max={360} step={1} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('scale')}</Label>
                        <span className="text-[10px] font-mono">{scale}x</span>
                      </div>
                      <Slider value={[scale]} onValueChange={(v) => setScale(Array.isArray(v) ? v[0] : v)} min={0} max={3} step={0.1} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('opacity')}</Label>
                        <span className="text-[10px] font-mono">{Math.round(opacity * 100)}%</span>
                      </div>
                      <Slider value={[opacity]} onValueChange={(v) => setOpacity(Array.isArray(v) ? v[0] : v)} min={0} max={1} step={0.01} />
                    </div>
                  </div>
                </div>
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
      <ToolNavigation currentToolId="animation-builder" />
    </div>
  );
}
