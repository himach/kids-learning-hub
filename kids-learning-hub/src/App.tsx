import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ position: 'fixed', top: 0, right: 0, p: 2, zIndex: 1000 }}>
        <ActivityTimer />
      </Box>
      <Box sx={{ mt: 8, p: 2 }}>
        <Routes>
          <Route path="math" element={<MathActivity />} />
          <Route path="game" element={<GameActivity />} />
          <Route path="reading" element={<ReadingActivity />} />
          <Route path="*" element={<Navigate to="math" replace />} />
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
