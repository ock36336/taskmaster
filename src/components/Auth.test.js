// src/components/Auth.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Auth from './Auth';

test('renders login form', () => {
  render(<Auth />);
  const emailLabel = screen.getByLabelText(/Email/i);
  const passwordLabel = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByText(/Login/i);

  expect(emailLabel).toBeInTheDocument();
  expect(passwordLabel).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
});

test('toggles between login and register', () => {
  render(<Auth />);
  const toggleButton = screen.getByText(/Don't have an account\? Register/i);
  fireEvent.click(toggleButton);
  const registerButton = screen.getByText(/Register/i);
  expect(registerButton).toBeInTheDocument();
});
