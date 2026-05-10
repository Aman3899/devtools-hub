"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Settings2, Info, RefreshCw, Play, Square } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function AnimationBuilderClient() {
  const t = useTranslations('tools.animation-builder');
  const commonT = useTranslations('common');

  const [name, setName] = useState('myAnimation');
  const [duration, setDuration] = useState(2);
  const [timing, setTiming] = useState('ease-in-out');
  const [delay, setDelay] = useState(0);
  const [iteration, setIteration] = useState('infinite');
  const [direction, setDirection] = useState('alternate');
  const [copied, setCopied] = useState(false);

  // Keyframe properties
  const [rotateStart, setRotateStart] = useState(0);
  const [rotateEnd, setRotateEnd] = useState(360);
  const [scaleStart, setScaleStart] = useState(1);
  const [scaleEnd, setScaleEnd] = useState(1.2);
  const [opacityStart, setOpacityStart] = useState(1);
  const [opacityEnd, setOpacityEnd] = useState(0.5);

  const keyframesCode = `@keyframes ${name} {
  0% {
    transform: rotate(${rotateStart}deg) scale(${scaleStart});
    opacity: ${opacityStart};
  }
  100% {
    transform: rotate(${rotateEnd}deg) scale(${scaleEnd});
    opacity: ${opacityEnd};
  }
}`;

  const animationCode = `animation: ${name} ${duration}s ${timing} ${delay}s ${iteration} ${direction};`;

  const fullCode = `${keyframesCode}\n\n.animated-element {\n  ${animationCode}\n}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setName('myAnimation');
    setDuration(2);
    setTiming('ease-in-out');
    setDelay(0);
    setIteration('infinite');
    setDirection('alternate');
    setRotateStart(0);
    setRotateEnd(360);
    setScaleStart(1);
    setScaleEnd(1.2);
    setOpacityStart(1);
    setOpacityEnd(0.5);
  };

  return (
    <div className="space-y-12">
      <style dangerouslySetInnerHTML={{ __html: keyframesCode }} />
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{commonT('ui.preview')}</Label>
            <Card className="border border-border shadow-none rounded-md overflow-hidden min-h-[400px] flex items-center justify-center relative p-20 bg-background">
               <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
               <div 
                 className="w-32 h-32 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300"
                 style={{ 
                    animation: `${name} ${duration}s ${timing} ${delay}s ${iteration} ${direction}`
                 }}
               >
                 <Play className="h-12 w-12 text-white/50 fill-white/10" />
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
               {fullCode}
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
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('name')}</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs font-mono" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('duration')}</Label>
                    <span className="text-[10px] font-mono">{duration}s</span>
                  </div>
                  <Slider value={[duration]} onValueChange={(v) => setDuration(Array.isArray(v) ? v[0] : v)} max={10} min={0.1} step={0.1} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('timing')}</Label>
                  <Select value={timing} onValueChange={setTiming}>
                    <SelectTrigger className="h-8 text-[11px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear" className="text-[11px]">linear</SelectItem>
                      <SelectItem value="ease" className="text-[11px]">ease</SelectItem>
                      <SelectItem value="ease-in" className="text-[11px]">ease-in</SelectItem>
                      <SelectItem value="ease-out" className="text-[11px]">ease-out</SelectItem>
                      <SelectItem value="ease-in-out" className="text-[11px]">ease-in-out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t('keyframes')}</Label>
                  
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] text-muted-foreground">{t('rotate')}</Label>
                        <span className="text-[10px] font-mono">{rotateEnd}deg</span>
                      </div>
                      <Slider value={[rotateEnd]} onValueChange={(v) => setRotateEnd(Array.isArray(v) ? v[0] : v)} max={360} min={-360} step={1} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] text-muted-foreground">{t('scale')}</Label>
                        <span className="text-[10px] font-mono">{scaleEnd}x</span>
                      </div>
                      <Slider value={[scaleEnd * 10]} onValueChange={(v) => setScaleEnd((Array.isArray(v) ? v[0] : v) / 10)} max={30} min={1} step={1} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] text-muted-foreground">{t('opacity')}</Label>
                        <span className="text-[10px] font-mono">{Math.round(opacityEnd * 100)}%</span>
                      </div>
                      <Slider value={[opacityEnd * 100]} onValueChange={(v) => setOpacityEnd((Array.isArray(v) ? v[0] : v) / 100)} max={100} min={0} step={1} />
                    </div>
                  </div>
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
      <ToolNavigation currentToolId="animation-builder" />
    </div>
  );
}
