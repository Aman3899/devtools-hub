'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, Info, Copy, RefreshCw, Check, ArrowRightLeft, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import punycode from 'punycode';

export function PunycodeConverterClient() {
  const t = useTranslations('tools.punycode-converter');
  const commonT = useTranslations('common');
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const processData = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(punycode.toASCII(input));
      } else {
        setOutput(punycode.toUnicode(input));
      }
    } catch (e) {
      setOutput(commonT('error'));
    }
  }, [input, mode, commonT]);

  useEffect(() => {
    processData();
  }, [processData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(commonT('copied'));
  };

  const loadSample = () => {
    if (mode === 'encode') {
      setInput('mañana.com');
    } else {
      setInput('xn--maana-pta.com');
    }
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('domain_input')}</Label>
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                <RefreshCw className="h-3 w-3" />
                {commonT('ui.sample')}
              </Button>
            </div>
            
            <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder={mode === 'encode' ? 'e.g., mañana.com' : 'e.g., xn--maana-pta.com'}
                className="flex-1 font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Card>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('converted_output')}</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard} 
                disabled={!output || output === commonT('error')}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
            <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <Textarea
                readOnly
                className="flex-1 font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-transparent leading-relaxed text-[#e06c75]"
                value={output}
                placeholder="Result..."
              />
            </Card>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {commonT('ui.customization')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant={mode === 'encode' ? 'default' : 'outline'} 
                  className="w-full justify-start h-9 text-xs"
                  onClick={() => { setMode('encode'); setInput(''); }}
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  {t('encode')}
                </Button>
                <Button 
                  variant={mode === 'decode' ? 'default' : 'outline'} 
                  className="w-full justify-start h-9 text-xs"
                  onClick={() => { setMode('decode'); setInput(''); }}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {t('decode')}
                </Button>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  Info
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('info')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="punycode-converter" />
    </div>
  );
}
