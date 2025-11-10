/**
 * Detox E2E Tests - Smoke
 */

describe('Smoke Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('deve fazer login e navegar para dashboard', async () => {
    await expect(element(by.text('Entrar'))).toBeVisible();
    await element(by.text('Entrar')).tap();

    await expect(element(by.id('email-input'))).toBeVisible();
    await element(by.id('email-input')).typeText('user+smoke@nossamaternidade.app');

    await element(by.text('Continuar')).tap();

    await expect(element(by.id('password-input'))).toBeVisible();
    await element(by.id('password-input')).typeText('123456');

    await element(by.text('Confirmar')).tap();

    await expect(element(by.text('Olá, Nath'))).toBeVisible();
    await expect(element(by.text('Plano diário'))).toBeVisible();
  });
});

