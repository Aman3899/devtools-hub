'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, RefreshCw, ArrowRightLeft, Lock, Unlock, Download } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function Base64EncoderClient() {
  const t = useTranslations('tools.base64-encoder');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    if (!input.trim()) return;

    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
      toast.success(commonT('success'));
    } catch (e) {
      toast.error('Invalid input for ' + mode + 'ing');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-${mode}d.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    if (mode === 'encode') {
      setInput('Hello, World! DevTools Hub is a privacy-first tool.');
    } else {
      setInput('SGVsbG8sIFdvcmxkISBEZXZUb29scyBIdWIgaXMgYSBwcml2YWN5LWZpcnN0IHRvb2wu');
    }
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg border border-dashed gap-4">
            <Button
              variant={mode === 'encode' ? 'default' : 'outline'}
              className="flex-1 max-w-[200px] gap-2"
              onClick={() => setMode('encode')}
            >
              <Lock className="h-4 w-4" />
              {commonT('encode')}
            </Button>
            <Button
              variant={mode === 'decode' ? 'default' : 'outline'}
              className="flex-1 max-w-[200px] gap-2"
              onClick={() => setMode('decode')}
            >
              <Unlock className="h-4 w-4" />
              {commonT('decode')}
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="input">{commonT('input')}</Label>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={loadSample}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {commonT('loadSample')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setInput('')} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {commonT('clear')}
                  </Button>
                </div>
              </div>
              <Textarea
                id="input"
                placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                className="min-h-[300px] font-mono text-sm resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button className="w-full" size="lg" onClick={process} disabled={!input}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                {mode === 'encode' ? commonT('encode') : commonT('decode')}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">{commonT('output')}</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
                    <Download className="h-4 w-4 mr-2" />
                    .txt
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(output);
                    toast.success(commonT('copied'));
                  }} disabled={!output}>
                    <Copy className="h-4 w-4 mr-2" />
                    {commonT('copy')}
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Textarea
                  id="output"
                  readOnly
                  className="min-h-[300px] font-mono text-sm bg-muted/50 resize-none"
                  value={output}
                />
                {!output && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50 pointer-events-none">
                    {mode === 'encode' ? <Lock className="h-12 w-12 mb-2" /> : <Unlock className="h-12 w-12 mb-2" />}
                    <p>{commonT('output')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="base64-encoder" />
    </div>
  );
}
