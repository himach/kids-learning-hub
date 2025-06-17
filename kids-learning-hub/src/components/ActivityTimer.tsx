import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';

interface Activity {
  name: string;
  duration: number;
  path: string;
}

const ActivityTimer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const totalTime = location.state?.totalTime || 30;
  const kidName = location.state?.kidName || 'Friend';
  const [timeLeft, setTimeLeft] = useState(totalTime * 60);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const activities = useMemo(() => [
    { name: 'Math', duration: totalTime / 3, path: '/timer/math' },
    { name: 'Games', duration: totalTime / 3, path: '/timer/game' },
    { name: 'Reading', duration: totalTime / 3, path: '/timer/reading' },
  ], [totalTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            clearInterval(interval);
            if (currentActivityIndex < activities.length - 1) {
              const nextIndex = currentActivityIndex + 1;
              setCurrentActivityIndex(nextIndex);
              navigate(activities[nextIndex].path, { state: { totalTime, kidName } });
              return activities[nextIndex].duration * 60;
            } else {
              setIsActive(false);
              navigate('/', { state: { kidName } });
              return 0;
            }
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentActivityIndex, activities, navigate, totalTime, kidName]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="primary">
          {kidName}'s Learning Time!
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 2, backgroundColor: '#fff', maxWidth: 400, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            {activities[currentActivityIndex].name} Activity
          </Typography>
          
          <Box sx={{ position: 'relative', display: 'inline-flex', mt: 2 }}>
            <CircularProgress
              variant="determinate"
              value={(timeLeft / (activities[currentActivityIndex].duration * 60)) * 100}
              size={120}
              thickness={4}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" component="div" color="text.secondary">
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsActive(!isActive)}
              startIcon={<TimerIcon />}
              size="large"
            >
              {isActive ? 'Pause' : 'Resume'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ActivityTimer; 