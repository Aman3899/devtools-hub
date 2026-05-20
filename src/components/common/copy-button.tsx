'use client';

import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface CopyButtonProps {
  text: string;
  type?: string;
  disabled?: boolean;
  /** 'default' shows icon + label; 'icon' shows icon only */
  variant?: 'default' | 'icon';
  className?: string;
}

export function CopyButton({
  text,
  type = 'default',
  disabled = false,
  variant = 'default',
  className = '',
}: CopyButtonProps) {
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const isCopied = copiedType === type;

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => copyToClipboard(text, type)}
        disabled={disabled || !text}
        title={tCommon('copy')}
        className={`h-6 w-6 ${className}`}
      >
        {isCopied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, type)}
      disabled={disabled || !text}
      className={`h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      {isCopied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {tCommon('copy')}
    </Button>
  );
}
