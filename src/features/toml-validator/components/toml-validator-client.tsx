'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, FileCode, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import { parse } from 'smol-toml';

export function TomlValidatorClient() {
  const t = useTranslations('tools.toml-validator');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jsonOutput, setJsonOutput] = useState<string>('');

  useEffect(() => {
    if (!input.trim()) {
      setIsValid(null);
      setError(null);
      setJsonOutput('');
      return;
    }

    try {
      const parsed = parse(input);
      setIsValid(true);
      setError(null);
      setJsonOutput(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setIsValid(false);
      setError(e.message);
      setJsonOutput('');
    }
  }, [input]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonOutput);
    toast.success(commonT('copied'));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="toml-input">{t('input')}</Label>
              {isValid === true && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {commonT('success')}
                </Badge>
              )}
              {isValid === false && (
                <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {commonT('error')}
                </Badge>
              )}
            </div>
            <Textarea
              id="toml-input"
              placeholder={t('placeholder')}
              className="min-h-[400px] font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('output')}</Label>
              {jsonOutput && (
                <button 
                  onClick={handleCopyJson}
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  {commonT('copy')} JSON
                </button>
              )}
            </div>
            <div className="min-h-[400px] rounded-md border bg-muted/30 p-4 font-mono text-sm overflow-auto relative">
              {error ? (
                <Alert variant="destructive" className="border-none bg-transparent p-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-mono text-xs whitespace-pre-wrap">
                    {error}
                  </AlertDescription>
                </Alert>
              ) : jsonOutput ? (
                <pre className="text-foreground">{jsonOutput}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
                  <FileCode className="h-8 w-8" />
                  <p className="text-xs">{t('placeholder')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <ToolNavigation currentToolId="toml-validator" />
    </div>
  );
}
