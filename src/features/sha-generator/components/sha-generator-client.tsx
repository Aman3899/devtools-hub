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

export function ShaGeneratorClient() {
  const t = useTranslations('tools.sha-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({ sha1: '', sha256: '', sha512: '' });
  const [isFileMode, setIsFileMode] = useState(false);
  const [fileName, setFileName] = useState('');

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

  const loadSample = () => {
    setIsFileMode(false);
    setFileName('');
    const sample = 'Hello, DevTools Hub!';
    setInput(sample);
    processText(sample);
  };

  const clear = () => {
    setInput('');
    setHashes({ sha1: '', sha256: '', sha512: '' });
    setIsFileMode(false);
    setFileName('');
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        {/* Input Area */}
        <ToolCard 
          title={commonT('input')}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                <RefreshCw className="h-3 w-3" />
                {t('sample')}
              </Button>
              <Button variant="ghost" size="icon" onClick={clear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          }
          contentClassName="p-0 flex flex-col h-[200px] relative"
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

        {/* Outputs Area */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* SHA-1 */}
          <ToolCard 
            title="SHA-1"
            action={
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(hashes.sha1, 'sha1')} disabled={!hashes.sha1} className="h-6 px-2 text-[10px] gap-1.5 transition-colors">
                {copiedType === 'sha1' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            }
            contentClassName="p-4 flex flex-col h-[120px] justify-center bg-muted/20"
          >
            {hashes.sha1 ? (
              <span className="font-mono text-xs text-foreground break-all">{hashes.sha1}</span>
            ) : (
              <span className="text-xs text-muted-foreground opacity-50 text-center">SHA-1 Hash</span>
            )}
          </ToolCard>
          
          {/* SHA-256 */}
          <ToolCard 
            title="SHA-256"
            action={
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(hashes.sha256, 'sha256')} disabled={!hashes.sha256} className="h-6 px-2 text-[10px] gap-1.5 transition-colors">
                {copiedType === 'sha256' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            }
            contentClassName="p-4 flex flex-col h-[120px] justify-center bg-muted/20"
          >
            {hashes.sha256 ? (
              <span className="font-mono text-xs text-foreground break-all">{hashes.sha256}</span>
            ) : (
              <span className="text-xs text-muted-foreground opacity-50 text-center">SHA-256 Hash</span>
            )}
          </ToolCard>

          {/* SHA-512 */}
          <ToolCard 
            title="SHA-512"
            action={
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(hashes.sha512, 'sha512')} disabled={!hashes.sha512} className="h-6 px-2 text-[10px] gap-1.5 transition-colors">
                {copiedType === 'sha512' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            }
            contentClassName="p-4 flex flex-col min-h-[120px] justify-center bg-muted/20 sm:col-span-2"
          >
            {hashes.sha512 ? (
              <span className="font-mono text-xs text-foreground break-all">{hashes.sha512}</span>
            ) : (
              <span className="text-xs text-muted-foreground opacity-50 text-center">SHA-512 Hash</span>
            )}
          </ToolCard>
        </div>
      </div>

      {/* Sidebar Settings */}
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
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
              <Info className="h-3 w-3" />
              {t('security_note')}
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {t('sha_256_and_sha')}
            </p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
