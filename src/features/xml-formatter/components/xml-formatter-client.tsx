"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Code, Settings2 } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useLanguage } from '@/hooks/tool';

export function XmlFormatterClient() {
  const t = useTranslations('tools.xml-formatter');
  const commonT = useTranslations('common');
  const { isEnglish } = useLanguage();

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const format = () => {
    try {
      let formatted = '';
      let indent = '';
      const tab = '  ';
      input.split(/>\s*</).forEach(node => {
        if (node.match(/^\/\w/)) indent = indent.substring(tab.length);
        formatted += indent + '<' + node + '>\r\n';
        if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab;
      });
      setOutput(formatted.substring(1, formatted.length - 3));
    } catch (e) {
      setOutput('Invalid XML');
    }
  };

  const stats = {
    chars: input.length,
    lines: input.split('\n').length
  };

  const loadSample = () => {
    const sample = '<?xml version="1.0" encoding="UTF-8"?><note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don\'t forget me this weekend!</body></note>';
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
          <div className="p-2 border-t bg-muted/5">
            <Button className="w-full h-8 text-xs" onClick={format} disabled={!input}>
              <Code className="h-3.5 w-3.5 mr-2" />
              {t('format')}
            </Button>
          </div>
        </ToolCard>

        {/* Result Area */}
        <ToolCard 
          title={commonT('ui.result')}
          action={
            <CopyButton text={output || input} type="output" disabled={!output && !input} />
          }
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20"
        >
          <pre className="flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed text-foreground bg-transparent">
            {output || input || commonT('ui.result')}
          </pre>
        </ToolCard>
      </div>

      {/* Sidebar */}
      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-5">
          <p className="text-[10px] text-muted-foreground leading-tight">
            XML formatting applies standard 2-space indentation and clean line breaks for improved readability.
          </p>
        </ToolCard>

        <InfoBox>
          {t('article').split('.')[0]}.
        </InfoBox>
      </div>
    </div>
  );
}
