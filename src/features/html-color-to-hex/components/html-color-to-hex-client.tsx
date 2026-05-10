'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, Info, Code, Play } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function HtmlColorToHexClient() {
  const t = useTranslations('tools.html-color-to-hex');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  
  const isEnglish = commonT('hero.searchPlaceholder' as any) === 'Find a tool...';

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-4">
          <Card className="flex flex-col min-h-[400px] border border-border shadow-none rounded-md overflow-hidden bg-background">
            <div className="p-12 flex flex-col items-center justify-center text-center flex-1 space-y-4 text-muted-foreground">
              <Code className="h-12 w-12 opacity-20" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">{isEnglish ? 'Development in Progress' : 'ترقی جاری ہے'}</h3>
                <p className="text-sm max-w-md mx-auto">{isEnglish ? 'The advanced UI for this tool is currently being built. Check back soon for the complete functional version.' : 'اس ٹول کے لیے اعلی درجے کا UI فی الحال تیار کیا جا رہا ہے۔ مکمل فنکشنل ورژن کے لیے جلد ہی دوبارہ چیک کریں۔'}</p>
              </div>
              <Button variant="outline" className="mt-4" onClick={() => setInput('Sample data loaded')}>
                <Play className="h-4 w-4 mr-2" />
                {isEnglish ? 'Test State' : 'ٹیسٹ اسٹیٹ'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {commonT('ui.customization')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {isEnglish ? 'Info' : 'معلومات'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('description') || (isEnglish ? 'This tool will be available shortly.' : 'یہ ٹول جلد ہی دستیاب ہوگا۔')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="html-color-to-hex" />
    </div>
  );
}
