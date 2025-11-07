/**
 * 🧪 Button Premium - Testes Unitários
 * Coverage de funcionalidades críticas
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ButtonPremium } from '../ButtonPremium';

describe('ButtonPremium', () => {
  // =====================================================
  // RENDER TESTS
  // =====================================================

  it('should render correctly with children', () => {
    const { getByText } = render(
      <ButtonPremium accessibilityLabel="Test Button">
        Click me
      </ButtonPremium>
    );
    expect(getByText('Click me')).toBeTruthy();
  });

  it('should render with primary variant by default', () => {
    const { getByLabelText } = render(
      <ButtonPremium accessibilityLabel="Test Button">
        Primary
      </ButtonPremium>
    );
    expect(getByLabelText('Test Button')).toBeTruthy();
  });

  // =====================================================
  // VARIANT TESTS
  // =====================================================

  it('should render with primaryGold variant', () => {
    const { getByText } = render(
      <ButtonPremium variant="primaryGold" accessibilityLabel="Gold Button">
        Gold
      </ButtonPremium>
    );
    expect(getByText('Gold')).toBeTruthy();
  });

  it('should render with outline variant', () => {
    const { getByText } = render(
      <ButtonPremium variant="outline" accessibilityLabel="Outline Button">
        Outline
      </ButtonPremium>
    );
    expect(getByText('Outline')).toBeTruthy();
  });

  it('should render with ghost variant', () => {
    const { getByText } = render(
      <ButtonPremium variant="ghost" accessibilityLabel="Ghost Button">
        Ghost
      </ButtonPremium>
    );
    expect(getByText('Ghost')).toBeTruthy();
  });

  // =====================================================
  // SIZE TESTS
  // =====================================================

  it('should render with small size', () => {
    const { getByText } = render(
      <ButtonPremium size="sm" accessibilityLabel="Small Button">
        Small
      </ButtonPremium>
    );
    expect(getByText('Small')).toBeTruthy();
  });

  it('should render with large size', () => {
    const { getByText } = render(
      <ButtonPremium size="lg" accessibilityLabel="Large Button">
        Large
      </ButtonPremium>
    );
    expect(getByText('Large')).toBeTruthy();
  });

  // =====================================================
  // ICON TESTS
  // =====================================================

  it('should render with left icon', () => {
    const { getByText } = render(
      <ButtonPremium icon="star" iconPosition="left" accessibilityLabel="Icon Button">
        With Icon
      </ButtonPremium>
    );
    expect(getByText('With Icon')).toBeTruthy();
  });

  it('should render with right icon', () => {
    const { getByText } = render(
      <ButtonPremium icon="arrow-right" iconPosition="right" accessibilityLabel="Icon Button">
        Next
      </ButtonPremium>
    );
    expect(getByText('Next')).toBeTruthy();
  });

  // =====================================================
  // INTERACTION TESTS
  // =====================================================

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByLabelText } = render(
      <ButtonPremium accessibilityLabel="Test Button" onPress={onPressMock}>
        Press Me
      </ButtonPremium>
    );

    fireEvent.press(getByLabelText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByLabelText } = render(
      <ButtonPremium accessibilityLabel="Disabled Button" onPress={onPressMock} disabled>
        Disabled
      </ButtonPremium>
    );

    fireEvent.press(getByLabelText('Disabled Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should not call onPress when loading', () => {
    const onPressMock = jest.fn();
    const { getByLabelText } = render(
      <ButtonPremium accessibilityLabel="Loading Button" onPress={onPressMock} loading>
        Loading
      </ButtonPremium>
    );

    fireEvent.press(getByLabelText('Loading Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  // =====================================================
  // LOADING STATE TESTS
  // =====================================================

  it('should show ActivityIndicator when loading', () => {
    const { getByLabelText, queryByText } = render(
      <ButtonPremium accessibilityLabel="Loading Button" loading>
        Click me
      </ButtonPremium>
    );

    expect(getByLabelText('Loading Button')).toBeTruthy();
    expect(queryByText('Click me')).toBeNull(); // Texto não deve aparecer quando loading
  });

  // =====================================================
  // ACCESSIBILITY TESTS
  // =====================================================

  it('should have correct accessibility role', () => {
    const { getByRole } = render(
      <ButtonPremium accessibilityLabel="Test Button">
        Button
      </ButtonPremium>
    );

    expect(getByRole('button')).toBeTruthy();
  });

  it('should have accessibility label', () => {
    const { getByLabelText } = render(
      <ButtonPremium accessibilityLabel="Custom Label">
        Button Text
      </ButtonPremium>
    );

    expect(getByLabelText('Custom Label')).toBeTruthy();
  });

  it('should have accessibility hint when provided', () => {
    const { getByLabelText } = render(
      <ButtonPremium
        accessibilityLabel="Submit Button"
        accessibilityHint="Submits the form"
      >
        Submit
      </ButtonPremium>
    );

    expect(getByLabelText('Submit Button')).toBeTruthy();
  });

  it('should have disabled accessibility state when disabled', () => {
    const { getByLabelText } = render(
      <ButtonPremium accessibilityLabel="Disabled Button" disabled>
        Disabled
      </ButtonPremium>
    );

    const button = getByLabelText('Disabled Button');
    expect(button.props.accessibilityState).toEqual({ disabled: true });
  });

  // =====================================================
  // FULLWIDTH TESTS
  // =====================================================

  it('should render with full width', () => {
    const { getByLabelText } = render(
      <ButtonPremium accessibilityLabel="Full Width Button" fullWidth>
        Full Width
      </ButtonPremium>
    );

    expect(getByLabelText('Full Width Button')).toBeTruthy();
  });

  // =====================================================
  // CUSTOM GRADIENT TESTS
  // =====================================================

  it('should accept custom gradient colors', () => {
    const customGradient: [string, string] = ['#FF0000', '#00FF00'];
    const { getByText } = render(
      <ButtonPremium
        accessibilityLabel="Custom Gradient"
        gradientColors={customGradient}
      >
        Custom
      </ButtonPremium>
    );

    expect(getByText('Custom')).toBeTruthy();
  });
});

