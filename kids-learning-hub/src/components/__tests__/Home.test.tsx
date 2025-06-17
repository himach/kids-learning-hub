import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../Home';

// Create a mock for useNavigate
const mockNavigate = jest.fn();

// Mock the module before importing it
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Now import the component that uses useNavigate
import { useNavigate } from 'react-router-dom';

describe('Home Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders all activity sections', () => {
    render(<Home />);
    
    // Check if all activity sections are rendered
    expect(screen.getByText('Math Activities')).toBeInTheDocument();
    expect(screen.getByText('Educational Games')).toBeInTheDocument();
    expect(screen.getByText('Reading & Spelling')).toBeInTheDocument();
  });

  test('displays correct activity descriptions', () => {
    render(<Home />);
    
    // Check activity descriptions
    expect(screen.getByText('Fun math problems and exercises')).toBeInTheDocument();
    expect(screen.getByText('Interactive learning games')).toBeInTheDocument();
    expect(screen.getByText('Reading comprehension and spelling practice')).toBeInTheDocument();
  });

  test('allows setting learning time', () => {
    render(<Home />);
    
    const timeInput = screen.getByLabelText('Total Minutes');
    
    // Test valid input
    fireEvent.change(timeInput, { target: { value: '45' } });
    expect(timeInput).toHaveValue(45);
    
    // Test minimum value
    fireEvent.change(timeInput, { target: { value: '10' } });
    expect(timeInput).toHaveValue(15); // Should default to minimum value
    
    // Test maximum value
    fireEvent.change(timeInput, { target: { value: '150' } });
    expect(timeInput).toHaveValue(120); // Should default to maximum value
  });

  test('navigates to timer with correct time when starting session', () => {
    render(<Home />);
    
    // Set a specific time
    const timeInput = screen.getByLabelText('Total Minutes');
    fireEvent.change(timeInput, { target: { value: '45' } });
    
    // Click start button
    const startButton = screen.getByText('Start Learning Session');
    fireEvent.click(startButton);
    
    // Check if navigation was called with correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('/timer', {
      state: { totalTime: 45 }
    });
  });

  test('displays activity icons', () => {
    render(<Home />);
    
    // Check if all activity icons are present
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons.length).toBeGreaterThan(0);
  });

  test('maintains time input value between renders', () => {
    const { rerender } = render(<Home />);
    
    // Set initial time
    const timeInput = screen.getByLabelText('Total Minutes');
    fireEvent.change(timeInput, { target: { value: '60' } });
    
    // Rerender component
    rerender(<Home />);
    
    // Check if time value is maintained
    expect(screen.getByLabelText('Total Minutes')).toHaveValue(60);
  });
}); 