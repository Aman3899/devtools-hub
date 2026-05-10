"use client"

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Settings2, Info, RefreshCw, Palette } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';
import { toast } from 'sonner';

export function ColorFormatConverterClient() {
  const t = useTranslations('tools.color-format-converter');
  const commonT = useTranslations('common');

  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [hsl, setHsl] = useState('hsl(239, 84%, 67%)');
  const [cmyk, setCmyk] = useState('cmyk(59%, 58%, 0%, 5%)');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);
    return { c, m, y, k };
  };

  const updateFromHex = (value: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(value)) return;
    const { r, g, b } = hexToRgb(value);
    const { h, s, l } = rgbToHsl(r, g, b);
    const { c, m, y, k } = rgbToCmyk(r, g, b);
    
    setHex(value);
    setRgb(`rgb(${r}, ${g}, ${b})`);
    setHsl(`hsl(${h}, ${s}%, ${l}%)`);
    setCmyk(`cmyk(${c}%, ${m}%, ${y}%, ${k}%)`);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(commonT('copied'));
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Main Input Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{t('pick_color')}</Label>
            <Card className="border border-border shadow-none rounded-md overflow-hidden bg-background p-12 flex flex-col items-center justify-center gap-6">
               <div 
                 className="w-32 h-32 rounded-full shadow-2xl border-4 border-white transition-all duration-300"
                 style={{ backgroundColor: hex }}
               />
               <div className="flex gap-4 w-full max-w-sm">
                  <Input 
                    type="color" 
                    value={hex} 
                    onChange={(e) => updateFromHex(e.target.value)}
                    className="w-12 h-10 p-0 border-none bg-transparent cursor-pointer"
                  />
                  <Input 
                    type="text" 
                    value={hex} 
                    onChange={(e) => updateFromHex(e.target.value)}
                    className="h-10 text-center font-mono font-bold uppercase tracking-widest text-lg"
                  />
               </div>
            </Card>
          </div>

          {/* Formats Grid */}
          <div className="grid gap-4 md:grid-cols-2">
             {[
               { label: 'HEX', value: hex.toUpperCase(), id: 'hex' },
               { label: 'RGB', value: rgb, id: 'rgb' },
               { label: 'HSL', value: hsl, id: 'hsl' },
               { label: 'CMYK', value: cmyk, id: 'cmyk' }
             ].map((field) => (
               <div key={field.id} className="flex flex-col gap-2">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{field.label}</Label>
                  <Card className="flex items-center gap-2 p-1 pl-4 bg-background border border-border shadow-none">
                     <span className="flex-1 font-mono text-sm font-medium">{field.value}</span>
                     <Button variant="ghost" size="icon" onClick={() => copyToClipboard(field.value, field.id)} className="h-9 w-9 text-muted-foreground">
                        {copiedField === field.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                     </Button>
                  </Card>
               </div>
             ))}
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
                <RefreshCw className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => updateFromHex('#6366f1')} />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  {t('sidebar_desc')}
                </p>
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">{commonT('ui.info')}</Label>
                 <p className="text-[10px] text-muted-foreground leading-relaxed">
                   CMYK is used for print, while RGB/HEX/HSL are used for digital screens. Use HSL for intuitive color adjustments.
                 </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="color-format-converter" />
    </div>
  );
}
