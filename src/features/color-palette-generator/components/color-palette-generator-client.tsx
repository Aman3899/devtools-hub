"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, Check, RefreshCw, Palette, Settings2, Info, Download, Share2, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { ToolNavigation } from '@/components/tool-navigation';

export function ColorPaletteGeneratorClient() {
  const t = useTranslations('tools.color-palette-generator');
  const tCommon = useTranslations('common');
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [harmony, setHarmony] = useState('analogous');
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const isEnglish = tCommon('hero.searchPlaceholder' as any) === 'Find a tool...';

  const generatePalette = useCallback(() => {
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
  }, [baseColor, harmony]);

  useEffect(() => {
    generatePalette();
  }, [generatePalette]);

  const copyToClipboard = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadPalette = () => {
    const content = JSON.stringify({
      baseColor,
      harmony,
      palette,
      css: palette.map((c, i) => `--color-${i + 1}: ${c};`).join('\n')
    }, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const randomize = () => {
    setBaseColor('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('generatedPalette')}</Label>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={downloadPalette} 
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                  {isEnglish ? 'Download' : 'ڈاؤن لوڈ'}
                </Button>
                <Button variant="ghost" size="icon" onClick={randomize} title={isEnglish ? 'Randomize' : 'بے ترتیب'} className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Card className="border border-border shadow-none rounded-md overflow-hidden bg-background">
              <div className="flex h-32 md:h-48">
                {palette.map((color, i) => (
                  <div 
                    key={i} 
                    className="group flex-1 relative flex items-center justify-center transition-all hover:flex-[1.5] cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color, i)}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-white text-[10px] font-mono font-bold border border-white/10">
                      {copiedIndex === i ? (isEnglish ? 'Copied!' : 'کاپی ہو گیا!') : color.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {palette.map((color, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Card className="p-3 border border-border shadow-none rounded-md bg-background group relative overflow-hidden">
                  <div className="h-16 rounded border border-border mb-3" style={{ backgroundColor: color }} />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-foreground">{color.toUpperCase()}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded text-muted-foreground hover:text-foreground" 
                      onClick={() => copyToClipboard(color, i)}
                    >
                      {copiedIndex === i ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {isEnglish ? 'Settings' : 'سیٹنگز'}
                </div>
                <Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('baseColor')}</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={baseColor} 
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-10 h-10 p-1 rounded border-border cursor-pointer bg-muted/30"
                  />
                  <Input 
                    type="text" 
                    value={baseColor} 
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="flex-1 h-10 rounded border-border font-mono text-xs text-center bg-muted/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('harmonyRule')}</Label>
                <Select value={harmony} onValueChange={(value) => value && setHarmony(value)}>
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analogous" className="text-xs">{t('analogous')}</SelectItem>
                    <SelectItem value="monochromatic" className="text-xs">{t('monochromatic')}</SelectItem>
                    <SelectItem value="complementary" className="text-xs">{t('complementary')}</SelectItem>
                    <SelectItem value="triadic" className="text-xs">{t('triadic')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {isEnglish ? 'Info' : 'معلومات'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('ruleDesc')}
                </p>
              </div>

              <Button onClick={randomize} className="w-full h-8 gap-2 text-xs">
                <RefreshCw className="h-3.5 w-3.5" />
                {isEnglish ? 'Random Base' : 'بے ترتیب بنیاد'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ToolNavigation currentToolId="color-palette-generator" />
    </div>
  );
}
