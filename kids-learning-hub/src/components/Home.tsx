import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Home = () => {
  const navigate = useNavigate();
  const [totalTime, setTotalTime] = useState(30);
  const [kidName, setKidName] = useState('');

  const handleStart = () => {
    if (!kidName.trim()) {
      alert('Please enter your name to start!');
      return;
    }
    navigate('/timer', { state: { totalTime, kidName } });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h1" gutterBottom>
          Kids Learning Hub
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Fun Learning Activities for Kids!
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: '#fff' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Let's Get Started!
              </Typography>
              <TextField
                label="Your Name"
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                sx={{ width: 200, mb: 2 }}
                required
                error={!kidName.trim()}
                helperText={!kidName.trim() ? "Please enter your name" : ""}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Set Your Learning Time
                </Typography>
                <TextField
                  type="number"
                  label="Total Minutes"
                  value={totalTime}
                  onChange={(e) => setTotalTime(Number(e.target.value))}
                  InputProps={{ inputProps: { min: 15, max: 120 } }}
                  sx={{ width: 200 }}
                />
              </Box>
            </Box>
            <Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<TimerIcon />}
                onClick={handleStart}
                sx={{ mt: 2 }}
                disabled={!kidName.trim()}
              >
                Start Learning Session
              </Button>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3, 
          mt: 4 
        }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6">Math Activities</Typography>
            <Typography variant="body2" color="text.secondary">
              Fun math problems and exercises
            </Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <SportsEsportsIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
            <Typography variant="h6">Educational Games</Typography>
            <Typography variant="body2" color="text.secondary">
              Interactive learning games
            </Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <MenuBookIcon sx={{ fontSize: 60, color: 'success.main' }} />
            <Typography variant="h6">Reading & Spelling</Typography>
            <Typography variant="body2" color="text.secondary">
              Reading comprehension and spelling practice
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 