import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
} from '@mui/material';

interface MathProblem {
  question: string;
  answer: number;
}

const MathActivity = () => {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const generateProblem = (): MathProblem => {
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
    };
  };

  useEffect(() => {
    setCurrentProblem(generateProblem());
  }, []);

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

          {currentProblem && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h3" gutterBottom>
                {currentProblem.question}
              </Typography>

              <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your answer"
                    type="number"
                  />
                </Grid>
                <Grid item xs={8}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    size="large"
                  >
                    Check Answer
                  </Button>
                </Grid>
              </Grid>

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