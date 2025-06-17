import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, Box, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Import components
import Home from './components/Home';
import ActivityTimer from './components/ActivityTimer';
import MathActivity from './components/activities/MathActivity';
import GameActivity from './components/activities/GameActivity';
import ReadingActivity from './components/activities/ReadingActivity';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#FF9800',
    },
    background: {
      default: '#f0f7ff',
    },
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#2196F3',
    },
    h2: {
      fontSize: '2rem',
      color: '#4CAF50',
    },
  },
});

const ActivityLayout = () => {
  const location = useLocation();
  const kidName = location.state?.kidName || 'Friend';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        p: 2, 
        zIndex: 1000,
        backgroundColor: 'background.default',
        borderBottom: '2px solid #4CAF50'
      }}>
        <Typography variant="h4" align="center" color="primary" sx={{ mb: 2 }}>
          {kidName}'s Learning Adventure
        </Typography>
      </Box>
      <Box sx={{ position: 'fixed', top: 100, right: 0, p: 2, zIndex: 1000 }}>
        <ActivityTimer />
      </Box>
      <Box sx={{ mt: 16, p: 2 }}>
        <Routes>
          <Route path="math" element={<MathActivity />} />
          <Route path="game" element={<GameActivity />} />
          <Route path="reading" element={<ReadingActivity />} />
          <Route path="*" element={<Navigate to="math" replace state={{ kidName }} />} />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timer/*" element={<ActivityLayout />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
