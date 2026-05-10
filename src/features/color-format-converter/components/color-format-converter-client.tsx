"use client"

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Settings2, Info, RefreshCw, Palette } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function ColorFormatConverterClient() {
  const t = useTranslations('tools.color-format-converter');
  const commonT = useTranslations('common');

  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [hsl, setHsl] = useState('hsl(239, 84%, 67%)');
  const [cmyk, setCmyk] = useState('cmyk(59%, 58%, 0%, 5%)');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const updateFromHex = (value: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(value)) return;
    setHex(value);
    
    const r = parseInt(value.slice(1, 3), 16);
    const g = parseInt(value.slice(3, 5), 16);
    const b = parseInt(value.slice(5, 7), 16);
    setRgb(`rgb(${r}, ${g}, ${b})`);

    // HSL
    let r_norm = r / 255, g_norm = g / 255, b_norm = b / 255;
    let max = Math.max(r_norm, g_norm, b_norm), min = Math.min(r_norm, g_norm, b_norm);
    let h = 0, s, l = (max + min) / 2;
    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r_norm) h = (g_norm - b_norm) / d + (g_norm < b_norm ? 6 : 0);
      else if (max === g_norm) h = (b_norm - r_norm) / d + 2;
      else h = (r_norm - g_norm) / d + 4;
      h /= 6;
    } else {
      s = 0;
    }
    setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);

    // CMYK
    let k = 1 - Math.max(r_norm, g_norm, b_norm);
    let c = (1 - r_norm - k) / (1 - k) || 0;
    let m = (1 - g_norm - k) / (1 - k) || 0;
    let y = (1 - b_norm - k) / (1 - k) || 0;
    setCmyk(`cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`);
  };

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const reset = () => updateFromHex('#6366f1');

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{commonT('ui.preview')}</Label>
            <Card className="border border-border shadow-none rounded-md overflow-hidden min-h-[300px] flex items-center justify-center bg-background relative">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
               <div 
                 className="w-48 h-48 rounded-full shadow-2xl transition-colors duration-300 flex items-center justify-center text-[10px] font-mono text-white/50 border-8 border-background"
                 style={{ backgroundColor: hex }}
               >
                 {hex}
               </div>
            </Card>
          </div>

          {/* Form Area */}
          <div className="grid gap-4 sm:grid-cols-2">
             {[
               { label: 'HEX', value: hex, field: 'hex' },
               { label: 'RGB', value: rgb, field: 'rgb' },
               { label: 'HSL', value: hsl, field: 'hsl' },
               { label: 'CMYK', value: cmyk, field: 'cmyk' }
             ].map((item) => (
               <div key={item.field} className="space-y-2">
                 <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{item.label}</Label>
                 <div className="relative group">
                    <Input 
                      value={item.value} 
                      readOnly 
                      className="h-10 pr-10 font-mono text-xs bg-muted/20 border-border"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copyToClipboard(item.value, item.field)}
                      className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      {copiedField === item.field ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                 </div>
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
                <Button variant="ghost" size="icon" onClick={reset} className="h-6 w-6 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('pick_color')}</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={hex} 
                      onChange={(e) => updateFromHex(e.target.value)}
                      className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
                    />
                    <Input 
                      type="text" 
                      value={hex} 
                      onChange={(e) => updateFromHex(e.target.value)}
                      className="h-8 text-xs font-mono uppercase"
                    />
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
      <ToolNavigation currentToolId="color-format-converter" />
    </div>
  );
}
