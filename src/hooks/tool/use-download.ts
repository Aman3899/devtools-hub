'use client';

import { useState, useCallback } from 'react';

interface UseDownloadOptions {
  filename: string;
  mimeType?: string;
}

/**
 * Standardised file-download hook.
 * Returns { downloaded, download } — call download(content) to trigger.
 */
export function useDownload({ filename, mimeType = 'text/plain' }: UseDownloadOptions) {
  const [downloaded, setDownloaded] = useState(false);

  const download = useCallback(
    (content: string) => {
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
    },
    [filename, mimeType],
  );

  return { downloaded, download };
}
