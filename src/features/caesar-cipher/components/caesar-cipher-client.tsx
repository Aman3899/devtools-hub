'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Settings2, Info, Copy, RefreshCw, Check, Trash2, ArrowRightLeft, List } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function CaesarCipherClient() {
  const t = useTranslations('tools.caesar-cipher');
  const commonT = useTranslations('common');
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isBruteForce, setIsBruteForce] = useState(false);
  const [copied, setCopied] = useState(false);

  const isEnglish = commonT('hero.searchPlaceholder' as any) === 'Find a tool...';

  const caesarShift = (text: string, amount: number) => {
    if (amount < 0) return caesarShift(text, amount + 26);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      let c = text[i];
      if (c.match(/[a-z]/i)) {
        let code = text.charCodeAt(i);
        if (code >= 65 && code <= 90) {
          c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
        }
      }
      result += c;
    }
    return result;
  };

  const processData = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (isBruteForce) {
      let bruteForceOut = '';
      for (let i = 1; i < 26; i++) {
        bruteForceOut += `Shift +${i}:\n${caesarShift(input, i)}\n\n`;
      }
      setOutput(bruteForceOut);
    } else {
      const actualShift = mode === 'encode' ? shift : (26 - shift);
      setOutput(caesarShift(input, actualShift));
    }
  }, [input, shift, mode, isBruteForce]);

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
    setInput('Hello World! This is Caesar Cipher.');
    setShift(3);
    setMode('encode');
    setIsBruteForce(false);
    toast.success(commonT('success'));
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('input')}</Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {isEnglish ? 'Sample' : 'مثال'}
                </Button>
                <Button variant="ghost" size="icon" onClick={clear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Card className="flex flex-col h-[400px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder={isEnglish ? 'Enter text to shift...' : 'متن درج کریں...'}
                className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Card>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
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
            <Card className="flex flex-col h-[400px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <Textarea
                readOnly
                className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed text-[#98c379]"
                value={output}
                placeholder={isEnglish ? 'Result will appear here...' : 'نتیجہ یہاں ظاہر ہوگا...'}
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
              
              <div className="flex bg-muted/30 p-1 rounded-md border border-border">
                <Button
                  variant={mode === 'encode' && !isBruteForce ? 'default' : 'ghost'}
                  size="sm"
                  className="flex-1 h-7 text-[10px] rounded-sm transition-all shadow-sm"
                  onClick={() => { setMode('encode'); setIsBruteForce(false); }}
                >
                  <ArrowRightLeft className="h-3 w-3 mr-1.5" />
                  {isEnglish ? 'Encode' : 'انکوڈ'}
                </Button>
                <Button
                  variant={mode === 'decode' && !isBruteForce ? 'default' : 'ghost'}
                  size="sm"
                  className="flex-1 h-7 text-[10px] rounded-sm transition-all"
                  onClick={() => { setMode('decode'); setIsBruteForce(false); }}
                >
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                  {isEnglish ? 'Decode' : 'ڈیکوڈ'}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{isEnglish ? 'Shift Value' : 'شفٹ کی قیمت'}</Label>
                  <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">{shift}</span>
                </div>
                <Slider
                  value={[shift]}
                  onValueChange={(vals: any) => setShift(Array.isArray(vals) ? vals[0] : vals)}
                  max={25}
                  min={1}
                  step={1}
                  disabled={isBruteForce}
                  className="w-full"
                />
              </div>

              <div className="pt-4 border-t">
                <Button 
                  variant={isBruteForce ? "default" : "outline"} 
                  className="w-full h-9 text-xs"
                  onClick={() => setIsBruteForce(!isBruteForce)}
                >
                  <List className="h-4 w-4 mr-2" />
                  {isEnglish ? (isBruteForce ? 'Stop Brute Force' : 'Brute Force (All 25)') : 'بروٹ فورس'}
                </Button>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5 mt-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {isEnglish ? 'Info' : 'معلومات'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {isEnglish ? 'Caesar Cipher is a substitution cipher where each letter is shifted a certain number of places down the alphabet.' : 'یہ ایک سادہ انکرپشن کی تکنیک ہے۔'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="caesar-cipher" />
    </div>
  );
}
