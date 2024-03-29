import React, { useState, useRef } from 'react';
import httpClient from "../httpClient";

import MiniDrawer from "../components/siderbar";
import {Box, Container} from '@mui/material';

const FileUploadComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    //if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    //  setSelectedFile(file);
    //} 
    if (file) {
        setSelectedFile(file);
    }
    else {
      setSelectedFile(null);
      alert('Please select a valid file.');
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        if (selectedFile.type === 'text/plain') {
            const resp = await httpClient.post("http://localhost:5001/upload/file",formData);
        }
        else {
            const resp = await httpClient.post("http://localhost:5001/upload/dataset",formData);
        }
        alert('File uploaded successfully!');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }      
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again later.');
      }
    } else {
      alert('Please select a file to upload.');
    }
  };

  return (
    <div>
      <Box sx={{display:'flex', marginTop:'100px'}}>
      <MiniDrawer/>
      <Container fixed>
      <h1>Upload Files:</h1>
      <input type="file" accept=".xlsx" onChange={handleChange} ref={fileInputRef} />
      <button onClick={handleUpload}>Upload Dataset</button>

      <input type="file" accept=".txt" onChange={handleChange} ref={fileInputRef} />
      <button onClick={handleUpload}>Upload File</button>
      </Container>
      </Box>
    </div>
  );
};

export default FileUploadComponent;