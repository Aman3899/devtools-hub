"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Settings2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ToolCard } from '@/components/layout/tool-card';
import { DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

const SAMPLE = `# Sample Markdown\n\n## Typography\n\n**Bold text**, *italic text*, and ~~strikethrough~~.\n\n### Lists\n\n- Item 1\n- Item 2\n  - Sub-item A\n\n1. First\n2. Second\n\n### Code Blocks\n\n\`\`\`javascript\nconst hello = "world";\nconsole.log(hello);\n\`\`\`\n\n> This is a blockquote.\n\n[Visit DevTools Hub](https://devtools-hub.com)`;

export function MarkdownPreviewerClient() {
  const t = useTranslations('tools.markdown-previewer');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard
          title={<StatsDisplay title={t('input_label')} stats={{ chars: input.length, lines: input.split('\n').length }} />}
          action={<ToolActions onSample={() => setInput(SAMPLE)} onClear={() => setInput('')} />}
          contentClassName="p-0 flex flex-col h-[600px]"
        >
          <CodeTextarea placeholder={t('placeholder')} value={input} onChange={setInput} />
        </ToolCard>

        <ToolCard
          title={t('output_label')}
          action={<DownloadButton content={input} filename="document.md" mimeType="text/markdown" />}
          contentClassName="p-0 flex flex-col h-[600px] bg-muted/10"
        >
          <div className="flex-1 overflow-auto p-4 prose dark:prose-invert prose-xs max-w-none prose-p:my-1 prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0">
            {input
              ? <ReactMarkdown>{input}</ReactMarkdown>
              : <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30"><Eye className="h-10 w-10 mb-2" /><p className="text-[10px]">Preview Area</p></div>
            }
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-5">
          <p className="text-[10px] text-muted-foreground leading-tight">Live Markdown previewer with GitHub Flavored Markdown (GFM) support.</p>
          <InfoBox>{t('article').split('.')[0]}.</InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
