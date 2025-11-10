/**
 * Sistema de salvamento offline robusto
 * Part of Agent 7 (Performance) + Agent 2 (Backend) collaboration
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

export interface PendingMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  synced: boolean;
}

export interface ChatContext {
  contextData?: any;
  userId?: string;
}

/**
 * Salva mensagem offline para sync posterior
 */
export async function saveOfflineMessage(
  message: string,
  role: 'user' | 'assistant' = 'user',
  context?: ChatContext
): Promise<string> {
  try {
    const id = `offline_${Date.now()}_${Math.random()}`;
    const pendingMessage: PendingMessage = {
      id,
      content: message,
      role,
      timestamp: new Date().toISOString(),
      synced: false,
    };

    // Salvar em lista de pendentes
    const pendingMessages = await getPendingMessages();
    pendingMessages.push(pendingMessage);

    await AsyncStorage.setItem('pending_messages', JSON.stringify(pendingMessages));

    logger.info('Mensagem salva offline', {
      id: id.substring(0, 8),
      role,
      context: context?.userId,
    });

    return id;
  } catch (error) {
    logger.error('Erro ao salvar mensagem offline', error instanceof Error ? error : undefined, {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Recupera todas mensagens pendentes de sync
 */
export async function getPendingMessages(): Promise<PendingMessage[]> {
  try {
    const pendingJson = await AsyncStorage.getItem('pending_messages');
    return pendingJson ? JSON.parse(pendingJson) : [];
  } catch {
    return [];
  }
}

/**
 * Marca mensagem como sincronizada
 */
export async function markMessageAsSynced(messageId: string): Promise<void> {
  try {
    const pendingMessages = await getPendingMessages();
    const updatedMessages = pendingMessages.map((msg) => (msg.id === messageId ? { ...msg, synced: true } : msg));

    await AsyncStorage.setItem('pending_messages', JSON.stringify(updatedMessages));

    // Remover mensagens sincronizadas antigas (mais de 24h)
    await cleanOldSyncedMessages();
  } catch (error) {
    logger.error('Erro ao marcar mensagem como sincronizada', error instanceof Error ? error : undefined, {
      messageId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Remove mensagens sincronizadas antigas
 */
async function cleanOldSyncedMessages() {
  try {
    const pendingMessages = await getPendingMessages();
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    const filteredMessages = pendingMessages.filter((msg) => {
      if (!msg.synced) return true;
      const timestamp = new Date(msg.timestamp).getTime();
      return timestamp > oneDayAgo;
    });

    if (filteredMessages.length !== pendingMessages.length) {
      await AsyncStorage.setItem('pending_messages', JSON.stringify(filteredMessages));
      logger.info(`Removidas ${pendingMessages.length - filteredMessages.length} mensagens sincronizadas antigas`);
    }
  } catch (error) {
    logger.error('Erro ao limpar mensagens antigas', error instanceof Error ? error : undefined, {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Força sync de todas mensagens pendentes
 */
export async function syncPendingMessages(syncFunction: (message: PendingMessage) => Promise<void>): Promise<number> {
  try {
    const pendingMessages = await getPendingMessages();
    const unsyncedMessages = pendingMessages.filter((msg) => !msg.synced);

    let syncedCount = 0;

    for (const message of unsyncedMessages) {
      try {
        await syncFunction(message);
        await markMessageAsSynced(message.id);
        syncedCount++;
      } catch (error) {
        logger.warn(`Falha ao sincronizar mensagem ${message.id}`, { messageId: message.id }, error);
      }
    }

    if (syncedCount > 0) {
      logger.info(`${syncedCount} mensagens sincronizadas offline`);
    }

    return syncedCount;
  } catch (error) {
    logger.error('Erro ao sincronizar mensagens pendentes', error instanceof Error ? error : undefined, {
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
}

/**
 * Verifica se há mensagens pendentes
 */
export async function hasPendingMessages(): Promise<boolean> {
  const pendingMessages = await getPendingMessages();
  return pendingMessages.some((msg) => !msg.synced);
}

/**
 * Limpa todas mensagens pendentes (útil para testes/debug)
 */
export async function clearPendingMessages() {
  try {
    await AsyncStorage.removeItem('pending_messages');
    logger.info('Mensagens pendentes limpas');
  } catch (error) {
    logger.error('Erro ao limpar mensagens pendentes', error instanceof Error ? error : undefined, {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
