import "./pdf1split.css";
import React, { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import RenderPage from "./RenderPage";
import { pdfToImage } from "../utility/pdftoimage";
import { savePdf, getAllPdfList, getPdfBase64 } from "../service";
import { Buffer } from "buffer";
import fileName from "../utility/filename";
import atob from "atob";

const Pdf1Split = () => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [pdflist, setPdfList] = useState([]);

  const inputRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const files = await getAllPdfList();
      setPdfList(files);
    } catch (error) {
      console.error("Error fetching PDF list:", error);
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    await processPdf(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    await processPdf(event.dataTransfer.files[0]);
  };

  const processPdf = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const buffer = reader.result;
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = [];
      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const onePage = await PDFDocument.create();
        const page = await onePage.copyPages(pdfDoc, [i]);
        onePage.addPage(page[0]);
        const pageBytes = await onePage.save();
        const finalBlob = new Blob([pageBytes], { type: "application/pdf" });
        const imageByte = await pdfToImage(finalBlob);
        pages.push({
          pageNumber: i + 1,
          selected: false,
          pageBlob: finalBlob,
          imageByte: imageByte,
        });
      }
      setPdfDoc(pdfDoc);
      setPdfPages(pages);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCheckboxChange = (pageNumber) => {
    setSelectedPages((prevSelected) =>
      prevSelected.includes(pageNumber)
        ? prevSelected.filter((page) => page !== pageNumber)
        : [...prevSelected, pageNumber]
    );
  };

  const mergePDF = async () => {
    const mergedDoc = await PDFDocument.create();
    for (let i = 0; i < selectedPages.length; i++) {
      const selectedPage = selectedPages[i];
      const page = await mergedDoc.copyPages(pdfDoc, [selectedPage - 1]);
      mergedDoc.addPage(page[0]);
    }
    const mergedPdfBytes = await mergedDoc.save();
    return mergedPdfBytes;
  };

  const mergeAndDownload = async () => {
    const mergedPdfBytes = await mergePDF();
    downloadFroBase64(mergedPdfBytes, "merged.pdf");
  };

  const saveToServer = async () => {
    const mergedPdfBytes = await mergePDF();
    const base64Pdf = Buffer.from(mergedPdfBytes).toString("base64");
    const pdfData = { pdf: base64Pdf, filename: `${fileName()}.pdf` };
    try {
      const response = await savePdf(pdfData);
      fetchData();
    } catch (error) {
      console.error("Error saving PDF to server:", error);
    }
  };

  const downloadFroBase64 = async (base64, filename) => {
    const blob = new Blob([base64], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownload = async (filename) => {
    try {
      const base64Pdf = await getPdfBase64({ filename: filename });
      const at = atob(base64Pdf);
      const dataArray = new Uint8Array(at.length);
      for (let i = 0; i < at.length; i++) {
        dataArray[i] = at.charCodeAt(i);
      }
      downloadFroBase64(dataArray, filename);
      return;
    } catch (error) {
      console.error("Error getting Base64 PDF for", filename, ":", error);
    }
  };

  return (
    <div className="flex-container">
      <div className="inputandlist-div">
        <div
          className="input-div"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h3>Drag and Drop Files to Upload</h3>
          <h5>Or</h5>
          <input
            type="file"
            onChange={onFileChange}
            hidden
            accept="pdf"
            ref={inputRef}
            webkitdirectory
          />
          <button onClick={() => inputRef.current.click()}>Select Files</button>
        </div>
        {pdflist && (
          <div className="pdfList-div">
            <ul id="pdfList">
              {pdflist.map((file) => (
                <div key={file}>
                  {file}
                  <button onClick={() => handleDownload(file)}>Download</button>
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="all-page-container">
        {pdfPages.map((page) => (
          <div
            key={page.pageNumber}
            className="check-container"
            onClick={() => handleCheckboxChange(page.pageNumber)}
          >
            <div>
              <input
                type="checkbox"
                checked={selectedPages.includes(page.pageNumber)}
                onChange={() => handleCheckboxChange(page.pageNumber)}
              />
              <span>Page {page.pageNumber}</span>
            </div>
            <RenderPage pagePdf={page} />
          </div>
        ))}
      </div>
      {pdfDoc && (
        <div>
          <button onClick={mergeAndDownload}>split & Download </button>
          <button onClick={saveToServer}>split & Save </button>
        </div>
      )}
    </div>
  );
};

export default Pdf1Split;
