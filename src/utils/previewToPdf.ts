import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type ExportOptions = {
  fileName?: string;
  scale?: number;
  orientation?: "p" | "l";
  marginBottom?: number;
  showPageNumber?: boolean;
};

export async function previewToPdf(
  elementId: string,
  options?: ExportOptions
) {
  const {
    fileName = "document",
    scale = 2,
    orientation = "p",
    marginBottom = 10,
    showPageNumber = true,
  } = options || {};

  const element = document.getElementById(elementId);
  if (!element) return;

  /* -------- Force A4 width -------- */
  const originalWidth = element.style.width;
  element.style.width = "794px";

  await new Promise((r) => setTimeout(r, 200));

  const canvas = await html2canvas(element, {
    scale,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  element.style.width = originalWidth;

  /* -------- PDF Setup -------- */

  const pdf = new jsPDF(orientation, "mm", "a4");

  const pageWidth = orientation === "p" ? 210 : 297;
  const pageHeight = orientation === "p" ? 295 : 200;

  const imgWidth = pageWidth;

  const pageCanvas = document.createElement("canvas");
  const pageCtx = pageCanvas.getContext("2d");

  const pxPageHeight = Math.floor((canvas.width * pageHeight) / pageWidth);

  let renderedHeight = 0;
  let pageNumber = 0;

  /* -------- Split pages -------- */

  while (renderedHeight < canvas.height) {
    pageCanvas.width = canvas.width;
    pageCanvas.height = Math.min(pxPageHeight, canvas.height - renderedHeight);

    pageCtx!.drawImage(
      canvas,
      0,
      renderedHeight,
      canvas.width,
      pageCanvas.height,
      0,
      0,
      canvas.width,
      pageCanvas.height
    );

    const imgData = pageCanvas.toDataURL("image/png");

    if (pageNumber > 0) pdf.addPage();

    const pageImgHeight = (pageCanvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pageImgHeight);

    renderedHeight += pxPageHeight;
    pageNumber++;
  }

  /* -------- Page Numbers -------- */

  if (showPageNumber) {
    const pageCount = pdf.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(120);

      pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - marginBottom, {
        align: "center",
      });
    }
  }

  pdf.save(`${fileName}.pdf`);
}
