"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Settings2, Info, RefreshCw, Zap, Image as ImageIcon } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function GlassmorphismGeneratorClient() {
  const t = useTranslations('tools.glassmorphism-generator');
  const commonT = useTranslations('common');

  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(0.2);
  const [color, setColor] = useState('#ffffff');
  const [borderOpacity, setBorderOpacity] = useState(0.1);
  const [radius, setRadius] = useState(16);
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  const glassStyle = {
    background: `rgba(${hexToRgb(color)}, ${transparency})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    borderRadius: `${radius}px`,
    border: `1px solid rgba(${hexToRgb(color)}, ${borderOpacity})`,
  };

  const cssCode = `background: rgba(${hexToRgb(color)}, ${transparency});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${radius}px;
border: 1px solid rgba(${hexToRgb(color)}, ${borderOpacity});`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applySample = (b: number, t: number, bo: number) => {
    setBlur(b);
    setTransparency(t);
    setBorderOpacity(bo);
  };

  const reset = () => {
    setBlur(10);
    setTransparency(0.2);
    setColor('#ffffff');
    setBorderOpacity(0.1);
    setRadius(16);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{commonT('ui.preview')}</Label>
            <Card className="border border-border shadow-none rounded-md overflow-hidden bg-background min-h-[400px] relative p-20 flex items-center justify-center">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
               <div 
                 className="w-full max-w-md h-64 shadow-2xl relative z-10 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center gap-4"
                 style={glassStyle}
               >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight">Glassmorphism</h3>
                    <p className="text-white/60 text-xs">Frosted glass effect using CSS</p>
                  </div>
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
                    onClick={() => applySample(20, 0.1, 0.05)} 
                    className="h-6 px-1.5 text-[10px] w-auto"
                    title="Soft Glass"
                  >
                    <Zap className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={reset} className="h-6 w-6 text-muted-foreground">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('blur')}</Label>
                    <span className="text-[10px] font-mono">{blur}px</span>
                  </div>
                  <Slider value={[blur]} onValueChange={(v) => setBlur(Array.isArray(v) ? v[0] : v)} max={50} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('transparency')}</Label>
                    <span className="text-[10px] font-mono">{Math.round(transparency * 100)}%</span>
                  </div>
                  <Slider value={[transparency]} onValueChange={(v) => setTransparency(Array.isArray(v) ? v[0] : v)} min={0} max={1} step={0.01} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('border_opacity')}</Label>
                    <span className="text-[10px] font-mono">{Math.round(borderOpacity * 100)}%</span>
                  </div>
                  <Slider value={[borderOpacity]} onValueChange={(v) => setBorderOpacity(Array.isArray(v) ? v[0] : v)} min={0} max={1} step={0.01} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('radius')}</Label>
                    <span className="text-[10px] font-mono">{radius}px</span>
                  </div>
                  <Slider value={[radius]} onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)} max={100} step={1} />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('color')}</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
                    />
                    <Input 
                      type="text" 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)}
                      className="h-8 text-xs font-mono uppercase"
                    />
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
      <ToolNavigation currentToolId="glassmorphism-generator" />
    </div>
  );
}
