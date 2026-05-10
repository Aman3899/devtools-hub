"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Copy, Check, Search, Info, ExternalLink } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

const TAILWIND_DATA = [
  {
    category: 'Layout',
    classes: [
      { name: 'container', css: 'width: 100%;' },
      { name: 'block', css: 'display: block;' },
      { name: 'inline-block', css: 'display: inline-block;' },
      { name: 'inline', css: 'display: inline;' },
      { name: 'flex', css: 'display: flex;' },
      { name: 'inline-flex', css: 'display: inline-flex;' },
      { name: 'grid', css: 'display: grid;' },
      { name: 'hidden', css: 'display: none;' },
      { name: 'float-right', css: 'float: right;' },
      { name: 'float-left', css: 'float: left;' },
    ]
  },
  {
    category: 'Spacing',
    classes: [
      { name: 'p-0', css: 'padding: 0px;' },
      { name: 'p-4', css: 'padding: 1rem;' },
      { name: 'm-0', css: 'margin: 0px;' },
      { name: 'm-4', css: 'margin: 1rem;' },
      { name: 'mx-auto', css: 'margin-left: auto; margin-right: auto;' },
      { name: 'space-x-4', css: 'margin-left: 1rem;' },
      { name: 'space-y-4', css: 'margin-top: 1rem;' },
    ]
  },
  {
    category: 'Flex/Grid',
    classes: [
      { name: 'flex-row', css: 'flex-direction: row;' },
      { name: 'flex-col', css: 'flex-direction: column;' },
      { name: 'flex-wrap', css: 'flex-wrap: wrap;' },
      { name: 'justify-start', css: 'justify-content: flex-start;' },
      { name: 'justify-center', css: 'justify-content: center;' },
      { name: 'justify-between', css: 'justify-content: space-between;' },
      { name: 'items-center', css: 'align-items: center;' },
      { name: 'grid-cols-1', css: 'grid-template-columns: repeat(1, minmax(0, 1fr));' },
      { name: 'gap-4', css: 'gap: 1rem;' },
    ]
  },
  {
    category: 'Typography',
    classes: [
      { name: 'text-xs', css: 'font-size: 0.75rem; line-height: 1rem;' },
      { name: 'text-sm', css: 'font-size: 0.875rem; line-height: 1.25rem;' },
      { name: 'text-base', css: 'font-size: 1rem; line-height: 1.5rem;' },
      { name: 'text-lg', css: 'font-size: 1.125rem; line-height: 1.75rem;' },
      { name: 'font-bold', css: 'font-weight: 700;' },
      { name: 'text-center', css: 'text-align: center;' },
      { name: 'italic', css: 'font-style: italic;' },
      { name: 'underline', css: 'text-decoration: underline;' },
    ]
  },
  {
    category: 'Effects',
    classes: [
      { name: 'shadow-sm', css: 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);' },
      { name: 'shadow', css: 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);' },
      { name: 'shadow-lg', css: 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);' },
      { name: 'opacity-50', css: 'opacity: 0.5;' },
      { name: 'rounded', css: 'border-radius: 0.25rem;' },
      { name: 'rounded-lg', css: 'border-radius: 0.5rem;' },
    ]
  }
];

export function TailwindLookupClient() {
  const t = useTranslations('tools.tailwind-class-lookup');
  const commonT = useTranslations('common');

  const [search, setSearch] = useState('');
  const [copiedClass, setCopiedClass] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    if (!search) return TAILWIND_DATA;
    const s = search.toLowerCase();
    return TAILWIND_DATA.map(cat => ({
      ...cat,
      classes: cat.classes.filter(c => 
        c.name.toLowerCase().includes(s) || 
        cat.category.toLowerCase().includes(s) ||
        c.css.toLowerCase().includes(s)
      )
    })).filter(cat => cat.classes.length > 0);
  }, [search]);

  const copyClass = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedClass(name);
    setTimeout(() => setCopiedClass(null), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
           <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-indigo-500 transition-colors">
                <Search className="h-4 w-4" />
              </div>
              <Input 
                placeholder={t('search_placeholder')} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pl-10 bg-background border-border shadow-sm text-base focus-visible:ring-indigo-500"
              />
           </div>
           <div className="flex flex-wrap justify-center gap-2">
              {['flex', 'grid', 'padding', 'margin', 'font', 'shadow'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="px-3 py-1 rounded-full bg-muted/50 border border-border text-[10px] font-medium text-muted-foreground hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all"
                >
                  {tag}
                </button>
              ))}
           </div>
        </div>

        {/* Classes Grid */}
        <div className="grid gap-8">
           {filteredData.length > 0 ? (
             filteredData.map((cat) => (
               <div key={cat.category} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-bold tracking-tight shrink-0">{cat.category}</h3>
                    <div className="h-px w-full bg-border" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                     {cat.classes.map((c) => (
                       <Card 
                         key={c.name} 
                         className="group border border-border shadow-none hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all cursor-pointer overflow-hidden"
                         onClick={() => copyClass(c.name)}
                       >
                          <div className="p-3 space-y-2">
                             <div className="flex items-center justify-between">
                                <code className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{c.name}</code>
                                {copiedClass === c.name ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                             </div>
                             <p className="text-[10px] font-mono text-muted-foreground truncate">{c.css}</p>
                          </div>
                       </Card>
                     ))}
                  </div>
               </div>
             ))
           ) : (
             <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed border-border">
                <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-sm text-muted-foreground">{t('no_results')}</p>
             </div>
           )}
        </div>

        {/* Documentation Link */}
        <Card className="border-border shadow-none bg-indigo-500/5 border-indigo-500/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                 <img src="https://tailwindcss.com/favicons/favicon-32x32.png?v=3" alt="Tailwind" className="w-6 h-6 invert brightness-0" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-sm font-bold">{t('official_docs')}</h4>
                 <p className="text-xs text-muted-foreground">{t('docs_desc')}</p>
              </div>
           </div>
           <Button variant="outline" className="gap-2 h-9 text-xs" asChild>
              <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer">
                 {t('view_docs')}
                 <ExternalLink className="h-3 w-3" />
              </a>
           </Button>
        </Card>
      </div>
      <ToolNavigation currentToolId="tailwind-class-lookup" />
    </div>
  );
}
