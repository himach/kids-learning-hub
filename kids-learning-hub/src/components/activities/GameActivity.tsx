import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PsychologyIcon from '@mui/icons-material/Psychology';

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const GameActivity = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<'selection' | 'memory' | 'space'>('selection');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const initializeGame = () => {
    const duplicatedEmojis = [...emojis, ...emojis];
    const shuffledEmojis = duplicatedEmojis.sort(() => Math.random() - 0.5);
    
    const newCards = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
  };

  useEffect(() => {
    if (selectedGame === 'memory') {
      initializeGame();
    }
  }, [selectedGame]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isMatched || cards[cardId].isFlipped) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);

    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      const firstCard = cards[flippedCards[0]];
      const secondCard = cards[cardId];

      if (firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          setCards(cards.map(card =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true }
              : card
          ));
          setFlippedCards([]);

          // Check if game is complete
          const allMatched = newCards.every(card => card.isMatched);
          if (allMatched) {
            setGameComplete(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(cards.map(card =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleBackToSelection = () => {
    setSelectedGame('selection');
    setGameComplete(false);
  };

  // Game Selection Screen
  if (selectedGame === 'selection') {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, backgroundColor: '#fff' }}>
            <Typography variant="h4" gutterBottom>
              Choose Your Game!
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3, 
              mt: 3 
            }}>
              <Card 
                sx={{ 
                  cursor: 'pointer', 
                  height: 200,
                  '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' }
                }}
                onClick={() => setSelectedGame('memory')}
              >
                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <PsychologyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Memory Match
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Match the emoji pairs to test your memory!
                  </Typography>
                </CardContent>
              </Card>
              
              <Card 
                sx={{ 
                  cursor: 'pointer', 
                  height: 200,
                  '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' }
                }}
                onClick={() => navigate('/space-defender')}
              >
                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <SportsEsportsIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Space Defender
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Defend Earth from invading aliens!
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Memory Match Game
  if (selectedGame === 'memory') {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, backgroundColor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBackToSelection}
                sx={{ minWidth: 'auto' }}
              >
                ← Back to Games
              </Button>
              <Typography variant="h4">
                Memory Match Game
              </Typography>
              <Box sx={{ minWidth: 'auto' }}></Box> {/* Spacer for centering */}
            </Box>
            
            <Typography variant="h6" color="primary" gutterBottom>
              Moves: {moves}
            </Typography>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              gap: 2,
              mt: 2 
            }}>
              {cards.map((card) => (
                <Card
                  key={card.id}
                  sx={{
                    height: 100,
                    cursor: 'pointer',
                    transform: card.isFlipped ? 'rotateY(180deg)' : 'none',
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => handleCardClick(card.id)}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      fontSize: '2rem',
                      backgroundColor: card.isMatched ? '#e8f5e9' : '#fff',
                    }}
                  >
                    {card.isFlipped ? card.emoji : '❓'}
                  </CardContent>
                </Card>
              ))}
            </Box>

            {gameComplete && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" color="success.main" gutterBottom>
                  Congratulations! You won! 🎉
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={initializeGame}
                  sx={{ mt: 2, mr: 2 }}
                >
                  Play Again
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleBackToSelection}
                  sx={{ mt: 2 }}
                >
                  Back to Games
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    );
  }

  return null;
};

export default GameActivity; 