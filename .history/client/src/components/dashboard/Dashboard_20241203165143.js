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

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'N/A';
  return `$${Number(value).toFixed(2)}`;
};

const formatQuantity = (value) => {
  if (!value && value !== 0) return 'N/A';
  return Number(value).toFixed(2);
};

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

  // Calculate portfolio totals
  const portfolioSummary = transactions.reduce((acc, transaction) => {
    const key = transaction.ticker;
    if (!acc[key]) {
      acc[key] = {
        ticker: transaction.ticker,
        totalQuantity: 0,
        totalValue: 0
      };
    }
    
    const quantity = Number(transaction.quantity);
    const price = Number(transaction.purchase_price);
    acc[key].totalQuantity += quantity;
    acc[key].totalValue += quantity * price;
    
    return acc;
  }, {});

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
              {Object.keys(portfolioSummary).length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Stock</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.values(portfolioSummary).map((position) => (
                        <TableRow key={position.ticker}>
                          <TableCell>{position.ticker}</TableCell>
                          <TableCell align="right">{formatQuantity(position.totalQuantity)}</TableCell>
                          <TableCell align="right">{formatCurrency(position.totalValue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary">No positions found</Typography>
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
                  {watchlist.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemText
                        primary={item.ticker}
                        secondary={formatCurrency(item.currentPrice)}
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
                      {transactions.map((transaction) => {
                        const quantity = Number(transaction.quantity);
                        const price = Number(transaction.purchase_price);
                        return (
                          <TableRow key={transaction.purchase_id}>
                            <TableCell>{new Date(transaction.purchase_date).toLocaleDateString()}</TableCell>
                            <TableCell>{transaction.type}</TableCell>
                            <TableCell>{transaction.ticker}</TableCell>
                            <TableCell align="right">{formatQuantity(quantity)}</TableCell>
                            <TableCell align="right">{formatCurrency(price)}</TableCell>
                            <TableCell align="right">{formatCurrency(quantity * price)}</TableCell>
                          </TableRow>
                        );
                      })}
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
