import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";
import { User } from "../types";

import MiniDrawer from "../components/siderbar";
import {Box, Container} from '@mui/material';

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
        <div>
          {user != null ? (
            <Box sx={{display:'flex', marginTop:'100px'}}>
            <MiniDrawer/>
            <Container fixed>
              <h1>Welcome to the Cloud Security Dashboard</h1>
            <div>
              <h2>Logged in</h2>
              <h3>ID: {user.id}</h3>
              <h3>Email: {user.email}</h3>

            </div>
            </Container>
            </Box>
          ) : (
            <div>
              <h1>Welcome to the Cloud Security Dashboard</h1>
              <p>You are not logged in</p>
              <div>
                <a href="/login">
                  <button>Login</button>
                </a>
                <a href="/register">
                  <button>Register</button>
                </a>
              </div>
            </div>
          )}
        </div>
      );
};

export default LandingPage;