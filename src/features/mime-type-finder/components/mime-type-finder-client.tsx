"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings2, Info, Search, FileText, FileCode, FileImage, FileAudio, FileVideo, FileArchive, Copy, Check } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

const MIME_TYPES = [
  { ext: '.html', type: 'text/html', category: 'Text' },
  { ext: '.css', type: 'text/css', category: 'Text' },
  { ext: '.js', type: 'text/javascript', category: 'Script' },
  { ext: '.json', type: 'application/json', category: 'Data' },
  { ext: '.xml', type: 'application/xml', category: 'Data' },
  { ext: '.pdf', type: 'application/pdf', category: 'Document' },
  { ext: '.png', type: 'image/png', category: 'Image' },
  { ext: '.jpg', type: 'image/jpeg', category: 'Image' },
  { ext: '.gif', type: 'image/gif', category: 'Image' },
  { ext: '.svg', type: 'image/svg+xml', category: 'Image' },
  { ext: '.webp', type: 'image/webp', category: 'Image' },
  { ext: '.mp3', type: 'audio/mpeg', category: 'Audio' },
  { ext: '.wav', type: 'audio/wav', category: 'Audio' },
  { ext: '.mp4', type: 'video/mp4', category: 'Video' },
  { ext: '.webm', type: 'video/webm', category: 'Video' },
  { ext: '.zip', type: 'application/zip', category: 'Archive' },
  { ext: '.tar', type: 'application/x-tar', category: 'Archive' },
  { ext: '.txt', type: 'text/plain', category: 'Text' },
  { ext: '.csv', type: 'text/csv', category: 'Data' },
  { ext: '.exe', type: 'application/octet-stream', category: 'Binary' },
];

export function MimeTypeFinderClient() {
  const t = useTranslations('tools.mime-type-finder');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [search, setSearch] = useState('');

  const filteredMimes = useMemo(() => {
    return MIME_TYPES.filter(item => 
      item.ext.toLowerCase().includes(search.toLowerCase()) || 
      item.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const getIcon = (category: string) => {
    switch (category) {
      case 'Text': return <FileText className="h-4 w-4 text-zinc-500" />;
      case 'Script': return <FileCode className="h-4 w-4 text-blue-500" />;
      case 'Data': return <FileCode className="h-4 w-4 text-amber-500" />;
      case 'Image': return <FileImage className="h-4 w-4 text-emerald-500" />;
      case 'Audio': return <FileAudio className="h-4 w-4 text-pink-500" />;
      case 'Video': return <FileVideo className="h-4 w-4 text-indigo-500" />;
      case 'Archive': return <FileArchive className="h-4 w-4 text-orange-500" />;
      default: return <FileText className="h-4 w-4 text-zinc-500" />;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        {/* Search Area */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('placeholder')}
              className="pl-10 h-11 text-sm bg-background border-border shadow-sm"
            />
          </div>
        </div>

        {/* Result List */}
        <ToolCard title={t('mime_type')} contentClassName="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-transparent">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('extension')}</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('mime_type')}</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMimes.map((item, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getIcon(item.category)}
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-semibold text-foreground">{item.ext}</span>
                          <span className="text-[9px] text-muted-foreground uppercase font-medium">{t(`cat_${item.category.toLowerCase()}`)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-muted-foreground">{item.type}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(item.type, `mime-${i}`)}
                      >
                        {copiedType === `mime-${i}` ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredMimes.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-12 text-center text-xs text-muted-foreground">
                      {t('no_results')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.options')} icon={Settings2} contentClassName="p-4 space-y-4">
          <div className="flex gap-2.5 items-start p-3 rounded-md bg-muted/30 border border-border">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">{t('article').split('.')[0]}.</p>
          </div>
          <div className="pt-2 space-y-2">
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('sidebar_desc')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
