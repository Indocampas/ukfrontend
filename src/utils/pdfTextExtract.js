// src/utils/pdfTextExtract.js
//
// Local-only PDF text extraction for the Scholarship Exam template upload.
// Runs entirely in the browser via pdfjs-dist — no file is ever sent to a
// server. The admin uploads a PDF question paper; we pull the raw text out
// of it here, and examQuestionParser.js turns that raw text into structured
// online-exam questions.
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

// Reconstructs reasonably faithful line breaks from pdf.js's flat text-item
// stream by watching for vertical position jumps between items.
function itemsToText(items) {
  let text = "";
  let lastY = null;
  let lastHadEOL = false;

  items.forEach((item) => {
    const y = item.transform ? item.transform[5] : null;
    if (lastY !== null && y !== null && Math.abs(y - lastY) > 2 && !lastHadEOL) {
      text += "\n";
    }
    text += item.str;
    if (item.hasEOL) {
      text += "\n";
    } else if (item.str && !item.str.endsWith(" ")) {
      text += " ";
    }
    lastY = y;
    lastHadEOL = !!item.hasEOL;
  });

  return text;
}

/**
 * Extracts text from a PDF File/Blob entirely client-side.
 * Returns { fullText, pages } where pages is an array of per-page text.
 */
export async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pages = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    pages.push(itemsToText(content.items).trim());
  }

  return {
    numPages: pdf.numPages,
    pages,
    fullText: pages.join("\n\n"),
  };
}
