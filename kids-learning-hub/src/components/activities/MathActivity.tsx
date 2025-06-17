import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

interface MathProblem {
  question: string;
  answer: number;
  type: 'basic' | 'measurement' | 'time';
  unit?: string;
}

const MathActivity = () => {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [problemType, setProblemType] = useState<'basic' | 'measurement' | 'time'>('basic');

  const generateBasicProblem = (): MathProblem => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;

    // Ensure subtraction doesn't result in negative numbers
    if (operation === '-' && num2 > num1) {
      [num1, num2] = [num2, num1];
    }

    let answer: number;
    switch (operation) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
      default:
        answer = 0;
    }

    return {
      question: `${num1} ${operation} ${num2} = ?`,
      answer,
      type: 'basic'
    };
  };

  const generateMeasurementProblem = (): MathProblem => {
    const measurements = [
      { unit: 'cm', min: 1, max: 50 },
      { unit: 'm', min: 1, max: 10 },
      { unit: 'kg', min: 1, max: 20 },
      { unit: 'L', min: 1, max: 10 }
    ];
    const measurement = measurements[Math.floor(Math.random() * measurements.length)];
    const num1 = Math.floor(Math.random() * (measurement.max - measurement.min + 1)) + measurement.min;
    const num2 = Math.floor(Math.random() * (measurement.max - measurement.min + 1)) + measurement.min;
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let answer: number;
    if (operation === '+') {
      answer = num1 + num2;
    } else {
      answer = Math.abs(num1 - num2);
    }

    return {
      question: `What is ${num1} ${measurement.unit} ${operation} ${num2} ${measurement.unit}?`,
      answer,
      type: 'measurement',
      unit: measurement.unit
    };
  };

  const generateTimeProblem = (): MathProblem => {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 60);
    const addHours = Math.floor(Math.random() * 5) + 1;
    const addMinutes = Math.floor(Math.random() * 60);

    const startTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
    const totalMinutes = (hours * 60 + minutes) + (addHours * 60 + addMinutes);
    const newHours = Math.floor(totalMinutes / 60) % 12 || 12;
    const newMinutes = totalMinutes % 60;

    return {
      question: `If it's ${startTime} and you add ${addHours} hours and ${addMinutes} minutes, what time will it be? (Answer in hours only)`,
      answer: newHours,
      type: 'time'
    };
  };

  const generateProblem = (): MathProblem => {
    switch (problemType) {
      case 'measurement':
        return generateMeasurementProblem();
      case 'time':
        return generateTimeProblem();
      default:
        return generateBasicProblem();
    }
  };

  useEffect(() => {
    setCurrentProblem(generateProblem());
  }, [problemType]);

  const handleSubmit = () => {
    if (!currentProblem) return;

    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    setFeedback(isCorrect ? 'Correct! 🎉' : 'Try again! 💪');
    
    if (isCorrect) {
      setScore(score + 1);
      setCurrentProblem(generateProblem());
      setUserAnswer('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: '#fff' }}>
          <Typography variant="h4" gutterBottom>
            Math Challenge
          </Typography>
          
          <Typography variant="h6" color="primary" gutterBottom>
            Score: {score}
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Problem Type</InputLabel>
            <Select
              value={problemType}
              label="Problem Type"
              onChange={(e) => setProblemType(e.target.value as 'basic' | 'measurement' | 'time')}
            >
              <MenuItem value="basic">Basic Math</MenuItem>
              <MenuItem value="measurement">Measurements</MenuItem>
              <MenuItem value="time">Time Problems</MenuItem>
            </Select>
          </FormControl>

          {currentProblem && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                {currentProblem.question}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your answer"
                  type="number"
                  InputProps={{
                    endAdornment: currentProblem.unit && (
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {currentProblem.unit}
                      </Typography>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  size="large"
                >
                  Check Answer
                </Button>
              </Box>

              {feedback && (
                <Typography
                  variant="h6"
                  color={feedback.includes('Correct') ? 'success.main' : 'error.main'}
                  sx={{ mt: 2 }}
                >
                  {feedback}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default MathActivity; 