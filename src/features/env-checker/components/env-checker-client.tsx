'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Trash2, Eye, EyeOff, ShieldAlert, Settings2, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export function EnvCheckerClient() {
  const t = useTranslations('tools.env-checker');
  const tCommon = useTranslations('common');
  const [input, setInput] = useState('');
  const [maskSecrets, setMaskSecrets] = useState(true);
  const [copied, setCopied] = useState(false);

  const parseEnv = (text: string) => {
    return text.split('\n').filter(line => line.trim() && !line.startsWith('#')).map(line => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      const isSecret = /KEY|SECRET|PASSWORD|TOKEN|AUTH|API/i.test(key);
      return { key: key.trim(), value: value.trim(), isSecret };
    });
  };

  const envVars = parseEnv(input);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{tCommon('ui.editor')}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setInput('')} className="rounded-xl">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Textarea
              placeholder={t('textareaPlaceholder')}
              className="min-h-[200px] font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-muted/30 rounded-2xl"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-muted-foreground/5">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('validatedTitle')}</CardTitle>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!input} className="rounded-xl gap-2 h-8">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {tCommon('copy')}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-muted-foreground/5">
              {envVars.length > 0 ? (
                envVars.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-black text-foreground">{v.key}</code>
                        {v.isSecret && (
                          <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-none text-[8px] h-4">
                            {t('sensitive')}
                          </Badge>
                        )}
                      </div>
                      <code className="text-[10px] text-muted-foreground font-mono block truncate max-w-[400px]">
                        {maskSecrets && v.isSecret ? '••••••••••••••••' : v.value}
                      </code>
                    </div>
                    {v.isSecret && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => {}}>
                        {maskSecrets ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-32 flex flex-col items-center justify-center text-muted-foreground text-xs space-y-2 opacity-50">
                  <ShieldAlert className="h-6 w-6" />
                  <p>{t('noVars')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              {tCommon('ui.privacy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('maskSecrets')}</Label>
                <p className="text-[10px] text-muted-foreground">{t('maskDesc')}</p>
              </div>
              <Switch checked={maskSecrets} onCheckedChange={setMaskSecrets} />
            </div>
            
            <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Info className="h-3 w-3" />
                {t('security')}
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t('securityDesc')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
