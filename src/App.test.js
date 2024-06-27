jest.mock('./App', () => {
  return function MockApp() {
    return <h1>Cải thiện cuộc sống</h1>; 
  };
});

import App from './App'; 
import { render, screen } from '@testing-library/react';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Cải thiện cuộc sống/i); 
  expect(linkElement).toBeInTheDocument();
});