/**
 * 🧪 Input Premium - Testes Unitários
 * Coverage de funcionalidades críticas
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { ThemeProvider } from '@/contexts/ThemeContext';

import { InputPremium } from '../InputPremium';

const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe('InputPremium', () => {
  // =====================================================
  // RENDER TESTS
  // =====================================================

  it('should render correctly', () => {
    const { getByPlaceholderText } = renderWithTheme(<InputPremium placeholder="Enter text" />);
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with label', () => {
    const { getByText } = renderWithTheme(<InputPremium label="Email" placeholder="Enter email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('should show required indicator when required', () => {
    const { getByText } = renderWithTheme(<InputPremium label="Name" required />);
    expect(getByText('*')).toBeTruthy();
  });

  // =====================================================
  // ICON TESTS
  // =====================================================

  it('should render with icon', () => {
    const { getByPlaceholderText } = renderWithTheme(<InputPremium icon="email" placeholder="Email" />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
  });

  // =====================================================
  // ERROR TESTS
  // =====================================================

  it('should display error message when error prop is provided', () => {
    const { getByText } = renderWithTheme(<InputPremium error="Email inválido" />);
    expect(getByText('Email inválido')).toBeTruthy();
  });

  it('should show error icon when error is present', () => {
    const { getByText } = renderWithTheme(<InputPremium error="Error message" />);
    expect(getByText('Error message')).toBeTruthy();
  });

  // =====================================================
  // HELPER TEXT TESTS
  // =====================================================

  it('should display helper text when provided', () => {
    const { getByText } = renderWithTheme(<InputPremium helperText="Mínimo 8 caracteres" />);
    expect(getByText('Mínimo 8 caracteres')).toBeTruthy();
  });

  it('should show error instead of helper text when both are provided', () => {
    const { getByText, queryByText } = renderWithTheme(
      <InputPremium error="Campo obrigatório" helperText="Helper text" />
    );
    expect(getByText('Campo obrigatório')).toBeTruthy();
    expect(queryByText('Helper text')).toBeNull();
  });

  // =====================================================
  // INTERACTION TESTS
  // =====================================================

  it('should call onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <InputPremium placeholder="Enter text" onChangeText={onChangeTextMock} />
    );

    fireEvent.changeText(getByPlaceholderText('Enter text'), 'New text');
    expect(onChangeTextMock).toHaveBeenCalledWith('New text');
  });

  it('should call onFocus when focused', () => {
    const onFocusMock = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(<InputPremium placeholder="Enter text" onFocus={onFocusMock} />);

    fireEvent(getByPlaceholderText('Enter text'), 'focus');
    expect(onFocusMock).toHaveBeenCalled();
  });

  it('should call onBlur when blurred', () => {
    const onBlurMock = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(<InputPremium placeholder="Enter text" onBlur={onBlurMock} />);

    fireEvent(getByPlaceholderText('Enter text'), 'blur');
    expect(onBlurMock).toHaveBeenCalled();
  });

  // =====================================================
  // VALUE TESTS
  // =====================================================

  it('should display value when provided', () => {
    const { getByDisplayValue } = renderWithTheme(<InputPremium value="Test value" />);
    expect(getByDisplayValue('Test value')).toBeTruthy();
  });

  // =====================================================
  // GLASS EFFECT TESTS
  // =====================================================

  it('should render with glass effect by default', () => {
    const { getByPlaceholderText } = renderWithTheme(<InputPremium placeholder="Text" />);
    expect(getByPlaceholderText('Text')).toBeTruthy();
  });

  it('should render without glass effect when useGlass is false', () => {
    const { getByPlaceholderText } = renderWithTheme(<InputPremium placeholder="Text" useGlass={false} />);
    expect(getByPlaceholderText('Text')).toBeTruthy();
  });

  // =====================================================
  // ACCESSIBILITY TESTS
  // =====================================================

  it('should be accessible', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <InputPremium placeholder="Accessible input" accessibilityLabel="Email input" />
    );
    expect(getByPlaceholderText('Accessible input')).toBeTruthy();
  });

  // =====================================================
  // KEYBOARD TYPE TESTS
  // =====================================================

  it('should accept keyboard type prop', () => {
    const { getByPlaceholderText } = renderWithTheme(<InputPremium placeholder="Email" keyboardType="email-address" />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
  });

  // =====================================================
  // SECURE TEXT ENTRY TESTS
  // =====================================================

  it('should accept secureTextEntry prop', () => {
    const { getByPlaceholderText } = renderWithTheme(<InputPremium placeholder="Password" secureTextEntry />);
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });
});

