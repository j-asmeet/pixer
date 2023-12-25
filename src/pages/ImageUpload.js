import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import NavMenu from './NavMenu';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "");
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };
  
  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const base64Image = await convertToBase64(selectedFile);

        const response = await fetch(process.env.REACT_APP_API_URL+"/Dev/imageUpload", {
          method: "POST",
          body: JSON.stringify({ 
            image: base64Image,
            email: localStorage.getItem("email") }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const imageURL = data.imageURL;
          console.log("Image uploaded. URL:", imageURL);
          
        } else {
          console.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.log("No file selected");
    }
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName("");
  };

  return (
    <>
    <NavMenu /> 
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Box display="flex" alignItems="center" gap={1}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
            id="upload-button"
          />
          <label htmlFor="upload-button">
            <Button component="span" variant="contained" color="primary">
              Select Image
            </Button>
          </label>
          {fileName && (
            <>
              <Typography variant="body1" gutterBottom>
                {fileName}
              </Typography>
              <Button onClick={handleRemoveFile} variant="outlined" color="primary">
                Remove
              </Button>
            </>
          )}
          <Button onClick={handleUpload} variant="contained" color="primary">
            Upload
          </Button>
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default ImageUpload;
