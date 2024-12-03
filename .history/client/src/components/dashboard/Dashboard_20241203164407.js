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
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [watchlistRes, transactionsRes] = await Promise.all([
          api.get('/watchlist'),
          api.get('/transactions'),
        ]);
        setWatchlist(watchlistRes.data);
        setTransactions(transactionsRes.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
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
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Portfolio Overview
              </Typography>
              {transactions.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Stock</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{transaction.symbol}</TableCell>
                          <TableCell align="right">{transaction.quantity}</TableCell>
                          <TableCell align="right">${transaction.price}</TableCell>
                          <TableCell align="right">
                            ${(transaction.quantity * transaction.price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary">No transactions found</Typography>
              )}
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Watchlist
              </Typography>
              {watchlist.length > 0 ? (
                <List>
                  {watchlist.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={item.symbol}
                        secondary={`$${item.currentPrice}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary">No stocks in watchlist</Typography>
              )}
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              {transactions.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>{transaction.symbol}</TableCell>
                          <TableCell align="right">{transaction.quantity}</TableCell>
                          <TableCell align="right">${transaction.price}</TableCell>
                          <TableCell align="right">
                            ${(transaction.quantity * transaction.price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary">No recent transactions</Typography>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
