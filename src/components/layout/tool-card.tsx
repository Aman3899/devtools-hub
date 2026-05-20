"use client"

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface ToolCardProps {
  title: ReactNode;
  icon?: React.ElementType;
  action?: ReactNode;
  copyText?: string;
  copyType?: string;
  copiedType?: string | null;
  onCopy?: (text: string, type: string) => void;
  children: ReactNode;
  contentClassName?: string;
  className?: string;
  disabled?: boolean;
}

export function ToolCard({
  title,
  icon: Icon,
  action,
  copyText,
  copyType,
  copiedType,
  onCopy,
  children,
  contentClassName = 'p-6 space-y-6',
  className = '',
  disabled = false,
}: ToolCardProps) {
  const tCommon = useTranslations('common');

  return (
    <Card className={`border border-border shadow-none rounded-md bg-background focus-within:border-foreground/20 transition-colors ${className}`}>
      <CardHeader className="py-3 px-4 md:py-4 md:px-6 border-b bg-muted/20 flex flex-row items-center justify-between">
        <CardTitle className="text-xs md:text-sm font-semibold flex items-center gap-2 text-muted-foreground">
          {Icon && <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />}
          {title}
        </CardTitle>
        {action ? (
          <div className="flex items-center">{action}</div>
        ) : copyText !== undefined && onCopy && copyType ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onCopy(copyText, copyType)}
            disabled={disabled || !copyText}
            className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            {copiedType === copyType ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            {tCommon('copy')}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  );
}
