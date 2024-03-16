const pdfjs = await import("pdfjs-dist/build/pdf");
const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const pdfToImage = async (pdfBlob) => {
  // console.log("pdfBlob - ", pdfBlob)

  const pdfUrl = window.URL.createObjectURL(pdfBlob);
  const pdf = await pdfjs.getDocument(pdfUrl).promise;

  // Fetch the first page
  const page = await pdf.getPage(1);

  // Set the scale for rendering
  const scale = 1.5;

  // Get the viewport of the page
  const viewport = page.getViewport({ scale });

  // Create a canvas element
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set the canvas size
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // Render the PDF page into the canvas
  await page.render({ canvasContext: context, viewport }).promise;

  // Convert the canvas to an image
  const imgData = canvas.toDataURL("image/png");

  // Return the image data
  return imgData;
};
