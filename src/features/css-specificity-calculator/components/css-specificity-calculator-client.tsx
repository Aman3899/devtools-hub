"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Info, RefreshCw, Calculator, Hash, Tag, Layers } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function SpecificityCalculatorClient() {
  const t = useTranslations('tools.css-specificity-calculator');
  const commonT = useTranslations('common');

  const [selector, setSelector] = useState('div.container #header ul li:hover');

  const specificity = useMemo(() => {
    let ids = 0, classes = 0, elements = 0;
    let s = selector.trim();
    if (!s) return { ids, classes, elements, score: '0-0-0' };

    // This is a simplified regex-based calculator
    // 1. IDs
    const idMatches = s.match(/#[a-zA-Z0-9_-]+/g);
    if (idMatches) ids = idMatches.length;

    // 2. Classes, pseudo-classes, and attributes
    const classMatches = s.match(/\.[a-zA-Z0-9_-]+|:[a-zA-Z0-9_-]+(\([^)]*\))?|\[[^\]]+\]/g);
    if (classMatches) {
      // Filter out pseudo-elements from class matches if any
      classes = classMatches.filter(m => !m.startsWith('::')).length;
    }

    // 3. Elements and pseudo-elements
    // Remove IDs and classes first to simplify
    let temp = s.replace(/#[a-zA-Z0-9_-]+/g, '')
                .replace(/\.[a-zA-Z0-9_-]+/g, '')
                .replace(/:[a-zA-Z0-9_-]+(\([^)]*\))?/g, '')
                .replace(/\[[^\]]+\]/g, '');
    
    // Pseudo-elements
    const pseudoElemMatches = s.match(/::[a-zA-Z0-9_-]+/g);
    if (pseudoElemMatches) elements += pseudoElemMatches.length;

    // Elements
    const elemMatches = temp.match(/\b[a-zA-Z0-9-]+\b/g);
    if (elemMatches) {
        // Filter out universal selector '*' and common attributes if they leaked
        elements += elemMatches.filter(m => m !== '*' && !/^[0-9]/.test(m)).length;
    }

    return {
      ids,
      classes,
      elements,
      score: `${ids}-${classes}-${elements}`
    };
  }, [selector]);

  const reset = () => setSelector('');

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{t('input_label')}</Label>
            <div className="relative group">
               <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-indigo-500 transition-colors">
                  <Calculator className="h-4 w-4" />
               </div>
               <Input 
                 placeholder="div.container #header ul li:hover"
                 value={selector}
                 onChange={(e) => setSelector(e.target.value)}
                 className="h-12 pl-10 font-mono text-base bg-background border-border shadow-sm focus-visible:ring-indigo-500"
               />
            </div>
          </div>

          {/* Results Area */}
          <div className="grid gap-4 sm:grid-cols-3">
             {[
               { label: t('ids'), value: specificity.ids, icon: Hash, color: 'text-orange-500', bg: 'bg-orange-500/10' },
               { label: t('classes'), value: specificity.classes, icon: Layers, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
               { label: t('elements'), value: specificity.elements, icon: Tag, color: 'text-green-500', bg: 'bg-green-500/10' },
             ].map((item) => (
               <Card key={item.label} className="border border-border shadow-none bg-background overflow-hidden relative group">
                  <div className={`absolute top-0 right-0 p-3 opacity-10 transition-opacity group-hover:opacity-20 ${item.color}`}>
                     <item.icon className="h-8 w-8" />
                  </div>
                  <div className="p-6">
                     <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                     <p className={`text-4xl font-bold tracking-tighter ${item.color}`}>{item.value}</p>
                  </div>
                  <div className={`h-1 w-full ${item.bg}`} />
               </Card>
             ))}
          </div>

          {/* Total Score Area */}
          <Card className="border border-border shadow-none bg-muted/20 p-8 text-center space-y-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                {t('total_specificity')}
             </div>
             <p className="text-6xl font-black tracking-tighter text-foreground tabular-nums">
                {specificity.score}
             </p>
             <p className="text-xs text-muted-foreground max-w-md mx-auto pt-2">
                {t('score_explanation')}
             </p>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-3.5 w-3.5" />
                  {commonT('ui.settings')}
                </div>
                <Button variant="ghost" size="icon" onClick={reset} className="h-6 w-6 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  {t('sidebar_desc')}
                </p>
              </div>
              
              <div className="space-y-3">
                 <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t('quick_examples')}</Label>
                 <div className="grid gap-1.5">
                    {[
                      '#id',
                      '.class',
                      'element',
                      'ul li:first-child',
                      'div.active > span'
                    ].map(ex => (
                      <button 
                        key={ex}
                        onClick={() => setSelector(ex)}
                        className="text-left px-2 py-1.5 rounded bg-muted/50 text-[10px] font-mono hover:bg-indigo-500 hover:text-white transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="css-specificity-calculator" />
    </div>
  );
}
