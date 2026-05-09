"use client"

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Upload, Trash2, Image as ImageIcon, Settings2, Download, Share2, Info, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { ToolNavigation } from '@/components/tool-navigation';

export function ImageToBase64Client() {
  const t = useTranslations('tools.image-to-base64');
  const tCommon = useTranslations('common');
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [format, setFormat] = useState('data-uri');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const isEnglish = tCommon('hero.searchPlaceholder' as any) === 'Find a tool...';

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

  const downloadBase64 = () => {
    const blob = new Blob([getOutput()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-base64-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const clear = () => {
    setBase64('');
    setPreview(null);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-4">
          {/* Upload & Preview Card */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{t('dropHint')}</Label>
            <Card 
              className={cn(
                "border border-border shadow-none rounded-md bg-background overflow-hidden min-h-[300px] flex flex-col items-center justify-center relative transition-colors",
                !preview && "border-dashed border-2 hover:border-foreground/20"
              )}
            >
              {preview ? (
                <div className="p-6 flex flex-col items-center gap-4">
                  <img src={preview} alt="Preview" className="max-h-[250px] rounded border border-border shadow-sm object-contain" />
                  <Button variant="ghost" size="sm" onClick={clear} className="h-7 text-[10px] text-muted-foreground hover:text-destructive gap-1.5">
                    <Trash2 className="h-3 w-3" />
                    {isEnglish ? 'Remove Image' : 'تصویر ہٹائیں'}
                  </Button>
                </div>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-10 text-center group">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-muted/80 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold">{t('selectImage')}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight">{t('limit')}</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </Card>
          </div>

          {/* Output Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('outputTitle')}</Label>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={downloadBase64} 
                  disabled={!base64}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                  {isEnglish ? 'Export' : 'ایکسپورٹ'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard} 
                  disabled={!base64}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {tCommon('copy')}
                </Button>
              </div>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-background overflow-hidden">
              <div className="p-2 border-b bg-muted/30 flex items-center gap-2 h-9">
                <FileText className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight">{isEnglish ? 'Encoded Data' : 'انکوڈ شدہ ڈیٹا'}</span>
              </div>
              <CardContent className="p-0">
                <pre className="h-40 p-3 bg-muted/10 font-mono text-[10px] overflow-auto leading-relaxed text-foreground/80 break-all">
                  {getOutput() || t('placeholder')}
                </pre>
              </CardContent>
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
                  {isEnglish ? 'Options' : 'آپشنز'}
                </div>
                <Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight">{t('outputFormat')}</Label>
                <Select value={format} onValueChange={(v) => v && setFormat(v)}>
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data-uri" className="text-xs">{t('dataUri')}</SelectItem>
                    <SelectItem value="raw" className="text-xs">{t('raw')}</SelectItem>
                    <SelectItem value="css" className="text-xs">{t('css')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {isEnglish ? 'Privacy note' : 'رازداری کا نوٹ'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('privacyNote')} {isEnglish ? 'All conversion is performed locally in your browser.' : 'تمام تبدیلی آپ کے براؤزر میں مقامی طور پر کی جاتی ہے۔'}
                </p>
              </div>

              <Button onClick={clear} variant="outline" size="sm" className="w-full h-8 gap-2 text-[10px]">
                <Trash2 className="h-3 w-3" />
                {isEnglish ? 'Clear Selection' : 'سلیکشن صاف کریں'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ToolNavigation currentToolId="image-to-base64" />
    </div>
  );
}
