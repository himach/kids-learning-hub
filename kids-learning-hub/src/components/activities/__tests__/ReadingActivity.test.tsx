import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReadingActivity from '../ReadingActivity';

describe('ReadingActivity', () => {
  test('renders the initial story and question', () => {
    render(<ReadingActivity />);
    
    // Check if the title is rendered
    expect(screen.getByText('Reading Time!')).toBeInTheDocument();
    
    // Check if the first story title is rendered
    expect(screen.getByText('The Friendly Dragon')).toBeInTheDocument();
    
    // Check if the first question is rendered
    expect(screen.getByText('What was special about Sparky the dragon?')).toBeInTheDocument();
  });

  test('displays all options for the first question', () => {
    render(<ReadingActivity />);
    
    const options = [
      'He was the biggest dragon',
      'He didn\'t like to breathe fire',
      'He could fly the highest',
      'He had the longest tail'
    ];
    
    options.forEach(option => {
      expect(screen.getByLabelText(option)).toBeInTheDocument();
    });
  });

  test('handles correct answer submission', async () => {
    render(<ReadingActivity />);
    
    // Select the correct answer (index 1)
    const correctOption = screen.getByLabelText('He didn\'t like to breathe fire');
    fireEvent.click(correctOption);
    
    // Submit the answer
    const submitButton = screen.getByText('Check Answer');
    fireEvent.click(submitButton);
    
    // Check if success message appears
    await waitFor(() => {
      expect(screen.getByText('Correct! 🎉')).toBeInTheDocument();
    });
    
    // Check if score is updated
    expect(screen.getByText('Score: 1')).toBeInTheDocument();
  });

  test('handles incorrect answer submission', async () => {
    render(<ReadingActivity />);
    
    // Select an incorrect answer (index 0)
    const incorrectOption = screen.getByLabelText('He was the biggest dragon');
    fireEvent.click(incorrectOption);
    
    // Submit the answer
    const submitButton = screen.getByText('Check Answer');
    fireEvent.click(submitButton);
    
    // Check if try again message appears
    await waitFor(() => {
      expect(screen.getByText('Try again! 💪')).toBeInTheDocument();
    });
    
    // Check if score remains at 0
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
  });

  test('disables submit button when no answer is selected', () => {
    render(<ReadingActivity />);
    
    const submitButton = screen.getByText('Check Answer');
    expect(submitButton).toBeDisabled();
  });

  test('moves to next question after correct answer', async () => {
    render(<ReadingActivity />);
    
    // Answer first question correctly
    const correctOption = screen.getByLabelText('He didn\'t like to breathe fire');
    fireEvent.click(correctOption);
    fireEvent.click(screen.getByText('Check Answer'));
    
    // Wait for the feedback message to appear and disappear
    await waitFor(() => {
      expect(screen.getByText('Correct! 🎉')).toBeInTheDocument();
    });
    
    // Wait for the next question to appear (after the 2-second timeout)
    await waitFor(() => {
      expect(screen.getByText('How did Sparky help the rabbit?')).toBeInTheDocument();
    }, { timeout: 3000 }); // Increased timeout to account for the 2-second delay
  });
}); 