'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, Info, Copy, Check, Upload, Image as ImageIcon, ScanLine, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import jsQR from 'jsqr';

export function QrcodeDecoderClient() {
  const t = useTranslations('tools.qrcode-decoder');
  const commonT = useTranslations('common');
  
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((file: File) => {
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setOutput('');
    setIsDecoding(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          setIsDecoding(false);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setOutput(code.data);
          toast.success(commonT('success'));
        } else {
          setOutput('');
          toast.error(t('no_qr_found'));
        }
        setIsDecoding(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [t, commonT]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(commonT('copied'));
  };

  const clear = () => {
    setOutput('');
    setFileName('');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('upload_qr')}</Label>
              <Button variant="ghost" size="icon" onClick={clear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            <Card className="flex flex-col h-[400px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              {!previewUrl ? (
                <Label className="flex-1 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-muted/10 transition-colors">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Upload className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{t('upload_desc')}</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG</p>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </Label>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
                  <img src={previewUrl} alt="QR Code Preview" className="max-h-[250px] max-w-full object-contain border border-border rounded-md shadow-sm" />
                  <p className="text-xs font-medium mt-4 truncate max-w-[200px]">{fileName}</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="h-4 w-4 mr-2" /> Replace Image
                  </Button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              )}
            </Card>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('decoded_result')}</Label>
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
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                {isDecoding ? (
                  <div className="flex flex-col items-center text-muted-foreground space-y-2">
                    <ScanLine className="h-8 w-8 animate-pulse text-primary" />
                    <span className="font-medium text-sm">{t('decoding')}</span>
                  </div>
                ) : output ? (
                  <Textarea
                    readOnly
                    className="flex-1 w-full font-mono text-sm resize-none border-none focus-visible:ring-0 bg-transparent leading-relaxed text-[#98c379]"
                    value={output}
                  />
                ) : (
                  <div className="text-center space-y-2 text-muted-foreground opacity-50">
                    <ScanLine className="h-12 w-12 mx-auto" />
                    <p className="text-sm">{t('no_qr_found')}</p>
                  </div>
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
      <ToolNavigation currentToolId="qrcode-decoder" />
    </div>
  );
}
