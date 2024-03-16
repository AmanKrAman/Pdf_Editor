import axios from "axios";
import * as api from "./constant";
import { Buffer } from "buffer";

export const savePdf = async (data) => {
    try {
        const response = await axios.post(api.uploadPdf, data, {
          headers: {
            "Content-Type": "application/json",
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            responseType: 'json'
          },          
        });
        return response.data; // Assuming the server responds with some data
      } catch (error) {
        console.error("Error saving PDF to server:", error);
        throw error;
      }
};

export const getAllPdfList = async () => {
    try {
      const response = await axios.get(api.getAllPfd);
      if(response.status == 200) return response.data;
    } catch (error) {
      console.error("Error getting PDF list from server:", error);
      throw error; 
    }
  };


  export const getPdfBase64 = async (filename) => {
    try {
      const response = await axios.post(api.fetchPdf, filename, {
        headers: {
            "Content-Type": "application/json",
            maxBodyLength: Infinity,
            maxContentLength: Infinity
          },  
      });
  
      return response.data; // Return the Base64 string of the PDF file
    } catch (error) {
      console.error("Error getting PDF Base64 from server:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  };

