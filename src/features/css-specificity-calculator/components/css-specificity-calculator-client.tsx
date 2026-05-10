"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Settings2, Info, RefreshCw, Hash, MousePointer2, Tag, Zap } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';
import { toast } from 'sonner';

export function CssSpecificityCalculatorClient() {
  const t = useTranslations('tools.css-specificity-calculator');
  const commonT = useTranslations('common');

  const [selector, setSelector] = useState('div.container #main-content:hover');
  const [copied, setCopied] = useState(false);

  const specificity = useMemo(() => {
    if (!selector.trim()) return { id: 0, class: 0, element: 0 };

    let ids = 0;
    let classes = 0;
    let elements = 0;

    // Remove pseudo-elements (they count as elements)
    const pseudoElements = /::(before|after|first-line|first-letter|selection|backdrop|placeholder|marker|spelling-error|grammar-error)/g;
    const peMatches = selector.match(pseudoElements) || [];
    elements += peMatches.length;
    let s = selector.replace(pseudoElements, ' ');

    // IDs
    const idMatches = s.match(/#[a-zA-Z0-9_-]+/g) || [];
    ids = idMatches.length;
    s = s.replace(/#[a-zA-Z0-9_-]+/g, ' ');

    // Classes, pseudo-classes, attributes
    const classMatches = s.match(/\.[a-zA-Z0-9_-]+/g) || [];
    const pseudoClasses = /:[a-zA-Z0-9_-]+(\([^)]*\))?/g;
    const pcMatches = (s.match(pseudoClasses) || []).filter(m => !m.startsWith('::'));
    const attrMatches = s.match(/\[[^\]]+\]/g) || [];
    
    classes = classMatches.length + pcMatches.length + attrMatches.length;
    s = s.replace(/\.[a-zA-Z0-9_-]+/g, ' ');
    s = s.replace(pseudoClasses, ' ');
    s = s.replace(/\[[^\]]+\]/g, ' ');

    // Elements
    const elementMatches = s.match(/[a-zA-Z0-9-]+/g) || [];
    elements += elementMatches.length;

    return { id: ids, class: classes, element: elements };
  }, [selector]);

  const copyScore = () => {
    navigator.clipboard.writeText(`${specificity.id}-${specificity.class}-${specificity.element}`);
    setCopied(true);
    toast.success(commonT('copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('selector')}</Label>
              <Button variant="ghost" size="icon" onClick={() => setSelector('')} className="h-6 w-6 text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="relative group">
               <MousePointer2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
               <Input 
                 placeholder=".my-class #my-id"
                 className="pl-10 h-12 text-sm bg-background border-border shadow-sm font-mono"
                 value={selector}
                 onChange={(e) => setSelector(e.target.value)}
               />
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid gap-4 md:grid-cols-3">
             <Card className="p-6 flex flex-col items-center gap-3 bg-background border border-border shadow-none group hover:border-blue-500/50 transition-colors">
                <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                   <Hash className="h-6 w-6" />
                </div>
                <div className="text-center">
                   <div className="text-3xl font-black">{specificity.id}</div>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('ids')}</div>
                </div>
             </Card>
             <Card className="p-6 flex flex-col items-center gap-3 bg-background border border-border shadow-none group hover:border-purple-500/50 transition-colors">
                <div className="p-3 rounded-full bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                   <Zap className="h-6 w-6" />
                </div>
                <div className="text-center">
                   <div className="text-3xl font-black">{specificity.class}</div>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('classes')}</div>
                </div>
             </Card>
             <Card className="p-6 flex flex-col items-center gap-3 bg-background border border-border shadow-none group hover:border-amber-500/50 transition-colors">
                <div className="p-3 rounded-full bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                   <Tag className="h-6 w-6" />
                </div>
                <div className="text-center">
                   <div className="text-3xl font-black">{specificity.element}</div>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('elements')}</div>
                </div>
             </Card>
          </div>

          {/* Detailed Explanation */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('output')}</Label>
              <Button variant="ghost" size="sm" onClick={copyScore} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                Copy Score
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-muted/20 p-6 flex items-center justify-center gap-12">
               <div className="flex flex-col items-center">
                  <span className="text-6xl font-black tracking-tighter text-foreground">
                    {specificity.id}<span className="text-muted-foreground/30">,</span>{specificity.class}<span className="text-muted-foreground/30">,</span>{specificity.element}
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Specificity Score</p>
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
                  {commonT('ui.info')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  {t('sidebar_desc')}
                </p>
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">How it works</Label>
                 <ul className="text-[10px] text-muted-foreground space-y-1.5 list-disc pl-4">
                    <li>IDs (#id) give 1-0-0 score.</li>
                    <li>Classes (.class), pseudo-classes (:hover), and attributes ([type]) give 0-1-0 score.</li>
                    <li>Elements (div, p) and pseudo-elements (::before) give 0-0-1 score.</li>
                    <li>Inline styles always win (1-0-0-0) but aren't part of this calculator.</li>
                 </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="css-specificity-calculator" />
    </div>
  );
}
