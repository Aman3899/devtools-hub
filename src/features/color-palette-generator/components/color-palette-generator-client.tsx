'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, Check, RefreshCw, Palette, Settings2, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function ColorPaletteGeneratorClient() {
  const t = useTranslations('tools.color-palette-generator');
  const tCommon = useTranslations('common');
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [harmony, setHarmony] = useState('analogous');
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePalette = () => {
    // Basic color math for harmonies
    const hexToHsl = (hex: string) => {
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;
      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s, l = (max + min) / 2;
      if (max === min) h = s = 0;
      else {
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

    const [h, s, l] = hexToHsl(baseColor);
    let colors = [baseColor];

    switch (harmony) {
      case 'analogous':
        colors = [
          hslToHex((h + 330) % 360, s, l),
          hslToHex((h + 345) % 360, s, l),
          baseColor,
          hslToHex((h + 15) % 360, s, l),
          hslToHex((h + 30) % 360, s, l),
        ];
        break;
      case 'monochromatic':
        colors = [
          hslToHex(h, s, Math.max(0, l - 30)),
          hslToHex(h, s, Math.max(0, l - 15)),
          baseColor,
          hslToHex(h, s, Math.min(100, l + 15)),
          hslToHex(h, s, Math.min(100, l + 30)),
        ];
        break;
      case 'complementary':
        colors = [
          baseColor,
          hslToHex((h + 180) % 360, s, l),
        ];
        break;
      case 'triadic':
        colors = [
          baseColor,
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, l),
        ];
        break;
    }
    setPalette(colors);
  };

  useEffect(() => {
    generatePalette();
  }, [baseColor, harmony]);

  const copyToClipboard = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('generatedPalette')}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setBaseColor('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'))} className="rounded-xl">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex h-64 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5">
              {palette.map((color, i) => (
                <div 
                  key={i} 
                  className="group flex-1 relative flex items-end justify-center pb-6 transition-all hover:flex-[1.5] cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color, i)}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white text-[10px] font-bold">
                    {copiedIndex === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {color.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {palette.map((color, i) => (
            <Card key={i} className="rounded-2xl border-muted-foreground/10 bg-card/50 backdrop-blur-sm overflow-hidden group">
              <div className="h-20" style={{ backgroundColor: color }} />
              <CardContent className="p-3 flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-muted-foreground">{color.toUpperCase()}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(color, i)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground px-1">{t('baseColor')}</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  value={baseColor} 
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-12 h-12 p-1 rounded-xl bg-muted/30 border-muted-foreground/10 cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={baseColor} 
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="flex-1 h-12 rounded-xl bg-muted/30 border-muted-foreground/10 font-mono text-center"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground px-1">{t('harmonyRule')}</Label>
              <Select value={harmony} onValueChange={(value) => value && setHarmony(value)}>
                <SelectTrigger className="rounded-xl bg-muted/30 border-muted-foreground/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="analogous">{t('analogous')}</SelectItem>
                  <SelectItem value="monochromatic">{t('monochromatic')}</SelectItem>
                  <SelectItem value="complementary">{t('complementary')}</SelectItem>
                  <SelectItem value="triadic">{t('triadic')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Info className="h-3 w-3" />
              {tCommon('ui.info')}
            </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t('ruleDesc')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
