import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";
import { User } from "../types";
import { useNavigate } from 'react-router-dom';

import MiniDrawer from "../components/siderbar";
import {Box, Container} from '@mui/material';

const SettingsPage: React.FC = () => {

  const [user, setUser] = useState<User | null>(null);

  const logoutUser = async () => {
      await httpClient.post("//localhost:5001/logout");
      window.location.href = "/";
  };

  return (

    <Box sx={{display:'flex', marginTop:'100px'}}>
    <MiniDrawer/>
    <Container fixed>
    <div>
      <h1>Settings</h1>
      <button onClick={logoutUser}>Logout</button>
    </div>
    </Container>
    </Box>
  );
};

export default SettingsPage;