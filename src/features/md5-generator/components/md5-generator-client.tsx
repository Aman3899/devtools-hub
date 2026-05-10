'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, Info, Copy, RefreshCw, Upload, FileText, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import CryptoJS from 'crypto-js';

export function Md5GeneratorClient() {
  const t = useTranslations('tools.md5-generator');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isFileMode, setIsFileMode] = useState(false);
  const [fileName, setFileName] = useState('');
  const [copied, setCopied] = useState(false);

  const isEnglish = commonT('hero.searchPlaceholder' as any) === 'Find a tool...';

  const processText = useCallback((text: string) => {
    if (!text) {
      setOutput('');
      return;
    }
    const hash = CryptoJS.MD5(text).toString();
    setOutput(hash);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsFileMode(true);
    setFileName(file.name);
    setInput('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer as any);
      const hash = CryptoJS.MD5(wordArray).toString();
      setOutput(hash);
      toast.success(isEnglish ? 'File hashed successfully' : 'فائل کامیابی کے ساتھ ہیش ہو گئی');
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (!isFileMode) {
      processText(input);
    }
  }, [input, isFileMode, processText]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(commonT('copied'));
  };

  const loadSample = () => {
    setIsFileMode(false);
    setFileName('');
    const sample = 'Hello, DevTools Hub!';
    setInput(sample);
    processText(sample);
    toast.success(commonT('success'));
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setIsFileMode(false);
    setFileName('');
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
            
            <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors relative">
              {isFileMode ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{fileName}</p>
                    <p className="text-xs text-muted-foreground">File loaded for hashing</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={clear}>Remove File</Button>
                </div>
              ) : (
                <Textarea
                  placeholder={isEnglish ? 'Enter text to generate MD5 hash...' : 'MD5 ہیش بنانے کے لیے ٹیکسٹ درج کریں...'}
                  className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              )}
            </Card>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isEnglish ? 'MD5 Hash' : 'MD5 ہیش'}</Label>
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
            <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <div className="flex-1 flex items-center justify-center p-6">
                {output ? (
                  <div className="w-full text-center space-y-4">
                    <div className="p-4 bg-background border border-border rounded-md shadow-sm">
                      <span className="font-mono text-sm md:text-lg text-foreground break-all select-all">
                        {output}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">128-bit • 32 characters</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground opacity-50">{isEnglish ? 'Hash will appear here...' : 'ہیش یہاں ظاہر ہوگا...'}</p>
                )}
              </div>
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
              
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{isEnglish ? 'File Hash (Local)' : 'فائل ہیش (مقامی)'}</Label>
                <Label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-md hover:border-foreground/20 hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground group-hover:text-foreground">
                    <Upload className="h-5 w-5" />
                    <span className="text-[10px] font-medium">{isEnglish ? 'Select any file' : 'کوئی بھی فائل منتخب کریں'}</span>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </Label>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {isEnglish ? 'Security Note' : 'سیکیورٹی نوٹ'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {isEnglish ? 'MD5 is considered cryptographically broken and is prone to collision attacks. It should only be used for checksums and verifying data integrity, not for storing passwords.' : 'MD5 کو پاس ورڈز کے لیے استعمال نہیں کیا جانا چاہیے۔'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="md5-generator" />
    </div>
  );
}
