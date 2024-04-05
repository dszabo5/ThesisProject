import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";
import { useNavigate } from 'react-router-dom';

import MiniDrawer from "../components/siderbar";
import { Box, Container, Typography, Button, List, ListItem, ListItemText, Checkbox } from '@mui/material';

const MainPage: React.FC = () => {

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);

    const [files, setFiles] = useState<string[]>([]);
    const [datasets, setDatasets] = useState<string[]>([]);

    const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resp1 = await httpClient.get("//localhost:5001/files");
      if (!resp1) {
        throw new Error('Failed to fetch files');
      }
      const data1 = await resp1.data;
      setFiles(data1.files);

      const resp2 = await httpClient.get("//localhost:5001/datasets");
      if (!resp2) {
        throw new Error('Failed to fetch files');
      }
      const data2 = await resp2.data;
      setDatasets(data2.datasets);

    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const handleFileChange = (filename: string) => {
    setSelectedFile(prevSelectedFile => (prevSelectedFile === filename ? null : filename));
};

const handleDatasetChange = (filename: string) => {
    setSelectedDatasets(prevSelectedDatasets =>
        prevSelectedDatasets.includes(filename)
            ? prevSelectedDatasets.filter(file => file !== filename)
            : [...prevSelectedDatasets, filename]
    );
};


  const handleRunModel = async () => {
    try {
        // Pass selectedFile and selectedDatasets as URL parameters
        const url = `/results?selectedFile=${selectedFile ? encodeURIComponent(selectedFile) : ''}&selectedDatasets=${encodeURIComponent(JSON.stringify(selectedDatasets))}`;
        navigate(url);
      } catch (error) {
        console.error('Error running model:', error);
      }
  };

  return (

    <Box sx={{ display: 'flex', marginTop: '100px' }}>
            <MiniDrawer />
            <Container fixed>
                <div>
                    <Box sx={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                        <Typography variant="h4">Files</Typography>
                        <List>
                            {files.map((file, index) => (
                                <ListItem key={index} button onClick={() => handleFileChange(file)}>
                                    <ListItemText primary={file} />
                                    <Checkbox checked={selectedFile === file} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                        <Typography variant="h4">Datasets</Typography>
                        <List>
                            {datasets.map((dataset, index) => (
                                <ListItem key={index} button onClick={() => handleDatasetChange(dataset)}>
                                    <ListItemText primary={dataset} />
                                    <Checkbox checked={selectedDatasets.includes(dataset)} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Button variant="contained" onClick={handleRunModel}>Run Model</Button>
                </div>
            </Container>
        </Box>
  );
};

export default MainPage;