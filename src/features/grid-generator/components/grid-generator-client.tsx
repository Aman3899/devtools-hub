"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Copy, Check, Settings2, Info, RefreshCw, Zap, Grid as GridIcon } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function GridGeneratorClient() {
  const t = useTranslations('tools.grid-generator');
  const commonT = useTranslations('common');

  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [columnGap, setColumnGap] = useState(16);
  const [rowGap, setRowGap] = useState(16);
  const [copied, setCopied] = useState(false);

  const cssCode = `display: grid;
grid-template-columns: repeat(${columns}, 1fr);
grid-template-rows: repeat(${rows}, 1fr);
column-gap: ${columnGap}px;
row-gap: ${rowGap}px;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applySample = (c: number, r: number, cg: number, rg: number) => {
    setColumns(c);
    setRows(r);
    setColumnGap(cg);
    setRowGap(rg);
  };

  const reset = () => {
    setColumns(3);
    setRows(3);
    setColumnGap(16);
    setRowGap(16);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{commonT('ui.preview')}</Label>
            <Card className="border border-border shadow-none rounded-md overflow-hidden bg-background min-h-[400px] relative p-8 flex">
               <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
               <div 
                 className="w-full h-full min-h-[360px] rounded-lg bg-muted/20 border border-dashed border-border p-4 relative z-10" 
                 style={{ 
                   display: 'grid', 
                   gridTemplateColumns: `repeat(${columns}, 1fr)`,
                   gridTemplateRows: `repeat(${rows}, 1fr)`,
                   columnGap: `${columnGap}px`,
                   rowGap: `${rowGap}px`
                 }}
               >
                  {Array.from({ length: columns * rows }).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-primary/10 border border-primary/30 rounded-md flex items-center justify-center font-mono text-[10px] text-primary/50"
                    >
                      {i + 1}
                    </div>
                  ))}
               </div>
            </Card>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-muted/20 p-4 font-mono text-xs overflow-x-auto whitespace-pre">
               {cssCode}
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
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => applySample(12, 1, 8, 8)} 
                    className="h-6 px-1.5 text-[10px] w-auto"
                    title="12 Col Grid"
                  >
                    <GridIcon className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => applySample(2, 2, 20, 20)} 
                    className="h-6 px-1.5 text-[10px] w-auto"
                    title="Holy Grail"
                  >
                    <Zap className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={reset} className="h-6 w-6 text-muted-foreground">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('columns')}</Label>
                    <span className="text-[10px] font-mono">{columns}</span>
                  </div>
                  <Slider value={[columns]} onValueChange={(v) => setColumns(Array.isArray(v) ? v[0] : v)} min={1} max={12} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('rows')}</Label>
                    <span className="text-[10px] font-mono">{rows}</span>
                  </div>
                  <Slider value={[rows]} onValueChange={(v) => setRows(Array.isArray(v) ? v[0] : v)} min={1} max={12} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('col_gap')}</Label>
                    <span className="text-[10px] font-mono">{columnGap}px</span>
                  </div>
                  <Slider value={[columnGap]} onValueChange={(v) => setColumnGap(Array.isArray(v) ? v[0] : v)} max={100} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('row_gap')}</Label>
                    <span className="text-[10px] font-mono">{rowGap}px</span>
                  </div>
                  <Slider value={[rowGap]} onValueChange={(v) => setRowGap(Array.isArray(v) ? v[0] : v)} max={100} step={1} />
                </div>
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
      <ToolNavigation currentToolId="grid-generator" />
    </div>
  );
}
