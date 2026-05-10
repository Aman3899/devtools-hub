'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, RefreshCw, Lock, Unlock, Download, Settings2, Info, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import { cn } from '@/lib/utils';

export function Base64EncoderClient() {
  const t = useTranslations('tools.base64-encoder');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isUrlSafe, setIsUrlSafe] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  
  const process = useCallback((textToProcess: string = input) => {
    if (!textToProcess.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        let encoded = btoa(unescape(encodeURIComponent(textToProcess)));
        if (isUrlSafe) {
          encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        setOutput(encoded);
      } else {
        let textToDecode = textToProcess;
        if (isUrlSafe) {
          textToDecode = textToDecode.replace(/-/g, '+').replace(/_/g, '/');
          while (textToDecode.length % 4) {
            textToDecode += '=';
          }
        }
        setOutput(decodeURIComponent(escape(atob(textToDecode))));
      }
    } catch (e) {
      setOutput(commonT('error'));
    }
  }, [input, mode, isUrlSafe]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      process(text);
      toast.success(commonT('success'));
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-${mode}d-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(commonT('copied'));
  };

  const loadSample = () => {
    const sample = mode === 'encode' 
      ? 'Hello, World! DevTools Hub is a privacy-first tool.' 
      : 'SGVsbG8sIFdvcmxkISBEZXZUb29scyBIdWIgaXMgYSBwcml2YWN5LWZpcnN0IHRvb2wu';
    setInput(sample);
    process(sample);
    toast.success(commonT('success'));
  };

  const stats = {
    chars: input.length,
    lines: input.split('\n').length
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('input')}</Label>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] text-muted-foreground/60">{stats.chars} chars</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {t('sample')}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setInput(''); setOutput(''); }} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => { setInput(e.target.value); process(e.target.value); }}
              />
              <div className="p-2 border-t bg-muted/5">
                <Button className="w-full h-8 text-xs" onClick={() => process()} disabled={!input}>
                  <RefreshCw className="h-3.5 w-3.5 mr-2" />
                  {mode === 'encode' ? commonT('encode') : commonT('decode')}
                </Button>
              </div>
            </Card>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDownload} 
                  disabled={!output}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                  {commonT('download')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard} 
                  disabled={!output}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {commonT('copy')}
                </Button>
              </div>
            </div>
            <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <pre className="flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed text-foreground">
                {output || (t('result_will_app'))}
              </pre>
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
            <CardContent className="p-4 space-y-6">
              <div className="flex bg-muted/30 p-1 rounded-md border border-border">
                <Button
                  variant={mode === 'encode' ? 'default' : 'ghost'}
                  size="sm"
                  className={cn("flex-1 h-7 text-[10px] rounded-sm transition-all", mode === 'encode' ? "shadow-sm" : "")}
                  onClick={() => { setMode('encode'); setInput(''); setOutput(''); }}
                >
                  <Lock className="h-3 w-3 mr-1.5" />
                  {commonT('encode')}
                </Button>
                <Button
                  variant={mode === 'decode' ? 'default' : 'ghost'}
                  size="sm"
                  className={cn("flex-1 h-7 text-[10px] rounded-sm transition-all", mode === 'decode' ? "shadow-sm" : "")}
                  onClick={() => { setMode('decode'); setInput(''); setOutput(''); }}
                >
                  <Unlock className="h-3 w-3 mr-1.5" />
                  {commonT('decode')}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">URL Safe</Label>
                  <p className="text-[9px] text-muted-foreground leading-tight">Use - and _ instead of + and /</p>
                </div>
                <Switch checked={isUrlSafe} onCheckedChange={(val) => { setIsUrlSafe(val); process(); }} className="scale-75 origin-right" />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('upload_file')}</Label>
                <Label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-md hover:border-foreground/20 hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground group-hover:text-foreground">
                    <Upload className="h-5 w-5" />
                    <span className="text-[10px] font-medium">{t('select_text_fil')}</span>
                  </div>
                  <input type="file" className="hidden" accept=".txt,.json,.md,.csv" onChange={handleFileUpload} />
                </Label>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {t('quick_tip')}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('article').split('.')[0] || 'Base64 encoding converts data into a secure ASCII string format.'}.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="base64-encoder" />
    </div>
  );
}
