'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings2, Info, Copy, RefreshCw, Check, Trash2, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function HtmlColorToHexClient() {
  const t = useTranslations('tools.html-color-to-hex');
  const commonT = useTranslations('common');
  
  const [input, setInput] = useState('');
  const [hexOutput, setHexOutput] = useState('');
  const [rgbOutput, setRgbOutput] = useState('');
  const [hslOutput, setHslOutput] = useState('');
  const [error, setError] = useState('');
  const [copiedStates, setCopiedStates] = useState({ hex: false, rgb: false, hsl: false });

  const processColor = useCallback((colorStr: string) => {
    if (!colorStr.trim()) {
      setHexOutput('');
      setRgbOutput('');
      setHslOutput('');
      setError('');
      return;
    }

    try {
      // Use a hidden canvas to let the browser parse the color for us natively!
      const ctx = document.createElement('canvas').getContext('2d');
      if (!ctx) return;
      
      ctx.fillStyle = ''; // Reset
      ctx.fillStyle = colorStr;
      
      // If fillStyle remains empty or didn't change, it's an invalid color format
      if (ctx.fillStyle === '#000000' && colorStr.toLowerCase() !== 'black' && colorStr !== '#000000' && colorStr !== '#000' && colorStr.replace(/\s/g,'').toLowerCase() !== 'rgb(0,0,0)' && colorStr.replace(/\s/g,'').toLowerCase() !== 'rgba(0,0,0,1)') {
        // There's a quirk where invalid colors might just default to #000000, but we can check if it actually accepted it by reading it back
        const testCtx = document.createElement('canvas').getContext('2d');
        if (testCtx) {
          testCtx.fillStyle = '#ffffff';
          testCtx.fillStyle = colorStr;
          if (testCtx.fillStyle === '#ffffff') {
            throw new Error('Invalid color');
          }
        }
      }

      const hex = ctx.fillStyle; // Will always be returned as #RRGGBB or #RRGGBBAA by browser
      
      // Parse RGB/HSL for output
      // Quick way to get exact values: render 1px and read pixel data
      ctx.fillRect(0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      const r = data[0], g = data[1], b = data[2], a = data[3] / 255;
      
      const rgbStr = a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
      
      // Calculate HSL
      const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
      const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
          case gNorm: h = (bNorm - rNorm) / d + 2; break;
          case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h /= 6;
      }
      
      const hslStr = a === 1 
        ? `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)` 
        : `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${a.toFixed(2)})`;

      setHexOutput(hex);
      setRgbOutput(rgbStr);
      setHslOutput(hslStr);
      setError('');
    } catch (err) {
      setHexOutput('');
      setRgbOutput('');
      setHslOutput('');
      setError(t('invalid_color'));
    }
  }, [t]);

  const copyToClipboard = (type: 'hex' | 'rgb' | 'hsl', text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [type]: false })), 2000);
    toast.success(commonT('copied'));
  };

  const loadSample = () => {
    const samples = ['goldenrod', 'rgb(75, 192, 192)', '#e06c75', 'hsl(280, 100%, 50%)'];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setInput(randomSample);
    processColor(randomSample);
    toast.success(commonT('success'));
  };

  const clear = () => {
    setInput('');
    setHexOutput('');
    setRgbOutput('');
    setHslOutput('');
    setError('');
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('color_input')}</Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {commonT('ui.sample')}
                </Button>
                <Button variant="ghost" size="icon" onClick={clear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Card className="flex flex-col border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors p-4">
              <div className="flex items-center gap-4">
                <div 
                  className="h-12 w-12 rounded-md border border-border shadow-inner shrink-0 transition-colors"
                  style={{ backgroundColor: hexOutput || 'transparent' }}
                />
                <Input
                  placeholder="e.g., cornflowerblue, rgb(100, 149, 237), or #6495ED..."
                  className="font-mono text-sm h-12"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); processColor(e.target.value); }}
                />
              </div>
              {error && <p className="text-xs text-destructive mt-3 px-1">{error}</p>}
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-4">
            {/* Hex */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">HEX</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard('hex', hexOutput)} disabled={!hexOutput} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  {copiedStates.hex ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <Card className="flex flex-col h-[100px] border border-border shadow-none rounded-md bg-muted/20 items-center justify-center p-4">
                <span className="font-mono text-sm text-foreground">{hexOutput || '-'}</span>
              </Card>
            </div>
            
            {/* RGB */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">RGB</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard('rgb', rgbOutput)} disabled={!rgbOutput} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  {copiedStates.rgb ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <Card className="flex flex-col h-[100px] border border-border shadow-none rounded-md bg-muted/20 items-center justify-center p-4 text-center">
                <span className="font-mono text-xs text-foreground break-all">{rgbOutput || '-'}</span>
              </Card>
            </div>

            {/* HSL */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">HSL</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard('hsl', hslOutput)} disabled={!hslOutput} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  {copiedStates.hsl ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <Card className="flex flex-col h-[100px] border border-border shadow-none rounded-md bg-muted/20 items-center justify-center p-4 text-center">
                <span className="font-mono text-xs text-foreground break-all">{hslOutput || '-'}</span>
              </Card>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {commonT('ui.customization')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Palette className="h-3 w-3" />
                  Info
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('info')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="html-color-to-hex" />
    </div>
  );
}
