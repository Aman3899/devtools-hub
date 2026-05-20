'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ToolActionsProps {
  onClear: () => void;
  onSample?: () => void;
  showSample?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ToolActions({
  onClear,
  onSample,
  showSample = true,
  disabled = false,
  className = '',
}: ToolActionsProps) {
  const tCommon = useTranslations('common');

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showSample && onSample && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSample}
          disabled={disabled}
          className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          {tCommon('sample')}
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClear}
        disabled={disabled}
        title={tCommon('clear')}
        className="h-6 w-6 text-muted-foreground hover:text-destructive transition-colors"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
