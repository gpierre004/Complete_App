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
  TablePagination,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
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
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ backgroundColor: '#1976d2' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Stock Portfolio Tracker
          </Typography>
          <Typography sx={{ mr: 2 }}>Welcome, {user?.name}</Typography>
          <IconButton color="inherit" onClick={handleLogout} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Typography color="error" sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
            {error}
          </Typography>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
                Portfolio Overview
              </Typography>
              {Object.keys(portfolioSummary).length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Stock</StyledTableCell>
                        <StyledTableCell align="right">Quantity</StyledTableCell>
                        <StyledTableCell align="right">Total Value</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.values(portfolioSummary).map((position) => (
                        <TableRow 
                          key={position.ticker}
                          sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>{position.ticker}</TableCell>
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
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
                Watchlist
              </Typography>
              {watchlist.length > 0 ? (
                <List>
                  {watchlist.map((item, index) => (
                    <>
                      <ListItem 
                        key={item.id}
                        sx={{ 
                          py: 2,
                          '&:hover': { backgroundColor: '#f5f5f5' }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {item.ticker}
                            </Typography>
                          }
                          secondary={formatCurrency(item.currentPrice)}
                        />
                      </ListItem>
                      {index < watchlist.length - 1 && <Divider />}
                    </>
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary">No stocks in watchlist</Typography>
              )}
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
                Recent Transactions
              </Typography>
              {transactions.length > 0 ? (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Date</StyledTableCell>
                          <StyledTableCell>Type</StyledTableCell>
                          <StyledTableCell>Stock</StyledTableCell>
                          <StyledTableCell align="right">Quantity</StyledTableCell>
                          <StyledTableCell align="right">Price</StyledTableCell>
                          <StyledTableCell align="right">Total</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((transaction) => {
                            const quantity = Number(transaction.quantity);
                            const price = Number(transaction.purchase_price);
                            return (
                              <TableRow 
                                key={transaction.purchase_id}
                                sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                              >
                                <TableCell>{new Date(transaction.purchase_date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{
                                      color: transaction.type === 'BUY' ? '#2e7d32' : '#d32f2f',
                                      fontWeight: 500
                                    }}
                                  >
                                    {transaction.type}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{transaction.ticker}</TableCell>
                                <TableCell align="right">{formatQuantity(quantity)}</TableCell>
                                <TableCell align="right">{formatCurrency(price)}</TableCell>
                                <TableCell align="right">{formatCurrency(quantity * price)}</TableCell>
                              </TableRow>
                            );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={transactions.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                    sx={{ mt: 2 }}
                  />
                </>
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
