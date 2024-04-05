import React, { useState, useRef } from 'react';
import httpClient from "../httpClient";

import MiniDrawer from "../components/siderbar";
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';

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
    <Container maxWidth="md">
      <MiniDrawer />
            <Box sx={{ marginTop: 4, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ marginLeft: 4 }}>
                    <Typography variant="h3" gutterBottom>
                        Upload Files:
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                        <Paper sx={{ backgroundColor: '#f5f5f5', padding: 2, marginBottom: 2 }}>
                            <Typography variant="h5" align="center" gutterBottom>
                                Upload Dataset
                            </Typography>
                            <input type="file" accept=".xlsx" onChange={handleChange} ref={fileInputRef} />
                            <Button variant="contained" onClick={handleUpload} sx={{ marginLeft: 1 }}>
                                Upload Dataset
                            </Button>
                        </Paper>
                        <Paper sx={{ backgroundColor: '#f5f5f5', padding: 2 }}>
                            <Typography variant="h5" align="center" gutterBottom>
                                Upload File
                            </Typography>
                            <input type="file" accept=".txt" onChange={handleChange} ref={fileInputRef} />
                            <Button variant="contained" onClick={handleUpload} sx={{ marginLeft: 1 }}>
                                Upload File
                            </Button>
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </Container>
  );
};

export default FileUploadComponent;