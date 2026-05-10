'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, Settings2, Info, Check } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function HtmlTableGeneratorClient() {
  const t = useTranslations('tools.html-table-generator');
  const commonT = useTranslations('common');
  
  const [formData, setFormData] = useState({
    rows: 3,
    cols: 3,
    header: true,
    striped: true,
  });
  
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generateTable = useCallback(() => {
    let html = '<table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">\n';
    
    if (formData.header) {
      html += '  <thead>\n    <tr style="background-color: #f2f2f2;">\n';
      for (let j = 0; j < formData.cols; j++) {
        html += `      <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${t('header_cell')} ${j + 1}</th>\n`;
      }
      html += '    </tr>\n  </thead>\n';
    }
    
    html += '  <tbody>\n';
    for (let i = 0; i < formData.rows; i++) {
      const bgColor = formData.striped && i % 2 === 1 ? 'background-color: #fafafa;' : '';
      html += `    <tr style="${bgColor}">\n`;
      for (let j = 0; j < formData.cols; j++) {
        html += `      <td style="padding: 12px; border-bottom: 1px solid #ddd;">${t('data_cell')} ${i + 1}-${j + 1}</td>\n`;
      }
      html += '    </tr>\n';
    }
    html += '  </tbody>\n</table>';
    
    setOutput(html);
  }, [formData, t]);

  useEffect(() => {
    generateTable();
  }, [generateTable]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setFormData({
      rows: 3,
      cols: 3,
      header: true,
      striped: true,
    });
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Form Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('input')}</Label>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md p-4 bg-background space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('rows')}</Label>
                  <Input 
                    type="number"
                    min="1"
                    max="50"
                    value={formData.rows}
                    onChange={(e) => setFormData({ ...formData, rows: parseInt(e.target.value) || 1 })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('cols')}</Label>
                  <Input 
                    type="number"
                    min="1"
                    max="20"
                    value={formData.cols}
                    onChange={(e) => setFormData({ ...formData, cols: parseInt(e.target.value) || 1 })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
              <div className="p-4 border rounded-md bg-muted/20 overflow-hidden">
                <div className="overflow-x-auto">
                   {/* Simplified Preview */}
                   <div dangerouslySetInnerHTML={{ __html: output }} className="scale-[0.8] origin-top-left" />
                </div>
              </div>
            </Card>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
            <Card className="flex flex-col h-full border border-border shadow-none rounded-md overflow-hidden bg-muted/20 min-h-[400px]">
              <pre className="flex-1 font-mono text-[11px] p-4 overflow-auto whitespace-pre-wrap leading-relaxed text-foreground bg-transparent">
                {output}
              </pre>
            </Card>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {commonT('ui.options')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs cursor-pointer" htmlFor="header-switch">{t('header')}</Label>
                <Switch 
                  id="header-switch"
                  checked={formData.header} 
                  onCheckedChange={(val) => setFormData({ ...formData, header: val })} 
                  className="scale-75 origin-right" 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs cursor-pointer" htmlFor="striped-switch">{t('striped')}</Label>
                <Switch 
                  id="striped-switch"
                  checked={formData.striped} 
                  onCheckedChange={(val) => setFormData({ ...formData, striped: val })} 
                  className="scale-75 origin-right" 
                />
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex gap-2.5 items-start p-3 rounded-md bg-muted/30 border border-border">
                  <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    {t('article').split('.')[0]}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="html-table-generator" />
    </div>
  );
}
