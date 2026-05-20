"use client"

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, Info, Copy, RefreshCw, Upload, FileText, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function Md5GeneratorClient() {
  const t = useTranslations('tools.md5-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isFileMode, setIsFileMode] = useState(false);
  const [fileName, setFileName] = useState('');

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
      toast.success(t('file_hashed_suc'));
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (!isFileMode) {
      processText(input);
    }
  }, [input, isFileMode, processText]);

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
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        {/* Input Area */}
        <ToolCard 
          title={commonT('input')}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5"><RefreshCw className="h-3 w-3" />{t('sample')}</Button>
              <Button variant="ghost" size="icon" onClick={clear} title={commonT('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
            </div>
          }
          contentClassName="p-0 flex flex-col h-[300px]"
        >
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
        </ToolCard>

        {/* Output Area */}
        <ToolCard 
          title={t('md5_hash')}
          action={
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(output, 'md5')} 
              disabled={!output}
              className="h-6 px-2 text-[10px] gap-1.5 transition-colors"
            >
              {copiedType === 'md5' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {commonT('copy')}
            </Button>
          }
          contentClassName="p-0 flex flex-col h-[300px] bg-muted/20"
        >
          <div className="flex-1 flex items-center justify-center p-6 bg-transparent">
            {output ? (
              <div className="w-full text-center space-y-4">
                <div className="p-4 bg-background border border-border rounded-md shadow-sm">
                  <span className="font-mono text-sm md:text-lg text-foreground break-all select-all">{output}</span>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">128-bit • 32 characters</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground opacity-50">{t('hash_will_appea')}</p>
            )}
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
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
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight"><Info className="h-3 w-3" />{t('security_note')}</div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('md5_is_consider')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
