"use client"

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Settings2, Info, RefreshCw, Ruler, Calculator } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';
import { toast } from 'sonner';

export function CssUnitConverterClient() {
  const t = useTranslations('tools.css-unit-converter');
  const commonT = useTranslations('common');

  const [px, setPx] = useState('16');
  const [rem, setRem] = useState('1');
  const [em, setEm] = useState('1');
  const [baseSize, setBaseSize] = useState(16);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const updateFromPx = (value: string) => {
    const num = parseFloat(value);
    setPx(value);
    if (!isNaN(num)) {
      setRem((num / baseSize).toFixed(3).replace(/\.?0+$/, ''));
      setEm((num / baseSize).toFixed(3).replace(/\.?0+$/, ''));
    }
  };

  const updateFromRem = (value: string) => {
    const num = parseFloat(value);
    setRem(value);
    if (!isNaN(num)) {
      setPx((num * baseSize).toFixed(1).replace(/\.?0+$/, ''));
      setEm(value);
    }
  };

  const copyValue = (value: string, id: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(id);
    toast.success(commonT('copied'));
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Main Converter Card */}
          <Card className="border border-border shadow-none rounded-md bg-background overflow-hidden">
             <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                {/* PX */}
                <div className="p-8 space-y-4">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded bg-blue-500/10 text-blue-500">
                         <Ruler className="h-4 w-4" />
                      </div>
                      <Label className="text-sm font-bold uppercase tracking-wider">Pixels (PX)</Label>
                   </div>
                   <div className="relative">
                      <Input 
                        type="number" 
                        value={px} 
                        onChange={(e) => updateFromPx(e.target.value)}
                        className="h-16 text-3xl font-black text-center pr-12 focus-visible:ring-blue-500/20"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => copyValue(px + 'px', 'px')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
                      >
                         {copiedField === 'px' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                   </div>
                   <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-medium">Standard Device Units</p>
                </div>

                {/* REM */}
                <div className="p-8 space-y-4">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded bg-purple-500/10 text-purple-500">
                         <Calculator className="h-4 w-4" />
                      </div>
                      <Label className="text-sm font-bold uppercase tracking-wider">Root EM (REM)</Label>
                   </div>
                   <div className="relative">
                      <Input 
                        type="number" 
                        value={rem} 
                        onChange={(e) => updateFromRem(e.target.value)}
                        className="h-16 text-3xl font-black text-center pr-12 focus-visible:ring-purple-500/20"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => copyValue(rem + 'rem', 'rem')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
                      >
                         {copiedField === 'rem' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                   </div>
                   <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-medium">Relative to HTML Root</p>
                </div>

                {/* EM */}
                <div className="p-8 space-y-4">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded bg-amber-500/10 text-amber-500">
                         <RefreshCw className="h-4 w-4" />
                      </div>
                      <Label className="text-sm font-bold uppercase tracking-wider">Relative EM (EM)</Label>
                   </div>
                   <div className="relative">
                      <Input 
                        type="number" 
                        value={em} 
                        onChange={(e) => setEm(e.target.value)}
                        className="h-16 text-3xl font-black text-center pr-12 focus-visible:ring-amber-500/20"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => copyValue(em + 'em', 'em')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
                      >
                         {copiedField === 'em' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                   </div>
                   <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-medium">Relative to Parent</p>
                </div>
             </div>
          </Card>

          {/* Quick Lookup Table */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">Common Conversions</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
               {[8, 12, 14, 16, 20, 24, 32, 48, 64].map((v) => (
                 <Card key={v} className="p-3 bg-muted/20 border border-border shadow-none flex flex-col items-center gap-1 cursor-pointer hover:border-primary/30 transition-all" onClick={() => updateFromPx(v.toString())}>
                    <span className="text-xs font-bold">{v}px</span>
                    <span className="text-[10px] text-muted-foreground">{(v / baseSize).toFixed(3).replace(/\.?0+$/, '')}rem</span>
                 </Card>
               ))}
            </div>
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
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('base_size')}</Label>
                <div className="flex gap-2">
                   <Input 
                    type="number" 
                    value={baseSize} 
                    onChange={(e) => setBaseSize(Number(e.target.value) || 16)}
                    className="h-10 text-center font-bold text-lg"
                  />
                  <div className="flex flex-col justify-center px-3 bg-muted/30 border rounded text-[10px] font-bold">PX</div>
                </div>
              </div>

              <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  {t('sidebar_desc')}
                </p>
              </div>

              <div className="space-y-2 border-t pt-4">
                 <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">{commonT('ui.info')}</Label>
                 <ul className="text-[10px] text-muted-foreground space-y-1.5 list-disc pl-4 leading-tight">
                    <li><b>PX:</b> Fixed size units.</li>
                    <li><b>REM:</b> Responsive units based on the root font size.</li>
                    <li><b>EM:</b> Relative to the current element's font size.</li>
                 </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="css-unit-converter" />
    </div>
  );
}
