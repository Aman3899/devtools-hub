"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Settings2, Info, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function ColorContrastCheckerClient() {
  const t = useTranslations('tools.color-contrast-checker');
  const commonT = useTranslations('common');

  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#6366f1');
  const [copied, setCopied] = useState(false);

  const getLuminance = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const contrastRatio = useMemo(() => {
    const l1 = getLuminance(fgColor);
    const l2 = getLuminance(bgColor);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
  }, [fgColor, bgColor]);

  const results = {
    ratio: contrastRatio.toFixed(2),
    aa_small: contrastRatio >= 4.5,
    aa_large: contrastRatio >= 3,
    aaa_small: contrastRatio >= 7,
    aaa_large: contrastRatio >= 4.5,
  };

  const reset = () => {
    setFgColor('#ffffff');
    setBgColor('#6366f1');
  };

  const StatusIcon = ({ pass }: { pass: boolean }) => (
    pass ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  );

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{commonT('ui.preview')}</Label>
            <div className="grid gap-4 sm:grid-cols-2">
               <Card 
                 className="border border-border shadow-none rounded-md overflow-hidden min-h-[200px] flex flex-col items-center justify-center p-8 transition-colors duration-300"
                 style={{ backgroundColor: bgColor, color: fgColor }}
               >
                  <p className="text-3xl font-bold mb-2">Large Text</p>
                  <p className="text-sm opacity-90">This is a preview of normal text on the background.</p>
               </Card>
               <Card className="border border-border shadow-none rounded-md bg-background flex flex-col items-center justify-center p-8">
                  <div className="text-center space-y-1">
                     <p className="text-4xl font-bold tracking-tighter">{results.ratio}:1</p>
                     <p className="text-[10px] text-muted-foreground uppercase font-medium">{t('contrast_ratio')}</p>
                  </div>
               </Card>
            </div>
          </div>

          {/* WCAG Status Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
             <Card className="border border-border shadow-none rounded-md bg-background p-6">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                   <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">AA</span>
                   {t('wcag_aa')}
                </h3>
                <div className="space-y-3">
                   <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-xs text-muted-foreground">{t('normal_text')} (4.5:1)</span>
                      <StatusIcon pass={results.aa_small} />
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{t('large_text')} (3:1)</span>
                      <StatusIcon pass={results.aa_large} />
                   </div>
                </div>
             </Card>

             <Card className="border border-border shadow-none rounded-md bg-background p-6">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                   <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">AAA</span>
                   {t('wcag_aaa')}
                </h3>
                <div className="space-y-3">
                   <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-xs text-muted-foreground">{t('normal_text')} (7:1)</span>
                      <StatusIcon pass={results.aaa_small} />
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{t('large_text')} (4.5:1)</span>
                      <StatusIcon pass={results.aaa_large} />
                   </div>
                </div>
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
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('foreground')}</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={fgColor} 
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
                    />
                    <Input 
                      type="text" 
                      value={fgColor} 
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-8 text-xs font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('background')}</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
                    />
                    <Input 
                      type="text" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
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
      <ToolNavigation currentToolId="color-contrast-checker" />
    </div>
  );
}
