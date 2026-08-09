import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up worker for PDF.js using standard reliable CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;

export interface ExtractedDocument {
  text: string;
  fileName: string;
  fileType: string;
  wordCount: number;
}

/**
 * Parses uploaded file (.pdf, .docx, .doc, .txt, .md, .rtf) into clean plain text
 */
export async function extractTextFromDocument(file: File): Promise<ExtractedDocument> {
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  let extractedText = '';

  if (extension === 'docx' || extension === 'doc') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value || '';
    } catch (err) {
      console.error('Mammoth docx parsing error:', err);
      throw new Error('Could not read Word document (.docx). Please ensure file is not password protected.');
    }
  } else if (extension === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const textChunks: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        textChunks.push(pageText);
      }
      extractedText = textChunks.join('\n\n');
    } catch (err) {
      console.error('PDF.js parsing error:', err);
      throw new Error('Could not parse PDF text. Ensure the PDF is text-based (not scanned image only).');
    }
  } else {
    // Plain text / Markdown / RTF
    extractedText = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => reject(new Error('Failed to read text file.'));
      reader.readAsText(file);
    });
  }

  // Clean up excessive spacing while maintaining paragraph structures
  const cleanText = extractedText
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const words = cleanText.split(/\s+/).filter(Boolean);

  return {
    text: cleanText,
    fileName,
    fileType: extension.toUpperCase(),
    wordCount: words.length,
  };
}
