import React, { useEffect, useState } from "react";
import "./renderPage.css"

const RenderPage = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    setSelectedFile(props?.pagePdf?.pageBlob);
    setImageData(props?.pagePdf?.imageByte);
  }, []);


  return (
    <div>
      {/* {selectedFile && (
        <object
          data={URL.createObjectURL(selectedFile)}
          type="application/pdf"
          width="200px"
          height="200px"
        >
          <p>This browser does not support embedded PDF files. You can download the PDF to view it: <a href={URL.createObjectURL(selectedFile)}>Download PDF</a></p>
        </object>
      )} */}

      {imageData && (
        <div className="pdfRender-parent">
          <div className="pdfRender-child">
            <img className="pdf-img" src={imageData} alt="PDF Page" />
          </div>
        </div>
      )}
    </div>
  );
};

export default RenderPage;
