'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, FileCode, Copy, RefreshCw, Trash2, Info, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import { parse } from 'smol-toml';
import { cn } from '@/lib/utils';

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

  const stats = {
    chars: input.length,
    lines: input.split('\n').length
  };

  const loadSample = () => {
    const sample = "[project]\nname = \"DevTools Hub\"\nversion = \"1.0.0\"\n\n[author]\nname = \"Antigravity\"\nrole = \"Assistant\"\n\nfeatures = [\n  \"JSON Tools\",\n  \"CSV Tools\",\n  \"Formatting\"\n]";
    setInput(sample);
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('input')}</Label>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] text-muted-foreground/60">{stats.chars} chars • {stats.lines} lines</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {commonT('hero.searchPlaceholder' as any) === 'Find a tool...' ? 'Sample' : 'مثال'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setInput('')} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder={t('placeholder')}
                className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {isValid !== null && (
                <div className={cn(
                  "p-2 border-t text-[10px] font-medium flex items-center gap-2",
                  isValid ? "bg-green-500/5 text-green-600" : "bg-destructive/5 text-destructive"
                )}>
                  {isValid ? (
                    <><CheckCircle2 className="h-3 w-3" /> TOML is valid</>
                  ) : (
                    <><AlertCircle className="h-3 w-3" /> TOML is invalid</>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">JSON {t('output')}</Label>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopyJson} 
                  disabled={!jsonOutput}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  {commonT('copy')} JSON
                </Button>
              </div>
            </div>
            <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
                {error ? (
                  <div className="text-destructive whitespace-pre-wrap text-[10px]">{error}</div>
                ) : jsonOutput ? (
                  <pre className="text-foreground">{jsonOutput}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
                    <FileCode className="h-10 w-10 mb-2" />
                    <p className="text-[10px]">JSON Preview</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {commonT('ui.customization')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <p className="text-[10px] text-muted-foreground leading-tight">
                Validates TOML configuration files in real-time. TOML is commonly used for configuration in languages like Rust and Go.
              </p>
            </CardContent>
          </Card>

          <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              {t('article').split('.')[0]}.
            </p>
          </div>
        </div>
      </div>
      <ToolNavigation currentToolId="toml-validator" />
    </div>
  );
}
