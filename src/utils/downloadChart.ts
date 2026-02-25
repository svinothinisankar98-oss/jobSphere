import html2canvas from "html2canvas";

export const downloadChartImage = async (
  element: HTMLElement,
  fileName: string
) => {
  if (!element) return;

  /*  Clone chart */
  const clone = element.cloneNode(true) as HTMLElement;

  /*  Create clean export container */
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-10000px";
  wrapper.style.top = "0";
  wrapper.style.padding = "24px";
  wrapper.style.background = "#ffffff";
  wrapper.style.borderRadius = "12px";
  wrapper.style.width = element.offsetWidth + "px";

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  /*  Capture */
  const canvas = await html2canvas(wrapper, {
    backgroundColor: "#ffffff",
    scale: 3, // SUPER CLEAR HD
    useCORS: true,
  });

  /*  Download */
  const link = document.createElement("a");
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();

  /* Cleanup */
  document.body.removeChild(wrapper);
};