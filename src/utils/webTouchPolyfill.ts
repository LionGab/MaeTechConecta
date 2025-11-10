import { Platform } from 'react-native';

let isPatched = false;

export function ensureWebTouchPolyfill(): void {
  if (Platform.OS !== 'web' || isPatched) {
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-commonjs
    const responderModule = require('react-native-web/dist/modules/useResponderEvents/ResponderTouchHistoryStore');
    const responderStore = responderModule?.default ?? responderModule;

    if (!responderStore?.touchHistory || !responderStore?.recordTouchEnd) {
      return;
    }

    const touchHistory = responderStore.touchHistory;

    const originalRecordTouchEnd = responderStore.recordTouchEnd.bind(responderStore);
    responderStore.recordTouchEnd = (touchEvent: any) => {
      const identifier = touchEvent?.identifier ?? touchEvent?.changedTouches?.[0]?.identifier;
      const touchBank = touchHistory?.touchBank;

      if (!touchBank || identifier === undefined || touchBank[identifier]) {
        originalRecordTouchEnd(touchEvent);
        return;
      }

      // Evita warning do React Native Web quando o touchend chega sem touchstart
    };

    if (typeof responderStore.recordTouchMove === 'function') {
      const originalRecordTouchMove = responderStore.recordTouchMove.bind(responderStore);
      responderStore.recordTouchMove = (touchEvent: any) => {
        const identifier = touchEvent?.identifier ?? touchEvent?.changedTouches?.[0]?.identifier;
        const touchBank = touchHistory?.touchBank;

        if (!touchBank || identifier === undefined || touchBank[identifier]) {
          originalRecordTouchMove(touchEvent);
        }
      };
    }

    isPatched = true;
  } catch (error) {
    console.warn('[WebTouchPolyfill] Falha ao aplicar patch do responder:', error);
  }
}

