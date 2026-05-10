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

export function ShaGeneratorClient() {
  const t = useTranslations('tools.sha-generator');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({ sha1: '', sha256: '', sha512: '' });
  const [isFileMode, setIsFileMode] = useState(false);
  const [fileName, setFileName] = useState('');
  const [copiedStates, setCopiedStates] = useState({ sha1: false, sha256: false, sha512: false });

  
  const processText = useCallback((text: string) => {
    if (!text) {
      setHashes({ sha1: '', sha256: '', sha512: '' });
      return;
    }
    setHashes({
      sha1: CryptoJS.SHA1(text).toString(),
      sha256: CryptoJS.SHA256(text).toString(),
      sha512: CryptoJS.SHA512(text).toString(),
    });
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
      setHashes({
        sha1: CryptoJS.SHA1(wordArray).toString(),
        sha256: CryptoJS.SHA256(wordArray).toString(),
        sha512: CryptoJS.SHA512(wordArray).toString(),
      });
      toast.success(t('file_hashed_suc'));
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (!isFileMode) {
      processText(input);
    }
  }, [input, isFileMode, processText]);

  const copyToClipboard = (type: 'sha1' | 'sha256' | 'sha512') => {
    navigator.clipboard.writeText(hashes[type]);
    setCopiedStates(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [type]: false })), 2000);
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
    setHashes({ sha1: '', sha256: '', sha512: '' });
    setIsFileMode(false);
    setFileName('');
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('input')}</Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {t('sample')}
                </Button>
                <Button variant="ghost" size="icon" onClick={clear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Card className="flex flex-col h-[200px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors relative">
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
                  placeholder={t('enter_text_to_g')}
                  className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              )}
            </Card>
          </div>

          {/* Outputs Area */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* SHA-1 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">SHA-1</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard('sha1')} disabled={!hashes.sha1} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  {copiedStates.sha1 ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {commonT('copy')}
                </Button>
              </div>
              <Card className="flex flex-col h-[150px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20 p-4 justify-center">
                {hashes.sha1 ? (
                  <span className="font-mono text-xs text-foreground break-all">{hashes.sha1}</span>
                ) : (
                  <span className="text-xs text-muted-foreground opacity-50 text-center">SHA-1 Hash</span>
                )}
              </Card>
            </div>
            
            {/* SHA-256 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">SHA-256</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard('sha256')} disabled={!hashes.sha256} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  {copiedStates.sha256 ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {commonT('copy')}
                </Button>
              </div>
              <Card className="flex flex-col h-[150px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20 p-4 justify-center">
                {hashes.sha256 ? (
                  <span className="font-mono text-xs text-foreground break-all">{hashes.sha256}</span>
                ) : (
                  <span className="text-xs text-muted-foreground opacity-50 text-center">SHA-256 Hash</span>
                )}
              </Card>
            </div>

            {/* SHA-512 */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">SHA-512</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard('sha512')} disabled={!hashes.sha512} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  {copiedStates.sha512 ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {commonT('copy')}
                </Button>
              </div>
              <Card className="flex flex-col min-h-[150px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20 p-4 justify-center">
                {hashes.sha512 ? (
                  <span className="font-mono text-xs text-foreground break-all">{hashes.sha512}</span>
                ) : (
                  <span className="text-xs text-muted-foreground opacity-50 text-center">SHA-512 Hash</span>
                )}
              </Card>
            </div>
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
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('file_hash__loca')}</Label>
                <Label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-md hover:border-foreground/20 hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground group-hover:text-foreground">
                    <Upload className="h-5 w-5" />
                    <span className="text-[10px] font-medium">{t('select_any_file')}</span>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </Label>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {t('security_note')}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('sha_256_and_sha')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="sha-generator" />
    </div>
  );
}
