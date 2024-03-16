const express = require('express');

const fs = require("fs");
const path = require("path");
const atob = require("atob");


const savePdf = async (req, res) => {
    const { filename, pdf } = req.body;
    
    if (!filename || !pdf) {
        return res.status(400).send("Missing filename or pdf data");
    }

  const binaryPdf = atob(pdf);
  const filePath = path.join("./temp", filename);
  fs.writeFileSync(filePath, binaryPdf, { encoding: "binary" });

  return res.status(200).send("PDF file received and saved");
}

const getPDFbyFileName = async (req, res) => {
    const { filename } = req.body; 

    const filePath = path.join("./temp", filename);

    fs.readFile(filePath,'base64', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file");
        }

        return res.status(200).send(data);
    });
};

const getPdfList = async (req, res) => {
    const pdfDir = path.join("./temp");

    fs.readdir(pdfDir, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).send("Error reading directory");
        }

        const pdfFiles = files.filter(file => file.endsWith(".pdf"));
        return res.status(200).json(pdfFiles);
    });
}

module.exports = {
    savePdf : savePdf,
    getPDFbyFileName : getPDFbyFileName,
    getPdfList : getPdfList
}