"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Trash2, RefreshCw, Settings2, Info } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #333; }
    p { color: #666; line-height: 1.6; }
    button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #0056b3; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to HTML Previewer</h1>
    <p>This is a sample HTML page. Edit the code on the left to see live changes here.</p>
    <button onclick="alert('Hello from HTML!')">Click Me</button>
  </div>
</body>
</html>`;

const DEVICE_SIZES = {
  desktop: { width: 1024, height: 768, label: 'Desktop' },
  tablet: { width: 768, height: 1024, label: 'Tablet' },
  mobile: { width: 375, height: 667, label: 'Mobile' },
};

export function HtmlPreviewerClient() {
  const t = useTranslations('tools.html-previewer');
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [input, setInput] = useState(SAMPLE_HTML);
  const [device, setDevice] = useState('desktop');
  const [customWidth, setCustomWidth] = useState('1024');
  const [customHeight, setCustomHeight] = useState('768');

  const currentSize = device === 'custom' 
    ? { width: parseInt(customWidth), height: parseInt(customHeight) }
    : DEVICE_SIZES[device as keyof typeof DEVICE_SIZES];

  const loadSample = () => setInput(SAMPLE_HTML);
  const stats = { chars: input.length, lines: input.split('\n').length };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard 
          title={
            <div className="flex items-center gap-2">
              {t('input')}
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/60 normal-case tracking-normal">{stats.chars} chars • {stats.lines} lines</span>
            </div>
          }
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5"><RefreshCw className="h-3 w-3" />Sample</Button>
              <Button variant="ghost" size="icon" onClick={() => setInput('')} title={tCommon('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <Textarea placeholder={t('placeholder')} className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed" value={input} onChange={(e) => setInput(e.target.value)} />
        </ToolCard>

        <ToolCard 
          title={
            <div className="flex items-center gap-2">
              {t('output')}
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/60 normal-case tracking-normal">{currentSize.width}×{currentSize.height}px</span>
            </div>
          }
          action={
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(input, 'html')} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'html' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}{tCommon('copy')}</Button>
          }
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20"
        >
          <div className="flex-1 overflow-auto bg-white">
            <iframe srcDoc={input} style={{ width: '100%', height: '100%', border: 'none' }} title="HTML Preview" sandbox="allow-scripts allow-same-origin" />
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={tCommon('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('device_size')}</Label>
            <Select value={device} onValueChange={(val) => val && setDevice(val)}>
              <SelectTrigger className="h-8 text-xs bg-muted/30 border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="desktop" className="text-xs">Desktop (1024×768)</SelectItem>
                <SelectItem value="tablet" className="text-xs">Tablet (768×1024)</SelectItem>
                <SelectItem value="mobile" className="text-xs">Mobile (375×667)</SelectItem>
                <SelectItem value="custom" className="text-xs">Custom Size</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {device === 'custom' && (
            <div className="space-y-3 pt-2 border-t">
              <div className="space-y-1">
                <Label className="text-xs">{t('width')}</Label>
                <input type="number" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} className="w-full h-8 px-2 text-xs border border-border rounded-md bg-muted/30" min="200" max="2000" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('height')}</Label>
                <input type="number" value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} className="w-full h-8 px-2 text-xs border border-border rounded-md bg-muted/30" min="200" max="2000" />
              </div>
            </div>
          )}
        </ToolCard>

        <Card className="border border-border shadow-none rounded-md bg-background">
          <CardHeader className="py-3 px-4 border-b"><CardTitle className="text-xs font-semibold">Preview Info</CardTitle></CardHeader>
          <CardContent className="p-4 space-y-2 text-[10px]">
            <div className="flex justify-between"><span className="text-muted-foreground">Current Size:</span><span className="font-mono font-semibold">{currentSize.width}×{currentSize.height}px</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">HTML Size:</span><span className="font-mono font-semibold">{(input.length / 1024).toFixed(2)} KB</span></div>
          </CardContent>
        </Card>

        <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
          <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground leading-normal">{t('article').split('.')[0]}.</p>
        </div>
      </div>
    </div>
  );
}
