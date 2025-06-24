import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
} from '@mui/material';

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const GameActivity = () => {
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
    initializeGame();
  }, []);

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

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: '#fff' }}>
          <Typography variant="h4" gutterBottom>
            Memory Match Game
          </Typography>
          
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
                sx={{ mt: 2 }}
              >
                Play Again
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default GameActivity; 