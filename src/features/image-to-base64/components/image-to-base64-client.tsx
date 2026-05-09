'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Upload, Trash2, Image as ImageIcon, Settings2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function ImageToBase64Client() {
  const t = useTranslations('tools.image-to-base64');
  const tCommon = useTranslations('common');
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [format, setFormat] = useState('data-uri');
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getOutput = () => {
    if (!base64) return '';
    if (format === 'raw') return base64.split(',')[1];
    if (format === 'css') return `background-image: url("${base64}");`;
    return base64;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setBase64('');
    setPreview(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden min-h-[400px] flex flex-col items-center justify-center relative group">
          {preview ? (
            <>
              <img src={preview} alt="Preview" className="max-h-[300px] rounded-2xl shadow-2xl transition-transform group-hover:scale-[1.02]" />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="secondary" size="icon" onClick={clear} className="rounded-xl bg-background/50 backdrop-blur-md hover:bg-destructive hover:text-white transition-all">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="h-24 w-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto border border-dashed border-primary/20">
                <Upload className="h-10 w-10 text-primary/40" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold">{t('dropHint')}</p>
                <p className="text-sm text-muted-foreground">{t('limit')}</p>
              </div>
              <label className="cursor-pointer">
                <Button variant="default" className="rounded-xl px-8 h-12 gap-2 shadow-lg shadow-primary/20 pointer-events-none">
                  <ImageIcon className="h-4 w-4" />
                  {t('selectImage')}
                </Button>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          )}
        </Card>

        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('outputTitle')}</CardTitle>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!base64} className="rounded-xl gap-2 h-8">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {tCommon('copy')}
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <pre className="h-32 p-4 rounded-2xl bg-muted/30 font-mono text-[10px] overflow-auto border border-muted-foreground/5 whitespace-pre-wrap break-all leading-relaxed">
              {getOutput() || t('placeholder')}
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              {tCommon('ui.settings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground px-1">{t('outputFormat')}</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="rounded-xl bg-muted/30 border-muted-foreground/10 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="data-uri">{t('dataUri')}</SelectItem>
                  <SelectItem value="raw">{t('raw')}</SelectItem>
                  <SelectItem value="css">{t('css')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t('privacyNote')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
