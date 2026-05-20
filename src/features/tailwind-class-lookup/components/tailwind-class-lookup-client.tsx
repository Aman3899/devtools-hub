"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Search, Filter, Info, Settings2, Zap, Globe } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

const TAILWIND_CLASSES = [
  { category: 'Layout', classes: [
    { name: 'aspect-auto', desc: 'aspect-ratio: auto;' },
    { name: 'container', desc: 'max-width: 100%;' },
    { name: 'columns-1', desc: 'columns: 1;' },
    { name: 'break-after-auto', desc: 'break-after: auto;' },
    { name: 'box-border', desc: 'box-sizing: border-box;' },
    { name: 'block', desc: 'display: block;' },
    { name: 'inline-block', desc: 'display: inline-block;' },
    { name: 'flex', desc: 'display: flex;' },
    { name: 'grid', desc: 'display: grid;' },
    { name: 'hidden', desc: 'display: none;' },
    { name: 'float-right', desc: 'float: right;' },
    { name: 'clear-both', desc: 'clear: both;' },
    { name: 'object-contain', desc: 'object-fit: contain;' },
    { name: 'overflow-hidden', desc: 'overflow: hidden;' },
    { name: 'position-relative', desc: 'position: relative;' },
    { name: 'top-0', desc: 'top: 0px;' },
    { name: 'z-50', desc: 'z-index: 50;' }
  ]},
  { category: 'Flexbox & Grid', classes: [
    { name: 'flex-row', desc: 'flex-direction: row;' },
    { name: 'flex-wrap', desc: 'flex-wrap: wrap;' },
    { name: 'flex-1', desc: 'flex: 1 1 0%;' },
    { name: 'grow', desc: 'flex-grow: 1;' },
    { name: 'shrink', desc: 'flex-shrink: 1;' },
    { name: 'order-first', desc: 'order: -9999;' },
    { name: 'grid-cols-12', desc: 'grid-template-columns: repeat(12, minmax(0, 1fr));' },
    { name: 'gap-4', desc: 'gap: 1rem;' },
    { name: 'justify-center', desc: 'justify-content: center;' },
    { name: 'items-center', desc: 'align-items: center;' },
    { name: 'self-auto', desc: 'align-self: auto;' }
  ]},
  { category: 'Spacing', classes: [
    { name: 'p-4', desc: 'padding: 1rem;' },
    { name: 'px-6', desc: 'padding-left: 1.5rem; padding-right: 1.5rem;' },
    { name: 'm-0', desc: 'margin: 0px;' },
    { name: 'mx-auto', desc: 'margin-left: auto; margin-right: auto;' },
    { name: 'space-x-4', desc: 'margin-left: 1rem (children);' }
  ]},
  { category: 'Sizing', classes: [
    { name: 'w-full', desc: 'width: 100%;' },
    { name: 'w-screen', desc: 'width: 100vw;' },
    { name: 'h-10', desc: 'height: 2.5rem;' },
    { name: 'max-w-7xl', desc: 'max-width: 80rem;' },
    { name: 'min-h-screen', desc: 'min-height: 100vh;' }
  ]},
  { category: 'Typography', classes: [
    { name: 'font-sans', desc: 'font-family: ui-sans-serif, ...' },
    { name: 'text-sm', desc: 'font-size: 0.875rem;' },
    { name: 'font-bold', desc: 'font-weight: 700;' },
    { name: 'tracking-tight', desc: 'letter-spacing: -0.025em;' },
    { name: 'leading-relaxed', desc: 'line-height: 1.625;' },
    { name: 'text-center', desc: 'text-align: center;' },
    { name: 'text-primary', desc: 'color: var(--primary);' },
    { name: 'underline', desc: 'text-decoration: underline;' },
    { name: 'uppercase', desc: 'text-transform: uppercase;' }
  ]},
  { category: 'Backgrounds', classes: [
    { name: 'bg-white', desc: 'background-color: #ffffff;' },
    { name: 'bg-gradient-to-r', desc: 'background-image: linear-gradient(to right, ...);' },
    { name: 'bg-cover', desc: 'background-size: cover;' },
    { name: 'bg-no-repeat', desc: 'background-repeat: no-repeat;' }
  ]}
];

export function TailwindClassLookupClient() {
  const t = useTranslations('tools.tailwind-class-lookup');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search) return TAILWIND_CLASSES;
    const query = search.toLowerCase();
    return TAILWIND_CLASSES.map(cat => ({
      ...cat,
      classes: cat.classes.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.desc.toLowerCase().includes(query) ||
        cat.category.toLowerCase().includes(query)
      )
    })).filter(cat => cat.classes.length > 0);
  }, [search]);

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-6">
        {/* Search Header */}
        <ToolCard 
          title={t('search')} 
          action={<span className="text-[10px] text-muted-foreground">{filteredData.reduce((acc, cat) => acc + cat.classes.length, 0)} {t('results')}</span>}
          contentClassName="p-4"
        >
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input 
              placeholder={t('placeholder')}
              className="pl-10 h-12 text-sm bg-background border-border shadow-sm focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </ToolCard>

        {/* Cheatsheet Grid */}
        <div className="space-y-8">
          {filteredData.map((cat) => (
            <div key={cat.category} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                <Filter className="h-3 w-3" />
                {cat.category}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {cat.classes.map((c) => (
                  <Card 
                    key={c.name} 
                    className="group p-3 hover:border-primary/50 transition-all cursor-pointer bg-background border-border shadow-none overflow-hidden relative"
                    onClick={() => copyToClipboard(c.name, c.name)}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="space-y-1">
                        <code className="text-xs font-bold text-primary font-mono">{c.name}</code>
                        <p className="text-[10px] text-muted-foreground font-mono leading-tight truncate max-w-[200px] md:max-w-none">
                          {c.desc}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedType === c.name ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                      </div>
                    </div>
                    <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Zap className="h-16 w-16 rotate-12" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed border-border">
              <Search className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t('no_results')} "{search}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Settings */}
      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.info')} icon={Settings2} contentClassName="p-4 space-y-4">
          <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              {t('sidebar_desc')}
            </p>
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">{t('quick_tips')}</Label>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2 rounded bg-primary/5 border border-primary/10">
                <Zap className="h-3 w-3 text-primary mt-0.5" />
                <p className="text-[10px] leading-tight text-muted-foreground">{t('tip_copy')}</p>
              </div>
              <div className="flex items-start gap-2 p-2 rounded bg-blue-500/5 border border-blue-500/10">
                <Globe className="h-3 w-3 text-blue-500 mt-0.5" />
                <p className="text-[10px] leading-tight text-muted-foreground">{t('tip_search')}</p>
              </div>
            </div>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
