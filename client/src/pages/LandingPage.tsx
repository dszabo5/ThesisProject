import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";
import { User } from "../types";

import MiniDrawer from "../components/siderbar";
import { Box, Container, Typography, Button } from '@mui/material';

const LandingPage: React.FC = () => {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
          try {
            const resp = await httpClient.get("//localhost:5001/@me");
            setUser(resp.data);
          } catch (error) {
            console.log("Not authenticated");
          }
        })();
    }, []);

    return (
      <Box sx={{ padding: 2, height: '100vh' }}>
                {user != null ? (
                  <Box>
                    <MiniDrawer />
                  <Container sx={{ width: '80%', margin: 'auto', backgroundColor: '#f5f5f5', padding:5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ marginLeft: '20px', textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ fontWeight: 'bold' }} gutterBottom>
                                Welcome to the Cloud Security Dashboard
                            </Typography>
                            <Box sx={{ textAlign: 'center', marginTop:4}}>
                                <Typography variant="h4" gutterBottom>
                                    Logged in
                                </Typography>
                                <Typography variant="h4" gutterBottom>
                                    ID: {user.id}
                                </Typography>
                                <Typography variant="h4" gutterBottom>
                                    Email: {user.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    </Container>
                    </Box>
                ) : (
                  <Container sx={{ width: '50%', margin: 'auto', backgroundColor: '#f5f5f5', padding:5 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold' }} gutterBottom>
                            Welcome to the Cloud Security Dashboard
                        </Typography>
                        <Typography variant="body1" sx={{ marginTop:6, marginBottom:6 }} gutterBottom>
                            You are not logged in
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Button variant="contained" href="/login" sx={{ width: '150px', marginRight: '10px' }}>
                                Login
                            </Button>
                            <Button variant="contained" href="/register" sx={{ width: '150px' }}>
                                Register
                            </Button>
                        </Box>
                    </Box>
                    </Container>
                )}
        </Box>
      );
};

export default LandingPage;