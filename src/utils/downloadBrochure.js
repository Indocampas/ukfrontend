// src/utils/downloadBrochure.js
import { BROCHURE_PDF_PATH, BROCHURE_FILENAME } from "../config/siteConfig";

/** Opens/downloads the academy brochure PDF from /public. */
export function downloadBrochure() {
  const link = document.createElement("a");
  link.href = BROCHURE_PDF_PATH;
  link.download = BROCHURE_FILENAME;
  link.target = "_blank";
  link.rel = "noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
