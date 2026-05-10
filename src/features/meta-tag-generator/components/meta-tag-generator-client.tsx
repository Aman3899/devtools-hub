'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, Settings2, Info, Check, Globe, Share2 } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function MetaTagGeneratorClient() {
  const t = useTranslations('tools.meta-tag-generator');
  const commonT = useTranslations('common');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    og: true,
    twitter: true,
  });
  
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generateTags = useCallback(() => {
    let tags = [];
    
    // Primary Meta Tags
    tags.push('<!-- Primary Meta Tags -->');
    tags.push(`<title>${formData.title || t('default_title')}</title>`);
    tags.push(`<meta name="title" content="${formData.title || ''}">`);
    tags.push(`<meta name="description" content="${formData.description || ''}">`);
    if (formData.keywords) {
      tags.push(`<meta name="keywords" content="${formData.keywords}">`);
    }
    if (formData.author) {
      tags.push(`<meta name="author" content="${formData.author}">`);
    }
    
    // Open Graph / Facebook
    if (formData.og) {
      tags.push('\n<!-- Open Graph / Facebook -->');
      tags.push('<meta property="og:type" content="website">');
      tags.push(`<meta property="og:title" content="${formData.title || ''}">`);
      tags.push(`<meta property="og:description" content="${formData.description || ''}">`);
      tags.push('<meta property="og:image" content="https://example.com/image.png">');
    }
    
    // Twitter
    if (formData.twitter) {
      tags.push('\n<!-- Twitter -->');
      tags.push('<meta property="twitter:card" content="summary_large_image">');
      tags.push(`<meta property="twitter:title" content="${formData.title || ''}">`);
      tags.push(`<meta property="twitter:description" content="${formData.description || ''}">`);
      tags.push('<meta property="twitter:image" content="https://example.com/image.png">');
    }
    
    setOutput(tags.join('\n'));
  }, [formData, t]);

  useEffect(() => {
    generateTags();
  }, [generateTags]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setFormData({
      title: '',
      description: '',
      keywords: '',
      author: '',
      og: true,
      twitter: true,
    });
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Form Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('input')}</Label>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md p-4 bg-background space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('site_title')}</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t('placeholder')}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('site_description')}</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('placeholder_description')}
                  className="h-20 text-xs resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('site_keywords')}</Label>
                <Input 
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder={t('placeholder_keywords')}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('author')}</Label>
                <Input 
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder={t('placeholder_author')}
                  className="h-9 text-xs"
                />
              </div>
            </Card>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
            <Card className="flex flex-col h-full border border-border shadow-none rounded-md overflow-hidden bg-muted/20 min-h-[400px]">
              <pre className="flex-1 font-mono text-[11px] p-4 overflow-auto whitespace-pre-wrap leading-relaxed text-foreground bg-transparent">
                {output}
              </pre>
            </Card>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {commonT('ui.options')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-blue-600" />
                  <Label className="text-xs cursor-pointer" htmlFor="og-switch">{t('og_tags')}</Label>
                </div>
                <Switch 
                  id="og-switch"
                  checked={formData.og} 
                  onCheckedChange={(val) => setFormData({ ...formData, og: val })} 
                  className="scale-75 origin-right" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="h-3.5 w-3.5 text-sky-500" />
                  <Label className="text-xs cursor-pointer" htmlFor="twitter-switch">{t('twitter_tags')}</Label>
                </div>
                <Switch 
                  id="twitter-switch"
                  checked={formData.twitter} 
                  onCheckedChange={(val) => setFormData({ ...formData, twitter: val })} 
                  className="scale-75 origin-right" 
                />
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex gap-2.5 items-start p-3 rounded-md bg-muted/30 border border-border">
                  <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    {t('article').split('.')[0]}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="meta-tag-generator" />
    </div>
  );
}
