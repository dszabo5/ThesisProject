import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import httpClient from "../httpClient";
import { Result } from "../types";

import MiniDrawer from "../components/siderbar";
import {Box, Container} from '@mui/material';

const ResultsPage: React.FC = () => {

  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);

  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const file = params.get('selectedFile');
    const datasets = params.get('selectedDatasets');

    if (file) {
      setSelectedFile(file);
    }

    if (datasets) {
      setSelectedDatasets(JSON.parse(datasets));
      console.log(datasets);
    }

  }, [location.search]);

    useEffect(() => {
        // Call runModel only when selectedDatasets state has been updated
        if (selectedDatasets.length > 0) {
            runModel();
        }
    }, [selectedDatasets]);

    const runModel = async () => {
        try {
            const response = await httpClient.post("//localhost:5001/compare", {
                selectedFile,
                selectedDatasets,
            });
            console.log(response.data); // Log the response from the backend
            const formattedData = response.data.map((item: any[]) => ({
                dataset: item[0],
                index: item[1],
                link: item[2],
                similarity: item[3],
              }));
        
              setResults(formattedData);
        } catch (error) {
            console.error('Error fetching datasets:', error);
        }
    };

  return (
    <div>
    <Box sx={{display:'flex', marginTop:'100px'}}>
      <MiniDrawer/>
      <Container fixed>
      <h2>Results Page</h2>
      <p>Selected File: {selectedFile}</p>
      <p>Selected Datasets: {selectedDatasets.join(', ')}</p>
      {/* Render your results */}
      <h1>Top 10 Results</h1>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <strong>Dataset: </strong>{result.dataset}<br />
            <strong>Index: </strong>{result.index}<br />
            <strong>Link: </strong>{result.link}<br />
            <strong>Similarity: </strong>{result.similarity}%<br />
          </li>
        ))}
      </ul>
      </Container>
    </Box>
    </div>
  );
};

export default ResultsPage;