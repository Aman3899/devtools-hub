'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Copy, Type, RefreshCw, Trash2, Download, Info, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import figlet from 'figlet';

export function AsciiArtClient() {
  const t = useTranslations('tools.ascii-art');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [font, setFont] = useState<figlet.Fonts>('Standard');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      figlet.text(input, { font: font }, (err, data) => {
        if (err) return;
        setOutput(data || '');
      });
    } catch (e) {
      console.error(e);
    }
  }, [input, font]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success(commonT('copied'));
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInput('DevTools');
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('input')}</Label>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {commonT('hero.searchPlaceholder' as any) === 'Find a tool...' ? 'Sample' : 'مثال'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setInput('')} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-background focus-within:border-foreground/20 transition-colors overflow-hidden">
              <Input
                placeholder={t('placeholder')}
                className="font-sans text-xs h-10 border-none focus-visible:ring-0 px-3 bg-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Card>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('output')}</Label>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDownload} 
                  disabled={!output}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="h-3 w-3" />
                  .txt
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopy} 
                  disabled={!output}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  {commonT('copy')}
                </Button>
              </div>
            </div>
            <Card className="min-h-[400px] flex items-center justify-center p-8 rounded-md bg-muted/20 border border-border shadow-none overflow-auto">
              {output ? (
                <pre className="font-mono text-[10px] sm:text-xs leading-none text-foreground whitespace-pre animate-in fade-in zoom-in-95 duration-300">
                  {output}
                </pre>
              ) : (
                <div className="text-muted-foreground opacity-30 flex flex-col items-center gap-2 pointer-events-none">
                  <Type className="h-10 w-10" />
                  <p className="text-[10px]">ASCII Preview</p>
                </div>
              )}
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
                  {commonT('ui.customization')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">Font Style</Label>
                <Select value={font} onValueChange={(v) => setFont(v as figlet.Fonts)}>
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard" className="text-xs">Standard</SelectItem>
                    <SelectItem value="Slant" className="text-xs">Slant</SelectItem>
                    <SelectItem value="Shadow" className="text-xs">Shadow</SelectItem>
                    <SelectItem value="Big" className="text-xs">Big</SelectItem>
                    <SelectItem value="Small" className="text-xs">Small</SelectItem>
                    <SelectItem value="Banner" className="text-xs">Banner</SelectItem>
                    <SelectItem value="Digital" className="text-xs">Digital</SelectItem>
                    <SelectItem value="Block" className="text-xs">Block</SelectItem>
                    <SelectItem value="Bubble" className="text-xs">Bubble</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              {t('article').split('.')[0]}.
            </p>
          </div>
        </div>
      </div>
      <ToolNavigation currentToolId="ascii-art" />
    </div>
  );
}
