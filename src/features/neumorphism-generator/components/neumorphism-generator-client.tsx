"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Settings2, Info, RefreshCw, Zap, Box } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function NeumorphismGeneratorClient() {
  const t = useTranslations('tools.neumorphism-generator');
  const commonT = useTranslations('common');

  const [size, setSize] = useState(150);
  const [radius, setRadius] = useState(30);
  const [distance, setDistance] = useState(20);
  const [intensity, setIntensity] = useState(0.15);
  const [blur, setBlur] = useState(40);
  const [color, setColor] = useState('#e0e0e0');
  const [shape, setShape] = useState('flat');
  const [copied, setCopied] = useState(false);

  const getShadows = () => {
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const { r, g, b } = hexToRgb(color);
    
    // Light shadow
    const lr = Math.min(255, r + 20);
    const lg = Math.min(255, g + 20);
    const lb = Math.min(255, b + 20);
    
    // Dark shadow
    const dr = Math.max(0, r - 20);
    const dg = Math.max(0, g - 20);
    const db = Math.max(0, b - 20);

    const lightShadow = `${-distance}px ${-distance}px ${blur}px rgba(${lr}, ${lg}, ${lb}, 1)`;
    const darkShadow = `${distance}px ${distance}px ${blur}px rgba(${dr}, ${dg}, ${db}, ${intensity})`;

    return `${lightShadow}, ${darkShadow}`;
  };

  const neumorphicStyle = {
    backgroundColor: color,
    borderRadius: `${radius}px`,
    boxShadow: getShadows(),
    width: `${size}px`,
    height: `${size}px`,
  };

  const cssCode = `background: ${color};
border-radius: ${radius}px;
box-shadow: ${getShadows()};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applySample = (s: string) => {
    setShape(s);
  };

  const reset = () => {
    setSize(150);
    setRadius(30);
    setDistance(20);
    setIntensity(0.15);
    setBlur(40);
    setColor('#e0e0e0');
    setShape('flat');
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{commonT('ui.preview')}</Label>
            <Card 
              className="border border-border shadow-none rounded-md overflow-hidden min-h-[400px] relative p-20 flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: color }}
            >
               <div 
                 className="transition-all duration-300 flex items-center justify-center text-muted-foreground/20"
                 style={neumorphicStyle}
               >
                  <Box className="h-12 w-12" />
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
                    onClick={() => applySample('pressed')} 
                    className="h-6 px-1.5 text-[10px] w-auto"
                    title="Pressed Effect"
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

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('size')}</Label>
                    <span className="text-[10px] font-mono">{size}px</span>
                  </div>
                  <Slider value={[size]} onValueChange={(v) => setSize(Array.isArray(v) ? v[0] : v)} min={50} max={300} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('radius')}</Label>
                    <span className="text-[10px] font-mono">{radius}px</span>
                  </div>
                  <Slider value={[radius]} onValueChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)} max={150} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('distance')}</Label>
                    <span className="text-[10px] font-mono">{distance}px</span>
                  </div>
                  <Slider value={[distance]} onValueChange={(v) => setDistance(Array.isArray(v) ? v[0] : v)} max={50} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('blur')}</Label>
                    <span className="text-[10px] font-mono">{blur}px</span>
                  </div>
                  <Slider value={[blur]} onValueChange={(v) => setBlur(Array.isArray(v) ? v[0] : v)} max={100} step={1} />
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
      <ToolNavigation currentToolId="neumorphism-generator" />
    </div>
  );
}
