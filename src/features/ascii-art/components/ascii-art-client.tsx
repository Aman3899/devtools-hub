'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Copy, Type, RefreshCw, Trash2, Download } from 'lucide-react';
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
    setInput(t('sample'));
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-dashed">
            <div className="space-y-2">
              <Label htmlFor="font-select">Font Style</Label>
              <Select value={font} onValueChange={(v) => setFont(v as figlet.Fonts)}>
                <SelectTrigger id="font-select" className="bg-background">
                  <SelectValue placeholder="Select Font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Slant">Slant</SelectItem>
                  <SelectItem value="Shadow">Shadow</SelectItem>
                  <SelectItem value="Big">Big</SelectItem>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Banner">Banner</SelectItem>
                  <SelectItem value="Digital">Digital</SelectItem>
                  <SelectItem value="Block">Block</SelectItem>
                  <SelectItem value="Bubble">Bubble</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={loadSample}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {commonT('loadSample')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setInput('')} disabled={!input}>
                <Trash2 className="h-4 w-4 mr-2" />
                {commonT('clear')}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="text-input">{t('input')}</Label>
            <Input
              id="text-input"
              placeholder={t('placeholder')}
              className="font-sans text-sm h-12"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('output')}</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
                  <Download className="h-4 w-4 mr-2" />
                  .txt
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
                  <Copy className="h-4 w-4 mr-2" />
                  {commonT('copy')}
                </Button>
              </div>
            </div>
            <div className="bg-muted/50 border rounded-md p-8 overflow-auto font-mono text-[10px] sm:text-xs leading-none min-h-[400px] flex items-center justify-center relative group">
              {output ? (
                <pre className="whitespace-pre text-foreground animate-in fade-in zoom-in-95 duration-300">{output}</pre>
              ) : (
                <div className="text-muted-foreground opacity-50 flex flex-col items-center gap-2 pointer-events-none">
                  <Type className="h-12 w-12" />
                  <p>{t('placeholder')}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="ascii-art" />
    </div>
  );
}
