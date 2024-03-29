import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";
import { useNavigate } from 'react-router-dom';

import MiniDrawer from "../components/siderbar";
import {Box, Container} from '@mui/material';

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, filename: string) => {
    const isChecked = event.target.checked;
    if (isChecked) {
        setSelectedFile(filename);
    } else {
        setSelectedFile(null);
    }
  };

  const handleDatasetChange = (event: React.ChangeEvent<HTMLInputElement>, filename: string) => {
    const isChecked = event.target.checked;
    if (isChecked) {
        setSelectedDatasets(prevSelectedDatasets => [...prevSelectedDatasets, filename]);
    } else {
        setSelectedDatasets(prevSelectedDatasets => prevSelectedDatasets.filter(file => file !== filename));
    }
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

    <Box sx={{display:'flex', marginTop:'100px'}}>
    <MiniDrawer/>
    <Container fixed>
    <div>
      <div>
        <h2>Files</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <label>
                <input
                  type="radio"
                  checked={selectedFile === file}
                  onChange={(event) => handleFileChange(event, file)}
                />
                {file}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Datasets</h2>
        <ul>
          {datasets.map((file, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedDatasets.includes(file)}
                  onChange={(event) => handleDatasetChange(event, file)}
                />
                {file}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleRunModel}>Run Model</button>
    </div>
    </Container>
    </Box>
  );
};

export default MainPage;