"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Trash2, Eye, EyeOff, ShieldAlert, Settings2, Info, Download, Share2, RefreshCw, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SAMPLE_ENV = `# Application Configuration
NODE_ENV=production
PORT=3000

# Security & Authentication
JWT_SECRET=super-secret-key-123
API_KEY=x7y8z9a1b2c3d4e5f6
DB_PASSWORD=my-secure-password-2024

# Third Party Services
STRIPE_WEBHOOK_SECRET=whsec_...
AWS_ACCESS_KEY_ID=AKIA...`;

import { ToolNavigation } from '@/components/tool-navigation';

export function EnvCheckerClient() {
  const t = useTranslations('tools.env-checker');
  const tCommon = useTranslations('common');
  const [input, setInput] = useState('');
  const [maskSecrets, setMaskSecrets] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const isEnglish = tCommon('hero.searchPlaceholder' as any) === 'Find a tool...';

  const parseEnv = useCallback((text: string) => {
    return text.split('\n').filter(line => line.trim() && !line.startsWith('#')).map(line => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      const isSecret = /KEY|SECRET|PASSWORD|TOKEN|AUTH|API/i.test(key);
      return { key: key.trim(), value: value.trim(), isSecret };
    });
  }, []);

  const envVars = parseEnv(input);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadEnv = () => {
    const blob = new Blob([input], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `.env-${new Date().getTime()}`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const loadSample = () => {
    setInput(SAMPLE_ENV);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-4">
          {/* Editor Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{tCommon('ui.editor')}</Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-5 px-1.5 text-[9px] gap-1 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-2.5 w-2.5" />
                  {isEnglish ? 'Sample' : 'مثال'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setInput('')} title={tCommon('clear')} className="h-5 w-5 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-background overflow-hidden focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder={t('textareaPlaceholder')}
                className="min-h-[200px] font-mono text-[11px] resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Card>
          </div>

          {/* Validator Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('validatedTitle')}</Label>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={downloadEnv} 
                  disabled={!input}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                  {isEnglish ? 'Export' : 'ایکسپورٹ'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard} 
                  disabled={!input}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {tCommon('copy')}
                </Button>
              </div>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-background overflow-hidden">
              <div className="divide-y divide-border bg-muted/10">
                {envVars.length > 0 ? (
                  envVars.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors group">
                      <div className="space-y-1 overflow-hidden pr-4">
                        <div className="flex items-center gap-2">
                          <code className="text-[11px] font-bold text-foreground truncate">{v.key}</code>
                          {v.isSecret && (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-none text-[8px] h-4 px-1 rounded-sm uppercase tracking-tighter">
                              <Lock className="h-2 w-2 mr-1" />
                              {t('sensitive')}
                            </Badge>
                          )}
                        </div>
                        <code className="text-[10px] text-muted-foreground font-mono block truncate max-w-full">
                          {maskSecrets && v.isSecret ? '••••••••••••••••' : v.value}
                        </code>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center text-muted-foreground text-xs space-y-2 opacity-40 italic">
                    <ShieldAlert className="h-6 w-6 mb-1" />
                    <p>{t('noVars')}</p>
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
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {t('security')}
                </div>
                <Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">{t('maskSecrets')}</Label>
                  <p className="text-[9px] text-muted-foreground leading-tight">{t('maskDesc')}</p>
                </div>
                <Switch checked={maskSecrets} onCheckedChange={setMaskSecrets} className="scale-75 origin-right" />
              </div>
              
              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {isEnglish ? 'Privacy Note' : 'رازداری کا نوٹ'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('article').split('.')[1]}.
                </p>
              </div>

              <Button onClick={() => setInput('')} variant="outline" size="sm" className="w-full h-8 gap-2 text-[10px]">
                <Trash2 className="h-3 w-3" />
                {isEnglish ? 'Clear All' : 'سب صاف کریں'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ToolNavigation currentToolId="env-checker" />
    </div>
  );
}
