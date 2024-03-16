const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const {savePdf, getPDFbyFileName, getPdfList} = require("./Api/index");

const fs = require("fs");
const path = require("path");
const atob = require("atob");

const app = express();

const PORT = 8000;

const router = express.Router();

// app.use(cors({ origin: true, credentials: true }));
app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000 }));



app.use("/api", router);

router.post("/uploadPdf", savePdf);
router.get("/getAllPdf", getPdfList)
router.post("/fetchPdf", getPDFbyFileName);

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
