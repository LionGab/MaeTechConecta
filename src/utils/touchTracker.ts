/**
 * Touch Event Tracker
 *
 * Gerencia eventos de toque com validação para evitar touchend órfãos
 */

interface TouchRecord {
  identifier: number;
  startTime: number;
  startX: number;
  startY: number;
}

export class TouchTracker {
  private touchBank: Record<number, TouchRecord> = {};

  /**
   * Registra um touchstart
   */
  recordTouchStart(touchEvent: TouchEvent | any): void {
    const touchId = touchEvent.identifier ?? touchEvent.nativeEvent?.identifier;
    if (touchId === undefined) {
      console.warn('TouchStart sem identifier, ignorando');
      return;
    }

    const touch = touchEvent.touches?.[0] ?? touchEvent.nativeEvent ?? touchEvent;

    this.touchBank[touchId] = {
      identifier: touchId,
      startTime: Date.now(),
      startX: touch.clientX ?? touch.pageX ?? 0,
      startY: touch.clientY ?? touch.pageY ?? 0,
    };
  }

  /**
   * Processa touchend com validação
   */
  handleTouchEnd(touchEvent: TouchEvent | any): void {
    const touchId = touchEvent.identifier ?? touchEvent.nativeEvent?.identifier;

    // Verifica se existe touchstart registrado
    if (!this.touchBank[touchId]) {
      console.warn('TouchEnd sem TouchStart, ignorando');
      return; // Ignora touchend órfão
    }

    // Processa normalmente
    this.recordTouchEnd(touchEvent);
  }

  /**
   * Registra um touchend válido
   */
  recordTouchEnd(touchEvent: TouchEvent | any): void {
    const touchId = touchEvent.identifier ?? touchEvent.nativeEvent?.identifier;
    const touch = touchEvent.changedTouches?.[0] ?? touchEvent.nativeEvent ?? touchEvent;

    const record = this.touchBank[touchId];
    if (!record) return;

    const duration = Date.now() - record.startTime;
    const endX = touch.clientX ?? touch.pageX ?? 0;
    const endY = touch.clientY ?? touch.pageY ?? 0;
    const deltaX = endX - record.startX;
    const deltaY = endY - record.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Remove do banco após processar
    delete this.touchBank[touchId];

    // Aqui você pode adicionar lógica adicional de tracking
    // Por exemplo: analytics.track('touch_gesture', { duration, distance });
  }

  /**
   * Limpa todos os toques pendentes
   */
  clear(): void {
    this.touchBank = {};
  }

  /**
   * Limpa toques antigos (mais de 5 segundos)
   */
  cleanup(): void {
    const now = Date.now();
    const maxAge = 5000; // 5 segundos

    for (const touchId in this.touchBank) {
      const record = this.touchBank[touchId];
      if (record && now - record.startTime > maxAge) {
        delete this.touchBank[touchId];
      }
    }
  }
}

// Instância singleton para uso global
export const touchTracker = new TouchTracker();
