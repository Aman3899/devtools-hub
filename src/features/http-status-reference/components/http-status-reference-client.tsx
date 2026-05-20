"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings2, Info, Search, Info as InfoIcon, CheckCircle2, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const HTTP_STATUS_CODES = [
  { code: 100, name: 'Continue', category: '1xx Informational', description: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, name: 'Switching Protocols', category: '1xx Informational', description: 'The requester has asked the server to switch protocols.' },
  { code: 200, name: 'OK', category: '2xx Success', description: 'Standard response for successful HTTP requests.' },
  { code: 201, name: 'Created', category: '2xx Success', description: 'The request has been fulfilled, resulting in the creation of a new resource.' },
  { code: 204, name: 'No Content', category: '2xx Success', description: 'The server successfully processed the request and is not returning any content.' },
  { code: 301, name: 'Moved Permanently', category: '3xx Redirection', description: 'This and all future requests should be directed to the given URI.' },
  { code: 302, name: 'Found', category: '3xx Redirection', description: 'The resource was found, but at a different URI.' },
  { code: 304, name: 'Not Modified', category: '3xx Redirection', description: 'Indicates that the resource has not been modified since the version specified by the request headers.' },
  { code: 400, name: 'Bad Request', category: '4xx Client Error', description: 'The server cannot or will not process the request due to an apparent client error.' },
  { code: 401, name: 'Unauthorized', category: '4xx Client Error', description: 'Similar to 403 Forbidden, but specifically for use when authentication is required.' },
  { code: 403, name: 'Forbidden', category: '4xx Client Error', description: 'The server understood the request, but is refusing action.' },
  { code: 404, name: 'Not Found', category: '4xx Client Error', description: 'The requested resource could not be found but may be available in the future.' },
  { code: 405, name: 'Method Not Allowed', category: '4xx Client Error', description: 'A request method is not supported for the requested resource.' },
  { code: 422, name: 'Unprocessable Entity', category: '4xx Client Error', description: 'The request was well-formed but was unable to be followed due to semantic errors.' },
  { code: 426, name: 'Upgrade Required', category: '4xx Client Error', description: 'The client should switch to a different protocol such as TLS/1.0.' },
  { code: 429, name: 'Too Many Requests', category: '4xx Client Error', description: 'The user has sent too many requests in a given amount of time.' },
  { code: 451, name: 'Unavailable For Legal Reasons', category: '4xx Client Error', description: 'The server is denying access to the resource as a consequence of a legal demand.' },
  { code: 500, name: 'Internal Server Error', category: '5xx Server Error', description: 'A generic error message, given when an unexpected condition was encountered.' },
  { code: 501, name: 'Not Implemented', category: '5xx Server Error', description: 'The server either does not recognize the request method, or it lacks the ability to fulfil the request.' },
  { code: 502, name: 'Bad Gateway', category: '5xx Server Error', description: 'The server was acting as a gateway and received an invalid response.' },
  { code: 503, name: 'Service Unavailable', category: '5xx Server Error', description: 'The server cannot handle the request (overloaded or down for maintenance).' },
  { code: 504, name: 'Gateway Timeout', category: '5xx Server Error', description: 'The server was acting as a gateway and did not receive a timely response.' },
  { code: 505, name: 'HTTP Version Not Supported', category: '5xx Server Error', description: 'The server does not support the HTTP protocol version used in the request.' },
];

export function HttpStatusReferenceClient() {
  const t = useTranslations('tools.http-status-reference');
  const commonT = useTranslations('common');
  
  const [search, setSearch] = useState('');

  const filteredCodes = useMemo(() => {
    return HTTP_STATUS_CODES.filter(item => item.code.toString().includes(search) || item.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const getStatusIcon = (code: number) => {
    if (code >= 100 && code < 200) return <InfoIcon className="h-4 w-4 text-zinc-500" />;
    if (code >= 200 && code < 300) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (code >= 300 && code < 400) return <AlertCircle className="h-4 w-4 text-blue-500" />;
    if (code >= 400 && code < 500) return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    if (code >= 500) return <XCircle className="h-4 w-4 text-red-500" />;
    return <InfoIcon className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('placeholder')} className="pl-10 h-11 text-sm bg-background border-border shadow-sm" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {filteredCodes.map((item) => (
            <Card key={item.code} className="border border-border shadow-none hover:border-foreground/10 transition-colors bg-background">
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono tracking-tight">{item.code}</span>
                    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider", item.code < 200 ? "bg-zinc-500/10 text-zinc-600 border-zinc-500/20" : item.code < 300 ? "bg-green-500/10 text-green-600 border-green-500/20" : item.code < 400 ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : item.code < 500 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-red-500/10 text-red-600 border-red-500/20")}>
                        {getStatusIcon(item.code)}
                        {item.code < 200 ? t('cat_info') : item.code < 300 ? t('cat_success') : item.code < 400 ? t('cat_redirect') : item.code < 500 ? t('cat_client') : t('cat_server')}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{t(`code_${item.code}_name`)}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(`code_${item.code}_desc`)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.options')} icon={Settings2} contentClassName="p-4 space-y-4">
           <div className="flex gap-2.5 items-start p-3 rounded-md bg-muted/30 border border-border">
              <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-normal">{t('article').split('.')[0]}.</p>
            </div>
            <div className="space-y-3 pt-2">
               <div className="p-2.5 rounded-md bg-green-500/10 border border-green-500/20 text-[10px]"><span className="font-bold text-green-600">2xx:</span> {t('desc_2xx')}</div>
               <div className="p-2.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px]"><span className="font-bold text-blue-600">3xx:</span> {t('desc_3xx')}</div>
               <div className="p-2.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px]"><span className="font-bold text-amber-600">4xx:</span> {t('desc_4xx')}</div>
               <div className="p-2.5 rounded-md bg-red-500/10 border border-red-500/20 text-[10px]"><span className="font-bold text-red-600">5xx:</span> {t('desc_5xx')}</div>
            </div>
        </ToolCard>
      </div>
    </div>
  );
}
