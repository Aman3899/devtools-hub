"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Settings2, Info, RefreshCw, ShieldCheck, ShieldAlert, Type } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';
import { cn } from '@/lib/utils';

export function ColorContrastCheckerClient() {
  const t = useTranslations('tools.color-contrast-checker');
  const commonT = useTranslations('common');

  const [foreground, setForeground] = useState('#ffffff');
  const [background, setBackground] = useState('#6366f1');
  const [copied, setCopied] = useState<string | null>(null);

  const getLuminance = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const [R, G, B] = [r, g, b].map(v => 
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };

  const contrast = useMemo(() => {
    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }, [foreground, background]);

  const results = {
    ratio: contrast.toFixed(2),
    aa_normal: contrast >= 4.5,
    aa_large: contrast >= 3,
    aaa_normal: contrast >= 7,
    aaa_large: contrast >= 4.5,
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{commonT('ui.preview')}</Label>
            <Card 
              className="border border-border shadow-none rounded-md overflow-hidden min-h-[300px] flex flex-col items-center justify-center p-12 transition-colors duration-300 gap-6"
              style={{ backgroundColor: background }}
            >
               <div className="max-w-md w-full space-y-4 text-center">
                  <h2 className="text-4xl font-bold tracking-tight" style={{ color: foreground }}>
                    Sample Heading
                  </h2>
                  <p className="text-sm leading-relaxed opacity-90" style={{ color: foreground }}>
                    This is a preview of how your text colors will look together. High contrast ensures that your content is readable by everyone, including users with visual impairments.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-2 font-bold" 
                    style={{ borderColor: foreground, color: foreground, backgroundColor: 'transparent' }}
                  >
                    Action Button
                  </Button>
               </div>
            </Card>
          </div>

          {/* Results Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <div className="flex flex-col gap-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{t('wcag_aa')}</Label>
                <Card className="p-4 flex items-center justify-between bg-background border border-border shadow-none">
                   <span className="text-xs font-medium">{t('normal_text')}</span>
                   {results.aa_normal ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldAlert className="h-4 w-4 text-destructive" />}
                </Card>
             </div>
             <div className="flex flex-col gap-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{t('wcag_aa')}</Label>
                <Card className="p-4 flex items-center justify-between bg-background border border-border shadow-none">
                   <span className="text-xs font-medium">{t('large_text')}</span>
                   {results.aa_large ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldAlert className="h-4 w-4 text-destructive" />}
                </Card>
             </div>
             <div className="flex flex-col gap-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{t('wcag_aaa')}</Label>
                <Card className="p-4 flex items-center justify-between bg-background border border-border shadow-none">
                   <span className="text-xs font-medium">{t('normal_text')}</span>
                   {results.aaa_normal ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldAlert className="h-4 w-4 text-destructive" />}
                </Card>
             </div>
             <div className="flex flex-col gap-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{t('wcag_aaa')}</Label>
                <Card className="p-4 flex items-center justify-between bg-background border border-border shadow-none">
                   <span className="text-xs font-medium">{t('large_text')}</span>
                   {results.aaa_large ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldAlert className="h-4 w-4 text-destructive" />}
                </Card>
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
                <div className="text-[14px] font-black font-mono" style={{ color: results.aa_normal ? '#22c55e' : '#ef4444' }}>
                   {results.ratio}:1
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('foreground')}</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={foreground} 
                      onChange={(e) => setForeground(e.target.value)}
                      className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer"
                    />
                    <div className="flex-1 relative">
                       <Input 
                        type="text" 
                        value={foreground} 
                        onChange={(e) => setForeground(e.target.value)}
                        className="h-10 text-xs font-mono uppercase pr-8"
                      />
                      <Button variant="ghost" size="icon" onClick={() => copyHex(foreground)} className="absolute right-1 top-1 h-8 w-8 text-muted-foreground">
                         {copied === foreground ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('background')}</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={background} 
                      onChange={(e) => setBackground(e.target.value)}
                      className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer"
                    />
                    <div className="flex-1 relative">
                       <Input 
                        type="text" 
                        value={background} 
                        onChange={(e) => setBackground(e.target.value)}
                        className="h-10 text-xs font-mono uppercase pr-8"
                      />
                      <Button variant="ghost" size="icon" onClick={() => copyHex(background)} className="absolute right-1 top-1 h-8 w-8 text-muted-foreground">
                         {copied === background ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-8 text-[10px] uppercase font-bold tracking-wider"
                  onClick={() => {
                    const temp = foreground;
                    setForeground(background);
                    setBackground(temp);
                  }}
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Swap Colors
                </Button>
              </div>

              <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
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
