'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, RefreshCw, Palette, Settings2, Plus, Trash2, MoveHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

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

  const getGradientString = () => {
    const stopString = stops
      .sort((a, b) => a.position - b.position)
      .map(s => `${s.color} ${s.position}%`)
      .join(', ');
    
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${stopString})`;
    }
    return `radial-gradient(circle, ${stopString})`;
  };

  const gradient = getGradientString();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`background: ${gradient};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    (newStops[index] as any)[field] = value;
    setStops(newStops);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-8">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{tCommon('ui.preview')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div 
              className="h-64 rounded-[2rem] shadow-2xl transition-all duration-500" 
              style={{ background: gradient }}
            />
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">CSS Code</CardTitle>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="rounded-xl gap-2 h-8">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {tCommon('copy')}
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <pre className="p-4 rounded-2xl bg-muted/30 font-mono text-xs overflow-auto border border-muted-foreground/5 whitespace-pre-wrap break-all leading-relaxed">
              background: {gradient};
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              {tCommon('ui.settings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground px-1">Gradient Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="rounded-xl bg-muted/30 border-muted-foreground/10 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === 'linear' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Angle</Label>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{angle}°</span>
                </div>
                <Slider 
                  value={[angle]} 
                  onValueChange={([v]) => setAngle(v)} 
                  max={360} 
                  min={0} 
                  step={1}
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Color Stops</Label>
                <Button variant="ghost" size="icon" onClick={addStop} disabled={stops.length >= 5} className="h-6 w-6 rounded-lg hover:bg-primary/5">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {stops.map((stop, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted/30 p-2 rounded-xl border border-muted-foreground/5">
                    <Input 
                      type="color" 
                      value={stop.color} 
                      onChange={(e) => updateStop(i, 'color', e.target.value)}
                      className="w-8 h-8 p-0 rounded-lg border-none bg-transparent cursor-pointer"
                    />
                    <div className="flex-1 space-y-1">
                      <Slider 
                        value={[stop.position]} 
                        onValueChange={([v]) => updateStop(i, 'position', v)} 
                        max={100} 
                        min={0}
                      />
                    </div>
                    {stops.length > 2 && (
                      <Button variant="ghost" size="icon" onClick={() => removeStop(i)} className="h-8 w-8 rounded-lg">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
