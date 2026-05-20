'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DownloadButtonProps {
  content: string;
  filename: string;
  mimeType?: string;
  disabled?: boolean;
  className?: string;
}

export function DownloadButton({
  content,
  filename,
  mimeType = 'text/plain',
  disabled = false,
  className = '',
}: DownloadButtonProps) {
  const tCommon = useTranslations('common');
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDownload}
      disabled={disabled || !content}
      className={`h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      {downloaded ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Download className="h-3 w-3" />
      )}
      {tCommon('download')}
    </Button>
  );
}
