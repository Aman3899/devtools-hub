"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Settings2, Info, RefreshCw, Zap, Box } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function NeumorphismGeneratorClient() {
  const t = useTranslations('tools.neumorphism-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [size, setSize] = useState(150);
  const [radius, setRadius] = useState(30);
  const [distance, setDistance] = useState(20);
  const [intensity, setIntensity] = useState(0.15);
  const [blur, setBlur] = useState(40);
  const [color, setColor] = useState('#e0e0e0');
  const [shape, setShape] = useState('flat');

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
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        {/* Preview Area */}
        <ToolCard 
          title={commonT('ui.preview')}
          contentClassName="p-0 border-none shadow-none rounded-none flex items-center justify-center relative overflow-hidden"
          className="overflow-hidden"
        >
          <div 
            className="w-full h-full min-h-[400px] flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: color }}
          >
            <div 
              className="transition-all duration-300 flex items-center justify-center text-muted-foreground/20"
              style={neumorphicStyle}
            >
              <Box className="h-12 w-12" />
            </div>
          </div>
        </ToolCard>

        {/* Result Area */}
        <ToolCard 
          title={commonT('ui.result')}
          action={
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(cssCode, 'css')} className="h-6 px-2 text-[10px] gap-1.5 transition-colors">
              {copiedType === 'css' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {commonT('copy')}
            </Button>
          }
          contentClassName="p-4 font-mono text-xs overflow-x-auto whitespace-pre bg-muted/20 min-h-[400px]"
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
          }
          contentClassName="p-4 space-y-6"
        >
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
            <p className="text-[10px] text-muted-foreground leading-normal">{t('sidebar_desc')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
