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

export function IframeGeneratorClient() {
  const t = useTranslations('tools.iframe-generator');
  const commonT = useTranslations('common');
  
  const [formData, setFormData] = useState({
    src: 'https://www.google.com/maps/embed?...',
    width: '100%',
    height: '450',
    border: false,
    sandbox: true,
  });
  
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generateIframe = useCallback(() => {
    let tag = `<iframe\n  src="${formData.src}"\n  width="${formData.width}"\n  height="${formData.height}"\n  style="border: ${formData.border ? '1px solid #ccc' : '0'}"\n  allowfullscreen\n  loading="lazy"\n  referrerpolicy="no-referrer-when-downgrade"`;
    
    if (formData.sandbox) {
      tag += '\n  sandbox="allow-scripts allow-same-origin"';
    }
    
    tag += '\n></iframe>';
    
    setOutput(tag);
  }, [formData]);

  useEffect(() => {
    generateIframe();
  }, [generateIframe]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setFormData({
      src: '',
      width: '100%',
      height: '450',
      border: false,
      sandbox: true,
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
              <div className="space-y-1.5">
                <Label className="text-xs">{t('src')}</Label>
                <Input 
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  placeholder={t('placeholder_src')}
                  className="h-9 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('width')}</Label>
                  <Input 
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    placeholder="100%"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('height')}</Label>
                  <Input 
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="450"
                    className="h-9 text-xs"
                  />
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
                <Label className="text-xs cursor-pointer" htmlFor="border-switch">{t('border')}</Label>
                <Switch 
                  id="border-switch"
                  checked={formData.border} 
                  onCheckedChange={(val) => setFormData({ ...formData, border: val })} 
                  className="scale-75 origin-right" 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs cursor-pointer" htmlFor="sandbox-switch">{t('sandbox')}</Label>
                <Switch 
                  id="sandbox-switch"
                  checked={formData.sandbox} 
                  onCheckedChange={(val) => setFormData({ ...formData, sandbox: val })} 
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
      <ToolNavigation currentToolId="iframe-generator" />
    </div>
  );
}
