import { useState, useCallback } from 'react';

export function useCopyToClipboard(timeout = 2000) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string, type: string = 'default') => {
    if (!text) return;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedType(type);
        setTimeout(() => {
          setCopiedType((currentType) => (currentType === type ? null : currentType));
        }, timeout);
      }).catch((err) => {
        console.error('Failed to copy to clipboard', err);
      });
    }
  }, [timeout]);

  return { copiedType, copyToClipboard };
}
