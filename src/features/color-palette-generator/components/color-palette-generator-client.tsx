"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Settings2, Info, RefreshCw, Palette, Download } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

type PaletteMode = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic' | 'shades';

export function ColorPaletteGeneratorClient() {
  const t = useTranslations('tools.color-palette-generator');
  const commonT = useTranslations('common');

  const [baseColor, setBaseColor] = useState('#6366f1');
  const [mode, setMode] = useState<PaletteMode>('triadic');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const palette = useMemo(() => {
    const [h, s, l] = hexToHsl(baseColor);
    const colors: string[] = [baseColor];

    switch (mode) {
      case 'complementary':
        colors.push(hslToHex((h + 180) % 360, s, l));
        colors.push(hslToHex(h, s, Math.max(0, l - 20)));
        colors.push(hslToHex((h + 180) % 360, s, Math.max(0, l - 20)));
        colors.push(hslToHex(h, Math.max(0, s - 20), l));
        break;
      case 'analogous':
        colors.push(hslToHex((h + 30) % 360, s, l));
        colors.push(hslToHex((h + 60) % 360, s, l));
        colors.push(hslToHex((h - 30 + 360) % 360, s, l));
        colors.push(hslToHex((h - 60 + 360) % 360, s, l));
        break;
      case 'triadic':
        colors.push(hslToHex((h + 120) % 360, s, l));
        colors.push(hslToHex((h + 240) % 360, s, l));
        colors.push(hslToHex(h, s, Math.max(0, l - 15)));
        colors.push(hslToHex((h + 120) % 360, s, Math.max(0, l - 15)));
        break;
      case 'tetradic':
        colors.push(hslToHex((h + 90) % 360, s, l));
        colors.push(hslToHex((h + 180) % 360, s, l));
        colors.push(hslToHex((h + 270) % 360, s, l));
        colors.push(hslToHex(h, s, Math.max(0, l - 15)));
        break;
      case 'monochromatic':
        colors.push(hslToHex(h, s, Math.min(100, l + 20)));
        colors.push(hslToHex(h, s, Math.max(0, l - 20)));
        colors.push(hslToHex(h, Math.max(0, s - 30), l));
        colors.push(hslToHex(h, Math.min(100, s + 30), l));
        break;
      case 'shades':
        colors.push(hslToHex(h, s, Math.max(0, l - 15)));
        colors.push(hslToHex(h, s, Math.max(0, l - 30)));
        colors.push(hslToHex(h, s, Math.max(0, l - 45)));
        colors.push(hslToHex(h, s, Math.max(0, l - 60)));
        break;
    }

    return colors.slice(0, 5);
  }, [baseColor, mode]);

  const copyColor = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportAsText = () => {
    const text = palette.join('\n');
    navigator.clipboard.writeText(text);
  };

  const reset = () => {
    setBaseColor('#6366f1');
    setMode('triadic');
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{commonT('ui.preview')}</Label>
            <Card className="border border-border shadow-none rounded-md overflow-hidden min-h-[400px] flex items-stretch bg-background p-4 gap-4">
               {palette.map((color, i) => (
                 <div 
                   key={i} 
                   className="flex-1 rounded-lg flex flex-col items-center justify-end p-4 transition-all duration-300 hover:flex-[1.5] group cursor-pointer relative"
                   style={{ backgroundColor: color }}
                   onClick={() => copyColor(color, i)}
                 >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Copy className="h-6 w-6 text-white drop-shadow-md" />
                    </div>
                    <div className="bg-black/20 backdrop-blur-md p-2 rounded-md w-full text-center">
                       <p className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">{color}</p>
                       {copiedIndex === i && <span className="text-[8px] text-white/80 uppercase font-bold">{commonT('copied')}</span>}
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
                onClick={exportAsText}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="h-3 w-3" />
                {t('export')}
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-muted/20 p-4 font-mono text-xs overflow-x-auto whitespace-pre">
               {palette.join(', ')}
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
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('base_color')}</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={baseColor} 
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
                    />
                    <Input 
                      type="text" 
                      value={baseColor} 
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="h-8 text-xs font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('mode')}</Label>
                  <Select value={mode} onValueChange={(v) => setMode(v as any)}>
                    <SelectTrigger className="h-8 text-[11px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complementary" className="text-[11px]">{t('modes.complementary')}</SelectItem>
                      <SelectItem value="analogous" className="text-[11px]">{t('modes.analogous')}</SelectItem>
                      <SelectItem value="triadic" className="text-[11px]">{t('modes.triadic')}</SelectItem>
                      <SelectItem value="tetradic" className="text-[11px]">{t('modes.tetradic')}</SelectItem>
                      <SelectItem value="monochromatic" className="text-[11px]">{t('modes.monochromatic')}</SelectItem>
                      <SelectItem value="shades" className="text-[11px]">{t('modes.shades')}</SelectItem>
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
      <ToolNavigation currentToolId="color-palette-generator" />
    </div>
  );
}
