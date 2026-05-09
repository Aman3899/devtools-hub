"use client"

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, RefreshCw, Palette, Settings2, Plus, Trash2, MoveHorizontal, Download, Share2, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ToolNavigation } from '@/components/tool-navigation';
import { cn } from '@/lib/utils';

interface ColorStop {
  color: string;
  position: number;
}

export function CssGradientGeneratorClient() {
  const t = useTranslations('tools.css-gradient-generator');
  const tCommon = useTranslations('common');
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#6366f1', position: 0 },
    { color: '#a855f7', position: 100 }
  ]);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const gradient = useMemo(() => {
    const stopString = [...stops]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map(s => `${s.color} ${s.position ?? 0}%`)
      .join(', ');
    
    if (type === 'linear') {
      return `linear-gradient(${angle ?? 0}deg, ${stopString})`;
    }
    return `radial-gradient(circle, ${stopString})`;
  }, [stops, type, angle]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`background: ${gradient};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCss = () => {
    const content = `/* Generated with DevTools Hub */\n.gradient-preview {\n  background: ${gradient};\n}`;
    const blob = new Blob([content], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gradient-${new Date().getTime()}.css`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const addStop = () => {
    if (stops.length < 5) {
      setStops([...stops, { color: '#ffffff', position: 50 }]);
    }
  };

  const removeStop = (index: number) => {
    if (stops.length > 2) {
      setStops(stops.filter((_, i) => i !== index));
    }
  };

  const updateStop = (index: number, field: keyof ColorStop, value: any) => {
    const newStops = [...stops];
    if (field === 'position') {
      const val = Array.isArray(value) ? value[0] : value;
      newStops[index][field] = Number(val) ?? 0;
    } else {
      (newStops[index] as any)[field] = value;
    }
    setStops(newStops);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{tCommon('ui.preview')}</Label>
            <Card className="border border-border shadow-none rounded-md overflow-hidden bg-background">
              <div 
                className="h-64 md:h-80 transition-all duration-300" 
                style={{ background: gradient }}
              />
            </Card>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('output')}</Label>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={downloadCss} 
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                  {tCommon('hero.searchPlaceholder' as any) === 'Find a tool...' ? 'Download' : 'ڈاؤن لوڈ'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard} 
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {tCommon('copy')}
                </Button>
              </div>
            </div>
            <Card className="border border-border shadow-none rounded-md overflow-hidden bg-muted/20 p-4">
              <code className="block font-mono text-xs whitespace-pre-wrap break-all leading-relaxed text-foreground">
                background: {gradient};
              </code>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {tCommon('ui.settings')}
                </div>
                <Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('type')}</Label>
                <Select value={type} onValueChange={(v) => v && setType(v)}>
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear" className="text-xs">{t('linear')}</SelectItem>
                    <SelectItem value="radial" className="text-xs">{t('radial')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {type === 'linear' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('angle')}</Label>
                    <span className="text-[10px] font-bold font-mono text-foreground">{angle}°</span>
                  </div>
                  <Slider 
                    value={[angle]} 
                    onValueChange={(v) => {
                      const val = Array.isArray(v) ? v[0] : v;
                      setAngle(Number(val) ?? 0);
                    }} 
                    max={360} 
                    min={0} 
                    step={1}
                    className="py-1"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('colorStops')}</Label>
                  <Button variant="ghost" size="icon" onClick={addStop} disabled={stops.length >= 5} className="h-5 w-5 hover:text-foreground">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {stops.map((stop, i) => (
                    <div key={i} className="flex items-center gap-3 bg-muted/30 p-2 rounded border border-border">
                      <Input 
                        type="color" 
                        value={stop.color} 
                        onChange={(e) => updateStop(i, 'color', e.target.value)}
                        className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer"
                      />
                      <div className="flex-1">
                        <Slider 
                          value={[stop.position]} 
                          onValueChange={(v) => {
                            const val = Array.isArray(v) ? v[0] : v;
                            updateStop(i, 'position', val);
                          }} 
                          max={100} 
                          min={0}
                          className="py-1"
                        />
                      </div>
                      <div className="w-8 text-[10px] font-mono text-right text-muted-foreground">{stop.position}%</div>
                      {stops.length > 2 && (
                        <Button variant="ghost" size="icon" onClick={() => removeStop(i)} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {tCommon('ui.info')}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('tip')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ToolNavigation currentToolId="css-gradient-generator" />
    </div>
  );
}
