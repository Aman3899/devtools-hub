"use client"

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertCircle, FileCode, Settings2 } from 'lucide-react';
import yaml from 'js-yaml';
import { cn } from '@/lib/utils';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useLanguage } from '@/hooks/tool';

export function YamlValidatorClient() {
  const t = useTranslations('tools.yaml-validator');
  const commonT = useTranslations('common');
  const { isEnglish } = useLanguage();

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
      const parsed = yaml.load(input);
      setIsValid(true);
      setError(null);
      setJsonOutput(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setIsValid(false);
      setError(e.message);
      setJsonOutput('');
    }
  }, [input]);

  const stats = {
    chars: input.length,
    lines: input.split('\n').length
  };

  const loadSample = () => {
    const sample = "project: DevTools Hub\nversion: 1.0.0\nauthor:\n  name: Antigravity\n  role: Assistant\nfeatures:\n  - JSON Tools\n  - CSV Tools\n  - Formatting";
    setInput(sample);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        {/* Input Area */}
        <ToolCard 
          title={<StatsDisplay title={t('input')} stats={{ chars: stats.chars, lines: stats.lines }} />}
          action={<ToolActions onSample={loadSample} onClear={() => setInput('')} />}
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <CodeTextarea
            placeholder={t('placeholder')}
            value={input}
            onChange={(val) => setInput(val)}
          />
          {isValid !== null && (
            <div className={cn(
              "p-2 border-t text-[10px] font-medium flex items-center gap-2",
              isValid ? "bg-green-500/5 text-green-600" : "bg-destructive/5 text-destructive"
            )}>
              {isValid ? (
                <><CheckCircle2 className="h-3 w-3" /> YAML is valid</>
              ) : (
                <><AlertCircle className="h-3 w-3" /> YAML is invalid</>
              )}
            </div>
          )}
        </ToolCard>

        {/* Output Area */}
        <ToolCard 
          title={`JSON ${t('output')}`}
          action={
            <CopyButton text={jsonOutput} type="json" disabled={!jsonOutput} />
          }
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20"
        >
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
        </ToolCard>
      </div>

      {/* Sidebar */}
      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-5">
          <p className="text-[10px] text-muted-foreground leading-tight">
            Validates YAML 1.2 syntax in real-time. Displays structural errors with line numbers and provides a JSON preview of the parsed content.
          </p>
        </ToolCard>

        <InfoBox>
          {t('article').split('.')[0]}.
        </InfoBox>
      </div>
    </div>
  );
}
