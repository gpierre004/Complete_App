// src/components/dashboard/Dashboard.js
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
}));

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [watchlistRes, transactionsRes] = await Promise.all([
          api.get('/watchlist'),
          api.get('/transactions'),
        ]);
        setWatchlist(watchlistRes.data);
        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stock Portfolio Tracker
          </Typography>
          <Typography sx={{ mr: 2 }}>Welcome, {user?.name}</Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Portfolio Overview
              </Typography>
              {/* Add portfolio chart component here */}
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Watchlist
              </Typography>
              {/* Add watchlist component here */}
            </StyledPaper>
          </Grid>
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              {/* Add transactions table component here */}
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;