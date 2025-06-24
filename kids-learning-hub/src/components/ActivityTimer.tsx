import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  LinearProgress,
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
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#e3f2fd',
            boxShadow: 2,
            py: 1,
            px: 2,
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mx: 'auto',
          }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mr: 2 }}>
              {activities[currentActivityIndex].name} Activity
            </Typography>
            <TimerIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', mr: 2 }}>
              {formatTime(timeLeft)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsActive(!isActive)}
              size="medium"
              sx={{ minWidth: 110, fontWeight: 'bold', boxShadow: 3 }}
            >
              {isActive ? 'Pause' : 'Resume'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ActivityTimer; 