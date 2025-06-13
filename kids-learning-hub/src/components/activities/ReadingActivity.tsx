import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

interface Story {
  title: string;
  content: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

const stories: Story[] = [
  {
    title: "The Friendly Dragon",
    content: `Once upon a time, there was a friendly dragon named Sparky. Unlike other dragons, Sparky didn't like to breathe fire. Instead, he loved to help others and make new friends. One day, he met a little rabbit who was lost in the forest. Sparky used his warm breath to keep the rabbit cozy and helped him find his way home.`,
    questions: [
      {
        question: "What was special about Sparky the dragon?",
        options: [
          "He was the biggest dragon",
          "He didn't like to breathe fire",
          "He could fly the highest",
          "He had the longest tail"
        ],
        correctAnswer: 1
      },
      {
        question: "How did Sparky help the rabbit?",
        options: [
          "He gave the rabbit food",
          "He kept the rabbit warm and helped him home",
          "He taught the rabbit to fly",
          "He built a house for the rabbit"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    title: "The Magic Garden",
    content: `In a small town, there was a magical garden where flowers could talk and trees could dance. The garden was cared for by a kind old woman named Mrs. Green. Every morning, she would water the plants and sing to them. The flowers would bloom brighter, and the trees would sway to her songs.`,
    questions: [
      {
        question: "What was special about the garden?",
        options: [
          "It had the biggest flowers",
          "The flowers could talk and trees could dance",
          "It had the most colors",
          "It was the oldest garden"
        ],
        correctAnswer: 1
      },
      {
        question: "What did Mrs. Green do every morning?",
        options: [
          "She picked flowers",
          "She danced with the trees",
          "She watered plants and sang to them",
          "She talked to the flowers"
        ],
        correctAnswer: 2
      }
    ]
  }
];

const ReadingActivity = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentStory = stories[currentStoryIndex];
  const currentQuestion = currentStory.questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setShowFeedback(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);

      if (currentQuestionIndex < currentStory.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentStoryIndex < stories.length - 1) {
        setCurrentStoryIndex(currentStoryIndex + 1);
        setCurrentQuestionIndex(0);
      }
    }, 2000);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: '#fff' }}>
          <Typography variant="h4" gutterBottom>
            Reading Time!
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom>
            Score: {score}
          </Typography>

          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Typography variant="h5" gutterBottom>
              {currentStory.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {currentStory.content}
            </Typography>

            <FormControl component="fieldset" sx={{ mt: 4 }}>
              <FormLabel component="legend">
                {currentQuestion.question}
              </FormLabel>
              <RadioGroup
                value={selectedAnswer}
                onChange={(e) => handleAnswerSelect(Number(e.target.value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
              >
                Check Answer
              </Button>
            </Box>

            {showFeedback && (
              <Typography
                variant="h6"
                color={selectedAnswer === currentQuestion.correctAnswer ? 'success.main' : 'error.main'}
                sx={{ mt: 2, textAlign: 'center' }}
              >
                {selectedAnswer === currentQuestion.correctAnswer
                  ? 'Correct! 🎉'
                  : 'Try again! 💪'}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ReadingActivity; 