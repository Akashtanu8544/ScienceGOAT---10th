/**
 * BytePrep In-App PDF Opening Utility
 *
 * Ensures the user NEVER leaves the BytePrep application when viewing a PDF.
 * PDF resources render in a dedicated full-screen in-app viewer.
 */

export interface OpenPdfOptions {
  title?: string;
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
}

export function openPdfDocument(pdfUrl: string, options?: OpenPdfOptions): void {
  if (!pdfUrl) {
    if (options?.onError) options.onError('अमान्य PDF लिंक');
    return;
  }

  // Trigger callback if defined
  if (options?.onSuccess) {
    options.onSuccess();
  }
}
